import type { Collection } from 'mongodb';
import { MODULES } from '../src/data/modules';

// insert curriculum rows from the same source as the client when the modules collection is empty.
export async function seedModulesIfEmpty(modulesCollection: Collection): Promise<void> {
  const count = await modulesCollection.countDocuments();
  if (count > 0) return;

  for (const [key, mod] of Object.entries(MODULES)) {
    const moduleId = Number(key);
    await modulesCollection.insertOne({
      moduleId,
      title: mod.title,
      experiencePoints: mod.experiencePoints,
      lessons: mod.lessons,
      pretest: mod.pretest,
    });
  }
}
