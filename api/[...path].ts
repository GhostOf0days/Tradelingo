import tls from 'tls';
import type { Express } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { createApp } from '../server/app';
import { runUserMigrations } from '../server/migrations';
import { seedModulesIfEmpty } from '../server/seedModules';

dotenv.config();

let appPromise: Promise<Express> | undefined;

function checkServerIdentitySafe(
  hostname: string,
  cert: tls.PeerCertificate | undefined | null
): Error | undefined {
  if (cert == null) return undefined;
  return tls.checkServerIdentity(hostname, cert);
}

async function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = (async () => {
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error('MONGODB_URI is required');

      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 15000,
        checkServerIdentity: checkServerIdentitySafe,
      });
      await client.connect();

      const db = client.db('tradelingo');
      const usersCollection = db.collection('users');
      const modulesCollection = db.collection('modules');
      const articleLikesCollection = db.collection('articleLikes');

      await runUserMigrations(usersCollection);
      await seedModulesIfEmpty(modulesCollection);

      return createApp(usersCollection, modulesCollection, articleLikesCollection);
    })();
  }

  return appPromise;
}

export default async function handler(req: Parameters<Express>[0], res: Parameters<Express>[1]) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.warn('Failed to initialize API', error);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Server failed to initialize' }));
  }
}
