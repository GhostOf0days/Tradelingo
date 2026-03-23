import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import tls from 'tls';
import { fileURLToPath } from 'url';
import { MongoClient, Collection, Db } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Database Class ---
class Database {
  private client: MongoClient;
  private db: Db | null = null;
  public usersCollection: Collection | null = null;

  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000,
      checkServerIdentity: this.checkServerIdentitySafe.bind(this),
    });
  }

  private checkServerIdentitySafe(
    hostname: string,
    cert: tls.PeerCertificate | undefined | null
  ): Error | undefined {
    if (cert == null) return undefined;
    return tls.checkServerIdentity(hostname, cert);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db('tradelingo');
    this.usersCollection = this.db.collection('users');
    console.log('✅ Connected to MongoDB');
    await this.runMigrations();
  }

  private async runMigrations(): Promise<void> {
    if (!this.usersCollection) return;
    try {
      await this.usersCollection.updateMany(
        { lastUnlockedModuleId: { $exists: false } },
        { $set: { lastUnlockedModuleId: 1 } }
      );
      await this.usersCollection.updateMany(
        { progressByModuleId: { $exists: false } },
        { $set: { progressByModuleId: {} } }
      );
      await this.usersCollection.updateMany(
        { completedModules: { $exists: false } },
        { $set: { completedModules: [] } }
      );
    } catch (error) {
      console.error('Migration error:', error);
    }
  }
}

// --- Controller Class ---
class UserController {
  private usersCollection: Collection;

  constructor(usersCollection: Collection) {
    this.usersCollection = usersCollection;
  }

