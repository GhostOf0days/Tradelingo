import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add your MONGODB_URI to the .env file");

const client = new MongoClient(uri);
// FIXED: Now targets the correct 'tradelingo' database
const db = client.db('tradelingo');
const usersCollection = db.collection('users');

// --- API ROUTES ---

// 1. Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // SECURITY: Hash the password before saving it to MongoDB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Initialize the user with default progress data
    const newUser = {
      email,
      password: hashedPassword, // Store the encrypted string
      displayName: email.split('@')[0], 
      experiencePoints: 0,
      lastUnlockedModuleId: 1, // Start at module 1
      progressByModuleId: {},  // Empty object to track lesson progress
      streakDays: 0, // Track daily streak
      lastActivityDate: null, // For streak reset logic
      completedModules: [], // Array of completed modules with details
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);
    
    res.status(201).json({ 
      email: newUser.email,
      displayName: newUser.displayName, 
      experiencePoints: newUser.experiencePoints 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. Log in
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // SECURITY: Compare the typed password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ 
      email: user.email,
      displayName: user.displayName, 
      experiencePoints: user.experiencePoints 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. Update XP
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

// 4. Get User Progress
app.get('/api/progress/:email', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      lastUnlockedModuleId: user.lastUnlockedModuleId || 1,
      progressByModuleId: user.progressByModuleId || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

// 5. Complete a Lesson & Update Progress
app.post('/api/complete-lesson', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd } = req.body;
    
    if (!email || !moduleId) {
      return res.status(400).json({ error: 'Email and moduleId are required' });
    }

    // This dynamically targets the specific module in the database 
    // e.g., progressByModuleId.1.lessonCurrent
    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;

    const result = await usersCollection.findOneAndUpdate(
      { email: email },
      { 
        $inc: { 
          experiencePoints: xpToAdd,
          [progressField]: 1 // Increment the lesson count by 1
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
      experiencePoints: result.experiencePoints,
      progressByModuleId: result.progressByModuleId 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating lesson progress' });
  }
});

// 6. Pass Module (Pre-Test Success)
app.post('/api/pass-module', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd, totalLessons } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
    
    // Unlock the next module
    let newUnlocked = user.lastUnlockedModuleId;
    if (moduleId == user.lastUnlockedModuleId) {
      newUnlocked = moduleId + 1;
    }

    const result = await usersCollection.findOneAndUpdate(
      { email: email },
      { 
        $set: { 
          [progressField]: totalLessons,
          lastUnlockedModuleId: newUnlocked
        },
        $inc: { experiencePoints: xpToAdd }
      },
      { returnDocument: 'after' }
    );

    res.status(200).json({ 
      experiencePoints: result?.experiencePoints,
      lastUnlockedModuleId: result?.lastUnlockedModuleId,
      progressByModuleId: result?.progressByModuleId 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating pre-test progress' });
  }
});

// 7. Update Streak
app.post('/api/update-streak', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = user.lastActivityDate;

    // Check if streak should be updated
    let newStreakDays = user.streakDays || 0;
    
    if (lastActivity !== today) {
      // Check if it's a new day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        // Streak continues
        newStreakDays += 1;
      } else if (!lastActivity) {
        // First activity
        newStreakDays = 1;
      } else {
        // Streak broken (more than 1 day gap)
        newStreakDays = 1;
      }
    }

    const result = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          lastActivityDate: today,
          streakDays: newStreakDays
        }
      },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      streakDays: result?.streakDays,
      lastActivityDate: result?.lastActivityDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating streak' });
  }
});

// 8. Get Completed Modules
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

// 9. Mark Module as Completed
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
      lessons: lessonsTotal || 0
    };

    const result = await usersCollection.findOneAndUpdate(
      { email },
      {
        $push: { completedModules: completedModule as any }
      },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      message: 'Module marked as completed',
      completedModules: result.completedModules
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error completing module' });
  }
});

// 10. Get User Full Profile (including streak and completed modules)
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
      completedModules: user.completedModules || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

// Start the server
const PORT = 3000;
client.connect().then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
});