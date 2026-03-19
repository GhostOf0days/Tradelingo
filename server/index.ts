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

// register: hash password, init progress/streak
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await usersCollection.findOne({ email });
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

    await usersCollection.insertOne(newUser);

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
});

// login: compare with hashed password
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });

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
});

app.post('/api/update-xp', async (req, res) => {
  try {
    const { email, xpToAdd } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const result = await usersCollection.findOneAndUpdate(
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
    console.error(error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

// complete-lesson: bump lesson index for this module, add XP
app.post('/api/complete-lesson', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd } = req.body;

    if (!email || !moduleId) {
      return res.status(400).json({ error: 'Email and moduleId are required' });
    }

    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`; // dotted key for $inc

    const result = await usersCollection.findOneAndUpdate(
      { email },
      { $inc: { experiencePoints: xpToAdd, [progressField]: 1 } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      experiencePoints: result.experiencePoints,
      progressByModuleId: result.progressByModuleId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating lesson progress' });
  }
});

// pass-module: pretest passed — set lesson count to total, unlock next module
app.post('/api/pass-module', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd, totalLessons } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

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
});

// update-streak: yesterday -> +1, gap or first time -> 1
app.post('/api/update-streak', async (req, res) => {
  try {
    const { email } = req.body;
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
    console.error(error);
    res.status(500).json({ error: 'Server error updating streak' });
  }
});

app.get('/api/completed-modules/:email', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.completedModules || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching completed modules' });
  }
});

// complete-module: push to completedModules, unlock next
app.post('/api/complete-module', async (req, res) => {
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

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newUnlockedId = Math.max(user.lastUnlockedModuleId || 1, moduleId + 1);

    const result = await usersCollection.findOneAndUpdate(
      { email },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    console.error(error);
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
    console.error(error);
  }
}

const PORT = Number(process.env.PORT) || 3000;
if (process.env.NODE_ENV !== 'test') {
  // skip listen in test so supertest can use app
  client.connect().then(async () => {
    console.log('✅ Connected to MongoDB');
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}

export { app };
