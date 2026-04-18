// Import necessary modules for the Express server, routing, database, and security
import express from 'express';
import cors from 'cors';
import path from 'path';
import tls from 'tls';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables from .env file
dotenv.config();

// Resolve __dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize the Express application
const app = express();

// Apply middleware to enable Cross-Origin Resource Sharing (CORS) and JSON body parsing
app.use(cors());
app.use(express.json());

// Verify MongoDB URI is provided in the environment
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add your MONGODB_URI to the .env file');

// Helper function to safely check server identity for TLS connections.
// This guards against a known TLS bug when running under environments like Bun 
// where a null certificate might be passed, preventing the app from throwing an error.
function checkServerIdentitySafe(
  hostname: string,
  cert: tls.PeerCertificate | undefined | null
): Error | undefined {
  if (cert == null) return undefined;
  return tls.checkServerIdentity(hostname, cert);
}

// Configure and initialize the MongoDB client
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
  checkServerIdentity: checkServerIdentitySafe,
});

// Define database and collection references
const db = client.db('tradelingo');
const usersCollection = db.collection('users');
const modulesCollection = db.collection('modules');

/**
 * Calculates a user's level based on their total Experience Points (XP).
 * Uses static thresholds for early levels and scales linearly after level 5.
 * @param xp - The user's current experience points
 * @returns The calculated level
 */
const calculateLevel = (xp: number): number => {
  if (xp < 1000) return 1;
  if (xp < 2500) return 2;
  if (xp < 4500) return 3;
  if (xp < 7000) return 4;
  if (xp < 10000) return 5;
  return 5 + Math.floor((xp - 10000) / 5000); // Add 1 level for every 5000 XP beyond 10000
};

/**
 * POST /api/register
 * Registers a new user account.
 * Validates email and password, checks for existing users, hashes the password,
 * and initializes a default user profile in the database.
 */
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format and length
    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 320) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    // Validate password length
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if a user with this email already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the user's password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Construct the new user document with default stats
    const newUser = {
      email: normalizedEmail,
      password: hashedPassword,
      displayName: email.split('@')[0], // Default display name based on email prefix
      experiencePoints: 0,
      level: 1,
      lastUnlockedModuleId: 1,
      progressByModuleId: {},
      streakDays: 0,
      lastActivityDate: null,
      completedModules: [],
      createdAt: new Date(),
    };

    // Save the new user to the database
    await usersCollection.insertOne(newUser);

    // Return the created user's profile data (excluding password)
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

/**
 * POST /api/login
 * Authenticates an existing user.
 * Looks up the user by email, compares the provided password with the hashed database entry,
 * and returns the user's profile information if successful.
 */
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await usersCollection.findOne({ email: normalizedEmail });

    // Fail if user is not found
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user data, recalculating level and providing defaults for safety
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

/**
 * POST /api/update-xp
 * Adds experience points to a user's total and recalculates their level.
 */
