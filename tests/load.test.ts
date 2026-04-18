import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import autocannon from 'autocannon';
import type { AddressInfo } from 'net';
import type { Server } from 'http';
import { createMockCollection } from './mockDb';

const usersMock = createMockCollection();
const modulesMock = createMockCollection();

vi.mock('mongodb', () => {
  const collections: Record<string, unknown> = {
    users: usersMock.collection,
    modules: modulesMock.collection,
  };
  return {
    MongoClient: function () {
      return {
        connect: () => Promise.resolve(),
        db: () => ({
          collection: (name: string) => collections[name] ?? usersMock.collection,
        }),
      };
    },
  };
});

let server: Server;
let baseUrl: string;

function runLoad(opts: autocannon.Options): Promise<autocannon.Result> {
  return new Promise((resolve, reject) => {
    const instance = autocannon(opts, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    autocannon.track(instance, { renderProgressBar: false });
  });
}

describe('Load tests – 1000 concurrent users', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    modulesMock.store.push(
      { moduleId: 1, title: 'Stock Market Fundamentals', pretest: [{ question: 'Q1?', options: ['A', 'B'], correct: 0 }] },
      { moduleId: 2, title: 'Retirement Planning', pretest: [{ question: 'Q2?', options: ['A', 'B'], correct: 1 }] },
    );

    usersMock.store.push({
      email: 'loaduser@test.com',
      password: 'hashed',
      displayName: 'loaduser',
      experiencePoints: 0,
      level: 1,
      lastUnlockedModuleId: 1,
      progressByModuleId: {},
      streakDays: 0,
      lastActivityDate: null,
      completedModules: [],
    });

    const { app } = await import('../server/index');
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });
    const addr = server.address() as AddressInfo;
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('GET /api/modules handles 1000 concurrent connections without errors or severe latency', async () => {
    const result = await runLoad({
      url: `${baseUrl}/api/modules`,
      connections: 1000,
      duration: 10,
      timeout: 20,
      method: 'GET',
    });

    const totalRequests = result.requests.total;
    const timeoutRate = totalRequests > 0 ? result.errors / totalRequests : 1;

    console.log('\n--- GET /api/modules ---');
    console.log(`Total requests : ${totalRequests}`);
    console.log(`Avg latency    : ${result.latency.average} ms`);
    console.log(`p99 latency    : ${result.latency.p99} ms`);
    console.log(`Req/sec (avg)  : ${result.requests.average}`);
    console.log(`Non-2xx resp   : ${result.non2xx}`);
    console.log(`Timeouts       : ${result.errors}`);
    console.log(`Timeout rate   : ${(timeoutRate * 100).toFixed(2)}%`);

    expect(totalRequests).toBeGreaterThan(0);
    expect(timeoutRate).toBeLessThan(0.01);
    expect(result.latency.p99).toBeLessThan(5000);
  }, 30_000);

  it('POST /api/login handles 1000 concurrent connections without dropped requests', async () => {
    const result = await runLoad({
      url: `${baseUrl}/api/login`,
      connections: 1000,
      duration: 10,
      timeout: 20,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'load@test.com', password: 'password123' }),
    });

    const totalRequests = result.requests.total;
    const timeoutRate = totalRequests > 0 ? result.errors / totalRequests : 1;

    console.log('\n--- POST /api/login ---');
    console.log(`Total requests : ${totalRequests}`);
    console.log(`Avg latency    : ${result.latency.average} ms`);
    console.log(`p99 latency    : ${result.latency.p99} ms`);
    console.log(`Req/sec (avg)  : ${result.requests.average}`);
    console.log(`Timeouts       : ${result.errors}`);
    console.log(`Timeout rate   : ${(timeoutRate * 100).toFixed(2)}%`);

    expect(totalRequests).toBeGreaterThan(0);
    expect(timeoutRate).toBeLessThan(0.01);
    expect(result.latency.p99).toBeLessThan(5000);
  }, 30_000);

  it('POST /api/update-xp handles 1000 concurrent quiz-like requests without dropped requests', async () => {
    const result = await runLoad({
      url: `${baseUrl}/api/update-xp`,
      connections: 1000,
      duration: 10,
      timeout: 20,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'loaduser@test.com', xpToAdd: 10 }),
    });

    const totalRequests = result.requests.total;
    const timeoutRate = totalRequests > 0 ? result.errors / totalRequests : 1;

    console.log('\n--- POST /api/update-xp ---');
    console.log(`Total requests : ${totalRequests}`);
    console.log(`Avg latency    : ${result.latency.average} ms`);
    console.log(`p99 latency    : ${result.latency.p99} ms`);
    console.log(`Req/sec (avg)  : ${result.requests.average}`);
    console.log(`Timeouts       : ${result.errors}`);
    console.log(`Timeout rate   : ${(timeoutRate * 100).toFixed(2)}%`);

    expect(totalRequests).toBeGreaterThan(0);
    expect(timeoutRate).toBeLessThan(0.01);
    expect(result.latency.p99).toBeLessThan(5000);
  }, 30_000);
});
