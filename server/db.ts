import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

let database: Database | null = null;

/**
 * directory for sqlite file (created if missing). I have an empty schema for now since we didn't decide yet.
 */
function getDatabasePath(): string {
  const dataDir = join(import.meta.dir, '..', 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  return join(dataDir, 'tradelingo.sqlite');
}

export function getDb(): Database {
  if (database === null) {
    const path = getDatabasePath();
    database = new Database(path);
  }
  return database;
}

export function closeDb(): void {
  if (database !== null) {
    database.close();
    database = null;
  }
}
