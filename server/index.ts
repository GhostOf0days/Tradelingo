// express serves json routes plus the vite build in production and exports app for tests without listening.
import tls from 'tls';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { createApp } from './app';
import { runUserMigrations } from './migrations';
import { seedModulesIfEmpty } from './seedModules';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Please add your MONGODB_URI to the .env file');

// skip tls peer verification when bun hands in an empty certificate.
function checkServerIdentitySafe(
  hostname: string,
  cert: tls.PeerCertificate | undefined | null
): Error | undefined {
  if (cert == null) return undefined;
  return tls.checkServerIdentity(hostname, cert);
}

// stretch mongo server selection time for atlas and weak networks.
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
  checkServerIdentity: checkServerIdentitySafe,
});
const db = client.db('tradelingo');
const usersCollection = db.collection('users');
const modulesCollection = db.collection('modules');
const articleLikesCollection = db.collection('articleLikes');

export const app = createApp(usersCollection, modulesCollection, articleLikesCollection);

async function runStartupTasks(): Promise<void> {
  await runUserMigrations(usersCollection);
  await seedModulesIfEmpty(modulesCollection);
}

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
if (process.env.NODE_ENV !== 'test') {
  // normal runs listen here while tests import app and let supertest bind.
  client
    .connect()
    .then(async () => {
      console.warn('Connected to MongoDB');
      await runStartupTasks();
      const server = app.listen(PORT, HOST, () => {
        console.warn(`Server running on ${HOST}:${PORT}`);
      });

      const shutdown = async () => {
        server.close(async () => {
          await client.close();
          process.exit(0);
        });
      };

      process.on('SIGTERM', shutdown);
      process.on('SIGINT', shutdown);
    })
    .catch((error) => {
      console.warn('Failed to start server', error);
      process.exit(1);
    });
}
