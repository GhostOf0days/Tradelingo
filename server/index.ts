import express from 'express';
import cors from 'cors';
import path from 'path';
import tls from 'tls';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add your MONGODB_URI to the .env file');

// when running under Bun, TLS can pass null cert into checkServerIdentity. TLS bug. guard so don't throw.
function checkServerIdentitySafe(
  hostname: string,
  cert: tls.PeerCertificate | undefined | null
): Error | undefined {
  if (cert == null) return undefined;
  return tls.checkServerIdentity(hostname, cert);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
  checkServerIdentity: checkServerIdentitySafe,
});
const db = client.db('tradelingo');
const usersCollection = db.collection('users');
const modulesCollection = db.collection('modules');

const calculateLevel = (xp: number): number => {
  if (xp < 1000) return 1;
  if (xp < 2500) return 2;
  if (xp < 4500) return 3;
  if (xp < 7000) return 4;
  if (xp < 10000) return 5;
  return 5 + Math.floor((xp - 10000) / 5000);
};

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 320) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      email: normalizedEmail,
      password: hashedPassword,
      displayName: email.split('@')[0],
      experiencePoints: 0,
      level: 1,
      lastUnlockedModuleId: 1,
      progressByModuleId: {},
      streakDays: 0,
      lastActivityDate: null,
      completedModules: [],
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      email: newUser.email,
      displayName: newUser.displayName,
      experiencePoints: newUser.experiencePoints,
      level: newUser.level,
      streakDays: newUser.streakDays,
      lastActivityDate: newUser.lastActivityDate,
      lastUnlockedModuleId: newUser.lastUnlockedModuleId,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// login: compare with hashed password
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await usersCollection.findOne({ email: normalizedEmail });

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
      level: user.level || calculateLevel(user.experiencePoints || 0),
      streakDays: user.streakDays || 0,
      lastActivityDate: user.lastActivityDate,
      lastUnlockedModuleId: user.lastUnlockedModuleId || 1,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/update-xp', async (req, res) => {
  try {
    const { email, xpToAdd } = req.body;
    if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required' });
    if (typeof xpToAdd !== 'number' || xpToAdd < 0 || xpToAdd > 10000) {
      return res.status(400).json({ error: 'xpToAdd must be a number between 0 and 10000' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newXp = (user.experiencePoints || 0) + xpToAdd;
    const newLevel = calculateLevel(newXp);

    const result = await usersCollection.findOneAndUpdate(
      { email: email },
      { $set: { experiencePoints: newXp, level: newLevel } },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ experiencePoints: result.experiencePoints, level: result.level });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error updating XP' });
  }
});

// progress: lastUnlockedModuleId, progressByModuleId per module
app.get('/api/progress/:email', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      lastUnlockedModuleId: user.lastUnlockedModuleId || 1,
      progressByModuleId: user.progressByModuleId || {},
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

// fetch all module from database
app.get('/api/modules', async (_req, res) => {
  try {
    const modules = await modulesCollection
      .find({}, { projection: { lessons: 0 } }) // exclude lessons, only return pretest
      .sort({ moduleId: 1 })
      .toArray();
    res.status(200).json(modules);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error fetching modules' });
  }
});

// fetch a single module
app.get('/api/modules/:moduleId', async (req, res) => {
  try {
    const module = await modulesCollection.findOne({ 
      moduleId: Number(req.params.moduleId) 
    });
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.status(200).json(module);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error fetching module' });
  }
});

app.post('/api/complete-lesson', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!moduleId || typeof moduleId !== 'number') {
      return res.status(400).json({ error: 'Valid moduleId is required' });
    }
    const safeXp = Math.max(0, Math.min(10000, Number(xpToAdd) || 0));

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newXp = (user.experiencePoints || 0) + safeXp;
    const newLevel = calculateLevel(newXp);
    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;

    const result = await usersCollection.findOneAndUpdate(
      { email },
      { 
        $set: { experiencePoints: newXp, level: newLevel },
        $inc: { [progressField]: 1 } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      experiencePoints: result.experiencePoints,
      level: result.level,
      progressByModuleId: result.progressByModuleId,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error updating lesson progress' });
  }
});

// lightning-round: add XP based on performance
app.post('/api/lighting-round', async (req, res) => {
  try {
    const { email, xpEarned } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newXp = (user.experiencePoints || 0) + xpEarned;
    const newLevel = calculateLevel(newXp);

    const result = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          experiencePoints: newXp,
          level: newLevel,
        }
      },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      experiencePoints: result?.experiencePoints,
      level: result?.level,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error updating Lightning Round XP' });
  }
});

// pass-module: pretest passed — set lesson count to total, unlock next module
app.post('/api/pass-module', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd, totalLessons } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newXp = (user.experiencePoints || 0) + xpToAdd;
    const newLevel = calculateLevel(newXp);
    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
    let newUnlocked = user.lastUnlockedModuleId;
    if (moduleId == user.lastUnlockedModuleId) {
      newUnlocked = moduleId + 1; // unlock next
    }

    const result = await usersCollection.findOneAndUpdate(
      { email: email },
      {
        $set: {
          [progressField]: totalLessons,
          lastUnlockedModuleId: newUnlocked,
          experiencePoints: newXp,
          level: newLevel
        },
      },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      experiencePoints: result?.experiencePoints,
      level: result?.level,
      lastUnlockedModuleId: result?.lastUnlockedModuleId,
      progressByModuleId: result?.progressByModuleId,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error updating pre-test progress' });
  }
});

app.post('/api/update-streak', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = user.lastActivityDate;
    let newStreakDays = user.streakDays || 0;

    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        newStreakDays += 1; // continue streak
      } else if (!lastActivity) {
        newStreakDays = 1; // first activity
      } else {
        newStreakDays = 1; // gap, reset
      }
    }

    const result = await usersCollection.findOneAndUpdate(
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
    console.warn(error);
    res.status(500).json({ error: 'Server error updating streak' });
  }
});

app.get('/api/completed-modules/:email', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.completedModules || []);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error fetching completed modules' });
  }
});

app.post('/api/complete-module', async (req, res) => {
  try {
    const { email, moduleId, title, score, xpEarned, lessonsTotal } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!moduleId || typeof moduleId !== 'number') {
      return res.status(400).json({ error: 'Valid moduleId is required' });
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

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newUnlockedId = Math.max(user.lastUnlockedModuleId || 1, moduleId + 1);

    const result = await usersCollection.findOneAndUpdate(
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
    console.warn(error);
    res.status(500).json({ error: 'Server error completing module' });
  }
});

app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.params.email });
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
    console.warn(error);
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

// production: serve frontend and SPA fallback
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('/{*path}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// add missing fields for legacy users
async function runMigrations() {
  try {
    await usersCollection.updateMany(
      { lastUnlockedModuleId: { $exists: false } },
      { $set: { lastUnlockedModuleId: 1 } }
    );
    await usersCollection.updateMany(
      { progressByModuleId: { $exists: false } },
      { $set: { progressByModuleId: {} } }
    );
    await usersCollection.updateMany(
      { completedModules: { $exists: false } },
      { $set: { completedModules: [] } }
    );
  } catch (error) {
    console.warn(error);
  }
}

const PORT = Number(process.env.PORT) || 3000;
if (process.env.NODE_ENV !== 'test') {
  // skip listen in test so supertest can use app
  client.connect().then(async () => {
    // console.log('✅ Connected to MongoDB');
    await runMigrations();
    app.listen(PORT, () => {
      // console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}

export { app };
