import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add your MONGODB_URI to the .env file");

const client = new MongoClient(uri);
const db = client.db('tradalingo');
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

    // Initialize the user with default progress data
    const newUser = {
      email,
      password, 
      displayName: email.split('@')[0], 
      experiencePoints: 0,
      lastUnlockedModuleId: 1, // Start at module 1
      progressByModuleId: {},  // Empty object to track lesson progress
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
    
    if (!user || user.password !== password) {
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

// Start the server
const PORT = 3000;
client.connect().then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
});