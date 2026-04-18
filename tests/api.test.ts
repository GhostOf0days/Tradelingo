import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { resetMockDb, mockUsersCollection, mockModulesCollection } from './mockDb';

vi.mock('mongodb', () => {
  return {
    MongoClient: function () {
      return {
        connect: () => Promise.resolve(),
        db: () => ({
          collection: (name: string) => (name === 'modules' ? mockModulesCollection : mockUsersCollection),
        }),
      };
    },
  };
});

// defer importing the server until after the mongo mock is installed.
const getApp = async () => {
  const { app } = await import('../server/index');
  return app;
};

describe('Auth API', () => {
  beforeEach(() => {
    resetMockDb();
  });

  it('POST /api/register creates a new user and returns 201', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);

    expect(res.body).toMatchObject({
      email: 'test@example.com',
      displayName: 'test',
      experiencePoints: 0,
      streakDays: 0,
      lastUnlockedModuleId: 1,
    });
    expect(res.body.lastActivityDate).toBeNull();
  });

  it('POST /api/register rejects duplicate email with 400', async () => {
    const app = await getApp();
    await request(app)
      .post('/api/register')
      .send({ email: 'dup@example.com', password: 'password123' })
      .expect(201);

    const res = await request(app)
      .post('/api/register')
      .send({ email: 'dup@example.com', password: 'other123' })
      .expect(400);

    expect(res.body.error).toBe('User already exists');
  });

  it('POST /api/login returns 401 for unknown email', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'nobody@example.com', password: 'any' })
      .expect(401);

    expect(res.body.error).toBe('Invalid email or password');
  });

  it('POST /api/login succeeds and returns user data', async () => {
    const app = await getApp();
    await request(app).post('/api/register').send({ email: 'user@example.com', password: 'secret123' }).expect(201);

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'user@example.com', password: 'secret123' })
      .expect(200);

    expect(res.body).toMatchObject({
      email: 'user@example.com',
      displayName: 'user',
      experiencePoints: 0,
      streakDays: 0,
      lastUnlockedModuleId: 1,
    });
  });

  it('POST /api/login returns 401 for wrong password', async () => {
    const app = await getApp();
    await request(app).post('/api/register').send({ email: 'u@example.com', password: 'correct123' }).expect(201);

    await request(app)
      .post('/api/login')
      .send({ email: 'u@example.com', password: 'wrong123' })
      .expect(401);
  });
});

describe('Progress and XP API', () => {
  beforeEach(async () => {
    resetMockDb();
    const app = await getApp();
    await request(app).post('/api/register').send({ email: 'progress@example.com', password: 'password123' }).expect(201);
  });

  it('GET /api/progress/:email returns progress', async () => {
    const app = await getApp();
    const res = await request(app).get('/api/progress/progress@example.com').expect(200);

    expect(res.body).toMatchObject({
      lastUnlockedModuleId: 1,
      progressByModuleId: {},
    });
  });

  it('GET /api/progress/:email returns 404 for unknown user', async () => {
    const app = await getApp();
    await request(app).get('/api/progress/unknown@example.com').expect(404);
  });

  it('POST /api/update-xp increments XP', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/api/update-xp')
      .send({ email: 'progress@example.com', xpToAdd: 50 })
      .expect(200);

    expect(res.body.experiencePoints).toBe(50);

    const res2 = await request(app)
      .post('/api/update-xp')
      .send({ email: 'progress@example.com', xpToAdd: 25 })
      .expect(200);

    expect(res2.body.experiencePoints).toBe(75);
  });

  it('POST /api/update-xp returns 400 when email missing', async () => {
    const app = await getApp();
    await request(app).post('/api/update-xp').send({ xpToAdd: 10 }).expect(400);
  });

  it('POST /api/complete-lesson updates progress and XP', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/api/complete-lesson')
      .send({ email: 'progress@example.com', moduleId: 1, xpToAdd: 20 })
      .expect(200);

    expect(res.body.experiencePoints).toBe(20);
    expect(res.body.progressByModuleId).toBeDefined();
  });
});

describe('Streak API', () => {
  beforeEach(async () => {
    resetMockDb();
    const app = await getApp();
    await request(app).post('/api/register').send({ email: 'streak@example.com', password: 'password123' }).expect(201);
  });

  it('POST /api/update-streak sets first activity day', async () => {
    const app = await getApp();
    const res = await request(app).post('/api/update-streak').send({ email: 'streak@example.com' }).expect(200);

    expect(res.body.streakDays).toBe(1);
    expect(res.body.lastActivityDate).toBeDefined();
  });
});

describe('User profile API', () => {
  beforeEach(async () => {
    resetMockDb();
    const app = await getApp();
    await request(app).post('/api/register').send({ email: 'profile@example.com', password: 'password123' }).expect(201);
  });

  it('GET /api/user/:email returns full profile', async () => {
    const app = await getApp();
    const res = await request(app).get('/api/user/profile@example.com').expect(200);

    expect(res.body).toMatchObject({
      email: 'profile@example.com',
      displayName: 'profile',
      experiencePoints: 0,
      streakDays: 0,
      lastUnlockedModuleId: 1,
    });
    expect(Array.isArray(res.body.completedModules)).toBe(true);
    expect(typeof res.body.progressByModuleId).toBe('object');
  });

  it('GET /api/user/:email returns 404 for unknown user', async () => {
    const app = await getApp();
    await request(app).get('/api/user/unknown@example.com').expect(404);
  });

  it('GET /api/user/:email includes level', async () => {
    const app = await getApp();
    const res = await request(app).get('/api/user/profile@example.com').expect(200);
    expect(typeof res.body.level).toBe('number');
    expect(res.body.level).toBeGreaterThanOrEqual(1);
  });
});

describe('Health API', () => {
  it('GET /api/health returns ok', async () => {
    const app = await getApp();
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body).toEqual({ ok: true });
  });
});
