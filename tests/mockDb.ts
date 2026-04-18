// In-memory stand-in for MongoDB collections so API tests run fast with no database.
const INITIAL_ID = 1;

// rough in memory matcher that only approximates mongo filters especially $exists.
function matchFilter(doc: Record<string, unknown>, filter: Record<string, unknown>): boolean {
  for (const [key, value] of Object.entries(filter)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      if ('$exists' in (value as Record<string, unknown>)) {
        const exists = (value as { $exists: boolean }).$exists;
        const hasKey = key in doc;
        if (exists && !hasKey) return false;
        if (!exists && hasKey) return false;
      } else {
        return matchFilter((doc[key] as Record<string, unknown>) || {}, value as Record<string, unknown>);
      }
    } else if (doc[key] !== value) {
      return false;
    }
  }
  return true;
}

// applies $set, $inc, and $push in sequence.
function applyUpdate(doc: Record<string, unknown>, update: Record<string, unknown>): void {
  if (update.$set) {
    for (const [k, v] of Object.entries(update.$set as Record<string, unknown>)) {
      (doc as Record<string, unknown>)[k] = v;
    }
  }
  if (update.$inc) {
    for (const [k, v] of Object.entries(update.$inc as Record<string, number>)) {
      const current = (doc as Record<string, unknown>)[k] as number | undefined;
      (doc as Record<string, unknown>)[k] = (current ?? 0) + v;
    }
  }
  if (update.$push) {
    for (const [k, v] of Object.entries(update.$push as Record<string, unknown>)) {
      const arr = ((doc as Record<string, unknown>)[k] as unknown[]) ?? [];
      arr.push(v);
      (doc as Record<string, unknown>)[k] = arr;
    }
  }
}

function applyProjection(doc: Record<string, unknown>, projection: Record<string, number>): Record<string, unknown> {
  const out = { ...doc };
  for (const [k, v] of Object.entries(projection)) {
    if (v === 0) delete out[k];
  }
  return out;
}

export function createMockCollection() {
  const store: Record<string, unknown>[] = [];
  let nextId = INITIAL_ID;

  const collection = {
    async countDocuments(filter: Record<string, unknown> = {}) {
      return store.filter((doc) => matchFilter(doc as Record<string, unknown>, filter)).length;
    },

    async findOne(filter: Record<string, unknown>) {
      return store.find((doc) => matchFilter(doc as Record<string, unknown>, filter)) ?? null;
    },

    find(filter: Record<string, unknown> = {}, options?: { projection?: Record<string, number> }) {
      let matches = store
        .filter((doc) => matchFilter(doc as Record<string, unknown>, filter))
        .map((doc) => ({ ...doc }));

      const cursor = {
        sort(spec: Record<string, 1 | -1>) {
          const key = Object.keys(spec)[0];
          const dir = spec[key];
          matches = [...matches].sort((a, b) => {
            const av = a[key] as number;
            const bv = b[key] as number;
            if (av === bv) return 0;
            return dir === 1 ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
          });
          return cursor;
        },
        async toArray() {
          if (options?.projection) {
            return matches.map((d) => applyProjection(d, options.projection!));
          }
          return matches;
        },
      };
      return cursor;
    },

    async insertOne(doc: Record<string, unknown>) {
      const copy = { ...doc, _id: (doc._id as number) ?? nextId++ };
      store.push(copy);
      return { insertedId: copy._id };
    },

    async findOneAndUpdate(
      filter: Record<string, unknown>,
      update: Record<string, unknown>,
      options?: { returnDocument?: 'after' }
    ) {
      const idx = store.findIndex((doc) => matchFilter(doc as Record<string, unknown>, filter));
      if (idx === -1) return null;
      const doc = store[idx] as Record<string, unknown>;

      // Dot-path $inc (e.g. progressByModuleId.3.lessonCurrent) — mirrors server lesson increments.
      if (update.$inc) {
        const inc = update.$inc as Record<string, number>;
        for (const [k, v] of Object.entries(inc)) {
          if (k.includes('.')) {
            const [outer, ...rest] = k.split('.');
            let target = doc[outer];
            if (!target || typeof target !== 'object') {
              (doc as Record<string, unknown>)[outer] = {};
              target = doc[outer];
            }
            let cur = target as Record<string, unknown>;
            for (let i = 0; i < rest.length - 1; i++) {
              const key = rest[i];
              if (!cur[key] || typeof cur[key] !== 'object') cur[key] = {};
              cur = cur[key] as Record<string, unknown>;
            }
            const lastKey = rest[rest.length - 1];
            (cur as Record<string, number>)[lastKey] = ((cur[lastKey] as number) ?? 0) + v;
          }
        }
      }
      // Same idea for dotted $set keys (nested progress objects).
      if (update.$set) {
        const set = update.$set as Record<string, unknown>;
        for (const [k, v] of Object.entries(set)) {
          if (k.includes('.')) {
            const [outer, ...rest] = k.split('.');
            let target = doc[outer];
            if (!target || typeof target !== 'object') {
              (doc as Record<string, unknown>)[outer] = {};
              target = doc[outer];
            }
            let cur = target as Record<string, unknown>;
            for (let i = 0; i < rest.length - 1; i++) {
              const key = rest[i];
              if (!cur[key] || typeof cur[key] !== 'object') cur[key] = {};
              cur = cur[key] as Record<string, unknown>;
            }
            cur[rest[rest.length - 1]] = v;
          }
        }
      }
      applyUpdate(doc, update);

      return options?.returnDocument === 'after' ? doc : null;
    },

    async updateMany(filter: Record<string, unknown>, update: Record<string, unknown>) {
      const matches = store.filter((doc) => matchFilter(doc as Record<string, unknown>, filter));
      for (const doc of matches) {
        applyUpdate(doc as Record<string, unknown>, update);
      }
      return { modifiedCount: matches.length };
    },
  };

  return {
    collection,
    store,
    reset: () => {
      store.length = 0;
      nextId = INITIAL_ID;
    },
  };
}

const usersSingleton = createMockCollection();
const modulesSingleton = createMockCollection();

export const mockUsersCollection = usersSingleton.collection;
export const mockModulesCollection = modulesSingleton.collection;

export function resetMockDb(): void {
  usersSingleton.reset();
  modulesSingleton.reset();
}
