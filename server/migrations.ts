import type { Collection } from 'mongodb';

// patch older users that lack fields added in later releases.
export async function runUserMigrations(usersCollection: Collection): Promise<void> {
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