app.post('/api/update-xp', async (req, res) => {
  try {
    const { email, xpToAdd } = req.body;
    
    // Validate request body
    if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required' });
    if (typeof xpToAdd !== 'number' || xpToAdd < 0 || xpToAdd > 10000) {
      return res.status(400).json({ error: 'xpToAdd must be a number between 0 and 10000' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate new total XP and corresponding level
    const newXp = (user.experiencePoints || 0) + xpToAdd;
    const newLevel = calculateLevel(newXp);

    // Update the database document and return the updated version ('after')
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

/**
 * GET /api/progress/:email
 * Retrieves the specific module progression data for a user.
 */
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

/**
 * GET /api/modules
 * Fetches the metadata (excluding inner lessons) for all available modules from the database.
 * Sorted by moduleId.
 */
app.get('/api/modules', async (_req, res) => {
  try {
    const modules = await modulesCollection
      .find({}, { projection: { lessons: 0 } }) // Exclude lesson content to keep payload light
      .sort({ moduleId: 1 })
      .toArray();
    res.status(200).json(modules);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: 'Server error fetching modules' });
  }
});

/**
 * GET /api/modules/:moduleId
 * Fetches the full data (including lessons) for a single specific module.
 */
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

/**
 * POST /api/complete-lesson
 * Increments the user's progress within a specific module by completing a single lesson,
 * and awards XP.
 */
app.post('/api/complete-lesson', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd } = req.body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!moduleId || typeof moduleId !== 'number') {
      return res.status(400).json({ error: 'Valid moduleId is required' });
    }
    
    // Ensure XP added stays within reasonable bounds
    const safeXp = Math.max(0, Math.min(10000, Number(xpToAdd) || 0));

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate new stats
    const newXp = (user.experiencePoints || 0) + safeXp;
    const newLevel = calculateLevel(newXp);
    
    // Dynamic field path for incrementing lesson count inside nested progress object
    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;

    // Update database
    const result = await usersCollection.findOneAndUpdate(
      { email },
      { 
        $set: { experiencePoints: newXp, level: newLevel },
        $inc: { [progressField]: 1 } // Increment current lesson by 1
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
/**
 * POST /api/pass-module
 * Allows a user to completely pass a module (e.g., via a pre-test).
 * Sets their lesson progress to maximum, awards XP, and unlocks the next sequential module.
 */
app.post('/api/pass-module', async (req, res) => {
  try {
    const { email, moduleId, xpToAdd, totalLessons } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate new stats
    const newXp = (user.experiencePoints || 0) + xpToAdd;
    const newLevel = calculateLevel(newXp);
    const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
    
    // Determine the next module to unlock
    let newUnlocked = user.lastUnlockedModuleId;
    if (moduleId == user.lastUnlockedModuleId) {
      newUnlocked = moduleId + 1; // Unlock the next module in line
    }

    // Apply updates to the database
    const result = await usersCollection.findOneAndUpdate(
      { email: email },
      {
        $set: {
          [progressField]: totalLessons, // Max out the current lesson progress
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

/**
 * POST /api/update-streak
 * Calculates and updates a user's daily activity streak.
 * If activity was yesterday, streak increases. If today, streak stays the same.
 * If more than a day has passed, the streak resets to 1.
 */
app.post('/api/update-streak', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get current date string (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = user.lastActivityDate;
    let newStreakDays = user.streakDays || 0;

    // Evaluate streak logic if the user hasn't already logged activity today
    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        newStreakDays += 1; // Streak continues
      } else if (!lastActivity) {
        newStreakDays = 1; // First-time activity
      } else {
        newStreakDays = 1; // Gap in activity occurred, streak resets
      }
    }

    // Save the new streak status
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

/**
 * GET /api/completed-modules/:email
 * Retrieves the list of historically completed modules for a given user.
 */
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

/**
 * POST /api/complete-module
 * Officially marks a module as completed by pushing it to the user's completed history.
 * Also unlocks the subsequent module.
 */
app.post('/api/complete-module', async (req, res) => {
  try {
    const { email, moduleId, title, score, xpEarned, lessonsTotal } = req.body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!moduleId || typeof moduleId !== 'number') {
      return res.status(400).json({ error: 'Valid moduleId is required' });
    }

    const completedDate = new Date().toISOString().split('T')[0];
    
    // Construct the historical completion record
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

    // Determine the next module to unlock, ensuring we don't accidentally downgrade progress
    const newUnlockedId = Math.max(user.lastUnlockedModuleId || 1, moduleId + 1);

    // Update database by appending to the array and updating the unlock ID
    const result = await usersCollection.findOneAndUpdate(
      { email },
      {
        $push: { completedModules: completedModule },
        $set: { lastUnlockedModuleId: newUnlockedId },
      } as any, // Typecast to any to bypass strict MongoDB typing issues for dynamic push
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

/**
 * GET /api/user/:email
 * Fetches the complete aggregated profile data for a specific user.
 */
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

// Production environment configuration
// Serves static frontend files and falls back to index.html for Single Page App (SPA) routing
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('/{*path}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

/**
 * Ensures backwards compatibility for early users created before certain fields existed.
 * Runs on server startup to default missing document properties.
 */
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

// Port configuration
const PORT = Number(process.env.PORT) || 3000;

// Initialize server connection
// We skip binding the port in 'test' environments so that testing libraries (like supertest)
// can attach to the Express app autonomously.
if (process.env.NODE_ENV !== 'test') {
  client.connect().then(async () => {
    // console.log('✅ Connected to MongoDB');
    await runMigrations(); // Sync database schema/fields before serving traffic
    app.listen(PORT, () => {
      // console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}

// Export the app instance for testing purposes
export { app };