  public register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const existingUser = await this.usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        email,
        password: hashedPassword,
        displayName: email.split('@')[0],
        experiencePoints: 0,
        lastUnlockedModuleId: 1,
        progressByModuleId: {},
        streakDays: 0,
        lastActivityDate: null,
        completedModules: [],
        createdAt: new Date(),
      };

      await this.usersCollection.insertOne(newUser);

      res.status(201).json({
        email: newUser.email,
        displayName: newUser.displayName,
        experiencePoints: newUser.experiencePoints,
        streakDays: newUser.streakDays,
        lastActivityDate: newUser.lastActivityDate,
        lastUnlockedModuleId: newUser.lastUnlockedModuleId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.usersCollection.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.status(200).json({
        email: user.email,
        displayName: user.displayName,
        experiencePoints: user.experiencePoints,
        streakDays: user.streakDays || 0,
        lastActivityDate: user.lastActivityDate,
        lastUnlockedModuleId: user.lastUnlockedModuleId || 1,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error during login' });
    }
  };

  public updateXP = async (req: Request, res: Response) => {
    try {
      const { email, xpToAdd } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required' });

      const result = await this.usersCollection.findOneAndUpdate(
        { email: email },
        { $inc: { experiencePoints: xpToAdd } },
        { returnDocument: 'after' }
      );

      if (!result) return res.status(404).json({ error: 'User not found' });
      res.status(200).json({ experiencePoints: result.experiencePoints });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error updating XP' });
    }
  };

  public getProgress = async (req: Request, res: Response) => {
    try {
      const user = await this.usersCollection.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({
        lastUnlockedModuleId: user.lastUnlockedModuleId || 1,
        progressByModuleId: user.progressByModuleId || {},
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error fetching progress' });
    }
  };

  public completeLesson = async (req: Request, res: Response) => {
    try {
      const { email, moduleId, xpToAdd } = req.body;
      if (!email || !moduleId) {
        return res.status(400).json({ error: 'Email and moduleId are required' });
      }

      const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
      const result = await this.usersCollection.findOneAndUpdate(
        { email },
        { $inc: { experiencePoints: xpToAdd, [progressField]: 1 } },
        { returnDocument: 'after' }
      );

      if (!result) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({
        experiencePoints: result.experiencePoints,
        progressByModuleId: result.progressByModuleId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error updating lesson progress' });
    }
  };

  public passModule = async (req: Request, res: Response) => {
    try {
      const { email, moduleId, xpToAdd, totalLessons } = req.body;
      const user = await this.usersCollection.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
      let newUnlocked = user.lastUnlockedModuleId;
      if (moduleId == user.lastUnlockedModuleId) {
        newUnlocked = moduleId + 1;
      }

      const result = await this.usersCollection.findOneAndUpdate(
        { email: email },
        {
          $set: {
            [progressField]: totalLessons,
            lastUnlockedModuleId: newUnlocked,
          },
          $inc: { experiencePoints: xpToAdd },
        },
        { returnDocument: 'after' }
      );

      res.status(200).json({
        experiencePoints: result?.experiencePoints,
        lastUnlockedModuleId: result?.lastUnlockedModuleId,
        progressByModuleId: result?.progressByModuleId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error updating pre-test progress' });
    }
  };

  public updateStreak = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await this.usersCollection.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = user.lastActivityDate;
      let newStreakDays = user.streakDays || 0;

      if (lastActivity !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActivity === yesterdayStr) {
          newStreakDays += 1;
        } else if (!lastActivity) {
          newStreakDays = 1;
        } else {
          newStreakDays = 1;
        }
      }

      const result = await this.usersCollection.findOneAndUpdate(
        { email },
        {
          $set: {
            lastActivityDate: today,
            streakDays: newStreakDays,
          },
        },
        { returnDocument: 'after' }
      );

      res.status(200).json({
        streakDays: result?.streakDays,
        lastActivityDate: result?.lastActivityDate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error updating streak' });
    }
  };

  public getCompletedModules = async (req: Request, res: Response) => {
    try {
      const user = await this.usersCollection.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user.completedModules || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error fetching completed modules' });
    }
  };

  public completeModule = async (req: Request, res: Response) => {
    try {
      const { email, moduleId, title, score, xpEarned, lessonsTotal } = req.body;
      if (!email || !moduleId) {
        return res.status(400).json({ error: 'Email and moduleId are required' });
      }

      const completedDate = new Date().toISOString().split('T')[0];
      const completedModule = {
        moduleId,
        title,
        description: `Completed module for ${title}`,
        completedDate,
        xpEarned: xpEarned || 0,
        score: score || 0,
        lessons: lessonsTotal || 0,
      };

      const user = await this.usersCollection.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newUnlockedId = Math.max(user.lastUnlockedModuleId || 1, moduleId + 1);

      const result = await this.usersCollection.findOneAndUpdate(
        { email },
        {
          $push: { completedModules: completedModule },
          $set: { lastUnlockedModuleId: newUnlockedId },
        } as any,
        { returnDocument: 'after' }
      );

      if (!result) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({
        message: 'Module marked as completed',
        completedModules: result.completedModules,
        lastUnlockedModuleId: result.lastUnlockedModuleId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error completing module' });
    }
  };

  public getUserProfile = async (req: Request, res: Response) => {
    try {
      const user = await this.usersCollection.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({
        email: user.email,
        displayName: user.displayName,
        experiencePoints: user.experiencePoints,
        streakDays: user.streakDays || 0,
        lastActivityDate: user.lastActivityDate,
        lastUnlockedModuleId: user.lastUnlockedModuleId,
        progressByModuleId: user.progressByModuleId || {},
        completedModules: user.completedModules || [],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error fetching user profile' });
    }
  };
}

// --- Server Class ---
class AppServer {
  public app: express.Application;
  private database: Database;
  private controller: UserController | null = null;

  constructor(uri: string) {
    this.app = express();
    this.database = new Database(uri);
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    if (!this.controller) return;

    this.app.post('/api/register', this.controller.register);
    this.app.post('/api/login', this.controller.login);
    this.app.post('/api/update-xp', this.controller.updateXP);
    this.app.get('/api/progress/:email', this.controller.getProgress);
    this.app.post('/api/complete-lesson', this.controller.completeLesson);
    this.app.post('/api/pass-module', this.controller.passModule);
    this.app.post('/api/update-streak', this.controller.updateStreak);
    this.app.get('/api/completed-modules/:email', this.controller.getCompletedModules);
    this.app.post('/api/complete-module', this.controller.completeModule);
    this.app.get('/api/user/:email', this.controller.getUserProfile);

    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(__dirname, '..', 'dist');
      this.app.use(express.static(distPath));
      this.app.get('/{*path}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }
  }

  public async start(): Promise<void> {
    await this.database.connect();
    if (this.database.usersCollection) {
      this.controller = new UserController(this.database.usersCollection);
      this.setupRoutes();
      
      const PORT = Number(process.env.PORT) || 3000;
      if (process.env.NODE_ENV !== 'test') {
        this.app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
        });
      }
    }
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add your MONGODB_URI to the .env file');

const server = new AppServer(uri);
server.start();

export const app = server.app;
