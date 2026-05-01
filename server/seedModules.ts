import type { Collection } from 'mongodb';
import MODULES from '../src/data/modules.js';

// insert curriculum rows from the same source as the client when the modules collection is empty.
export default async function seedModulesIfEmpty(modulesCollection: Collection): Promise<void> {
  const count = await modulesCollection.countDocuments();
  if (count > 0) return;

  await Promise.all(
    Object.entries(MODULES).map(([key, mod]) =>
      modulesCollection.insertOne({
        moduleId: Number(key),
        title: mod.title,
        experiencePoints: mod.experiencePoints,
        lessons: mod.lessons,
        pretest: mod.pretest,
      })
    )
  );
}
