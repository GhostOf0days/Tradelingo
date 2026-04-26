import express from 'express';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { Collection } from 'mongodb';
import { fileURLToPath } from 'url';
import { calculateLevel } from './level';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLE_BASE_LIKES = new Map<number, number>([
  [1, 234],
  [2, 456],
  [3, 312],
  [4, 189],
  [5, 278],
  [6, 521],
  [7, 168],
  [8, 143],
  [9, 131],
  [10, 203],
  [11, 97],
  [12, 155],
  [13, 118],
  [14, 86],
  [15, 74],
  [16, 126],
  [17, 92],
  [18, 139],
]);

function getPasswordValidationError(password: unknown): string | null {
  if (typeof password !== 'string') return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include a number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a symbol';
  return null;
}

async function seedArticleLikesIfMissing(articleLikesCollection: Collection): Promise<void> {
  const now = new Date();
  await Promise.all(
    [...ARTICLE_BASE_LIKES.entries()].map(([articleId, likes]) =>
      articleLikesCollection.updateOne(
        { articleId },
        { $setOnInsert: { articleId, likes, updatedAt: now } },
        { upsert: true }
      )
    )
  );
}

export function createApp(
  usersCollection: Collection,
  modulesCollection: Collection,
  articleLikesCollection: Collection
): express.Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.post('/api/register', async (req, res) => {
    try {
      const { email, password } = req.body;

      // basic email checks with a hard max length on registration.
      if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 320) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      const passwordError = getPasswordValidationError(password);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
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
        displayName: normalizedEmail.split('@')[0],
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

  // reuse the same login error for bad email and bad password.
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = (email || '').toLowerCase().trim();
      const user = await usersCollection.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password as string);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.status(200).json({
        email: user.email,
        displayName: user.displayName,
        experiencePoints: user.experiencePoints,
        level: user.level || calculateLevel((user.experiencePoints as number) || 0),
        streakDays: user.streakDays || 0,
        lastActivityDate: user.lastActivityDate,
        lastUnlockedModuleId: user.lastUnlockedModuleId || 1,
      });
    } catch (error) {
      console.warn(error);
      res.status(500).json({ error: 'Server error during login' });
    }
  });

  // apply a delta to xp and recompute level from the running total.
  app.post('/api/update-xp', async (req, res) => {
    try {
      const { email, xpToAdd } = req.body;
      if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required' });
      // reject xp updates outside a safe numeric window.
      if (typeof xpToAdd !== 'number' || xpToAdd < 0 || xpToAdd > 10000) {
        return res.status(400).json({ error: 'xpToAdd must be a number between 0 and 10000' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await usersCollection.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newXp = (user.experiencePoints || 0) + xpToAdd;
      const newLevel = calculateLevel(newXp);

      const result = await usersCollection.findOneAndUpdate(
        { email: normalizedEmail },
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

  // report lesson progress per module and the furthest unlocked module id.
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

  // list modules without lesson payloads since the spa already embeds that text.
  app.get('/api/modules', async (_req, res) => {
    try {
      const modules = await modulesCollection
        .find({}, { projection: { lessons: 0 } })
        .sort({ moduleId: 1 })
        .toArray();
      res.status(200).json(modules);
    } catch (error) {
      console.warn(error);
      res.status(500).json({ error: 'Server error fetching modules' });
    }
  });

  // fetch a single module document when mongo stores it.
  app.get('/api/modules/:moduleId', async (req, res) => {
    try {
      const module = await modulesCollection.findOne({
        moduleId: Number(req.params.moduleId),
      });
      if (!module) return res.status(404).json({ error: 'Module not found' });
      res.status(200).json(module);
    } catch (error) {
      console.warn(error);
      res.status(500).json({ error: 'Server error fetching module' });
    }
  });

  app.get('/api/article-likes', async (_req, res) => {
    try {
      await seedArticleLikesIfMissing(articleLikesCollection);
      const likes = await articleLikesCollection
        .find({}, { projection: { _id: 0 } })
        .sort({ articleId: 1 })
        .toArray();
      res.status(200).json(likes);
    } catch (error) {
      console.warn(error);
      res.status(500).json({ error: 'Server error fetching article likes' });
    }
  });

  app.post('/api/article-likes/:articleId', async (req, res) => {
    try {
      const articleId = Number(req.params.articleId);
      const action = req.body?.action;

      if (!Number.isInteger(articleId) || !ARTICLE_BASE_LIKES.has(articleId)) {
        return res.status(400).json({ error: 'Valid articleId is required' });
      }
      if (action !== 'like' && action !== 'unlike') {
        return res.status(400).json({ error: 'action must be like or unlike' });
      }

      await articleLikesCollection.updateOne(
        { articleId },
        {
          $setOnInsert: {
            articleId,
            likes: ARTICLE_BASE_LIKES.get(articleId) ?? 0,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      const delta = action === 'like' ? 1 : -1;
      const filter = action === 'unlike' ? { articleId, likes: { $gt: 0 } } : { articleId };
      const result = await articleLikesCollection.findOneAndUpdate(
        filter,
        { $inc: { likes: delta }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (!result) {
        const current = await articleLikesCollection.findOne({ articleId });
        return res.status(200).json({ articleId, likes: Math.max(0, Number(current?.likes ?? 0)) });
      }

      res.status(200).json({ articleId, likes: Math.max(0, Number(result.likes ?? 0)) });
    } catch (error) {
      console.warn(error);
      res.status(500).json({ error: 'Server error updating article likes' });
    }
  });

  // move lesson progress forward with xp where lightning reuses module id zero on the same handler.
  app.post('/api/complete-lesson', async (req, res) => {
    try {
      const { email, moduleId, xpToAdd } = req.body;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }
      if (!moduleId || typeof moduleId !== 'number') {
        return res.status(400).json({ error: 'Valid moduleId is required' });
      }
      const safeXp = xpToAdd === undefined ? 0 : Number(xpToAdd);
      if (!Number.isFinite(safeXp) || safeXp < 0 || safeXp > 10000) {
        return res.status(400).json({ error: 'xpToAdd must be a number between 0 and 10000' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await usersCollection.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
      const newXp = (user.experiencePoints || 0) + safeXp;
      const newLevel = calculateLevel(newXp);

      const result = await usersCollection.findOneAndUpdate(
        { email: normalizedEmail },
        {
          $inc: { [progressField]: 1 },
          $set: {
            experiencePoints: newXp,
            level: newLevel,
          },
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

  // lightning round posts total run xp only. path keeps the historical lighting spelling for clients.
  app.post('/api/lighting-round', async (req, res) => {
    try {
      const { email, xpEarned } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }
      const rawXp = Number(xpEarned);
      if (!Number.isFinite(rawXp) || rawXp < 0 || rawXp > 50000) {
        return res.status(400).json({ error: 'xpEarned must be a number between 0 and 50000' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await usersCollection.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newXp = (user.experiencePoints || 0) + Math.floor(rawXp);
      const newLevel = calculateLevel(newXp);

      const result = await usersCollection.findOneAndUpdate(
        { email: normalizedEmail },
        { $set: { experiencePoints: newXp, level: newLevel } },
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

  // fast forward lesson state after a passed pretest and fold xp into the same write.
  app.post('/api/pass-module', async (req, res) => {
    try {
      const { email, moduleId, xpToAdd, totalLessons } = req.body;
      const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
      if (!normalizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }
      if (typeof moduleId !== 'number' || moduleId < 1) {
        return res.status(400).json({ error: 'Valid moduleId is required' });
      }
      if (typeof totalLessons !== 'number' || totalLessons < 1) {
        return res.status(400).json({ error: 'totalLessons must be a positive number' });
      }
      const safeXp = Math.max(0, Math.min(10000, Number(xpToAdd) || 0));

      const user = await usersCollection.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newXp = (user.experiencePoints || 0) + safeXp;
      const newLevel = calculateLevel(newXp);
      const progressField = `progressByModuleId.${moduleId}.lessonCurrent`;
      let newUnlocked = user.lastUnlockedModuleId;
      // loose equality keeps string ids from json aligned with numeric ids in mongo.
      if (moduleId == user.lastUnlockedModuleId) {
        newUnlocked = moduleId + 1;
      }

      const result = await usersCollection.findOneAndUpdate(
        { email: normalizedEmail },
        {
          $set: {
            [progressField]: totalLessons,
            lastUnlockedModuleId: newUnlocked,
            experiencePoints: newXp,
            level: newLevel,
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

  // streak logic collapses multiple hits inside the same utc calendar day.
  app.post('/api/update-streak', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const user = await usersCollection.findOne({ email: normalizedEmail });
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

      const result = await usersCollection.findOneAndUpdate(
        { email: normalizedEmail },
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

  // list stored completions for dashboard history views.
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

  // append completion metadata and raise unlock without ever shrinking it.
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

      const normalizedEmail = email.toLowerCase().trim();
      const user = await usersCollection.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newUnlockedId = Math.max(user.lastUnlockedModuleId || 1, moduleId + 1);

      // typings disallow push and set together so cast the update payload.
      const newXp = (user.experiencePoints || 0) + (xpEarned || 0);
      const newLevel = calculateLevel(newXp);

      const combinedUpdate = {
        $push: { completedModules: completedModule },
        $set: { 
          lastUnlockedModuleId: newUnlockedId,
          experiencePoints: newXp,
          level: newLevel,
        },
      };
      const result = await usersCollection.findOneAndUpdate(
        { email: normalizedEmail },
        combinedUpdate as never,
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

  // richer user payload with progress maps and no password field.
  app.get('/api/user/:email', async (req, res) => {
    try {
      const user = await usersCollection.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const xp = (user.experiencePoints as number) || 0;
      res.status(200).json({
        email: user.email,
        displayName: user.displayName,
        experiencePoints: user.experiencePoints,
        level: user.level || calculateLevel(xp),
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

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(distPath));
    // fall back to the spa shell for unknown paths so client routing can recover.
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  return app;
}
