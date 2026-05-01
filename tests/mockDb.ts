// In-memory stand-in for MongoDB collections so API tests run fast with no database.
const INITIAL_ID = 1;

// rough in memory matcher that only approximates mongo filters especially $exists.
function matchFilter(doc: Record<string, unknown>, filter: Record<string, unknown>): boolean {
  return Object.entries(filter).every(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      if ('$exists' in (value as Record<string, unknown>)) {
        const exists = (value as { $exists: boolean }).$exists;
        const hasKey = key in doc;
        if (exists && !hasKey) return false;
        if (!exists && hasKey) return false;
      } else if ('$gt' in (value as Record<string, unknown>)) {
        const current = doc[key] as number | undefined;
        if (typeof current !== 'number' || current <= (value as { $gt: number }).$gt) return false;
      } else {
        return matchFilter(
          (doc[key] as Record<string, unknown>) || {},
          value as Record<string, unknown>
        );
      }
    } else if (doc[key] !== value) {
      return false;
    }
    return true;
  });
}

// applies $set, $inc, and $push in sequence.
function applyUpdate(doc: Record<string, unknown>, update: Record<string, unknown>): void {
  const targetDoc = doc;
  if (update.$set) {
    Object.entries(update.$set as Record<string, unknown>).forEach(([k, v]) => {
      targetDoc[k] = v;
    });
  }
  if (update.$inc) {
    Object.entries(update.$inc as Record<string, number>).forEach(([k, v]) => {
      const current = targetDoc[k] as number | undefined;
      targetDoc[k] = (current ?? 0) + v;
    });
  }
  if (update.$push) {
    Object.entries(update.$push as Record<string, unknown>).forEach(([k, v]) => {
      const arr = (targetDoc[k] as unknown[]) ?? [];
      arr.push(v);
      targetDoc[k] = arr;
    });
  }
  if (update.$setOnInsert) {
    Object.entries(update.$setOnInsert as Record<string, unknown>).forEach(([k, v]) => {
      if (!(k in targetDoc)) {
        targetDoc[k] = v;
      }
    });
  }
}

function applyProjection(
  doc: Record<string, unknown>,
  projection: Record<string, number>
): Record<string, unknown> {
  const out = { ...doc };
  Object.entries(projection).forEach(([k, v]) => {
    if (v === 0) delete out[k];
  });
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
            if (dir === 1) return av > bv ? 1 : -1;
            return av < bv ? 1 : -1;
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
      const insertedId = (doc._id as number | undefined) ?? nextId;
      if (doc._id === undefined) {
        nextId += 1;
      }
      const copy = { ...doc, _id: insertedId };
      store.push(copy);
      return { insertedId: copy._id };
    },

    async updateOne(
      filter: Record<string, unknown>,
      update: Record<string, unknown>,
      options?: { upsert?: boolean }
    ) {
      const idx = store.findIndex((doc) => matchFilter(doc as Record<string, unknown>, filter));
      if (idx !== -1) {
        applyUpdate(store[idx] as Record<string, unknown>, update);
        return { matchedCount: 1, modifiedCount: 1, upsertedId: null };
      }

      if (options?.upsert) {
        const doc = { ...filter, _id: nextId } as Record<string, unknown>;
        nextId += 1;
        if (update.$setOnInsert) {
          Object.assign(doc, update.$setOnInsert as Record<string, unknown>);
        }
        store.push(doc);
        return { matchedCount: 0, modifiedCount: 0, upsertedId: doc._id };
      }

      return { matchedCount: 0, modifiedCount: 0, upsertedId: null };
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
        Object.entries(inc).forEach(([k, v]) => {
          if (k.includes('.')) {
            const [outer, ...rest] = k.split('.');
            let target = doc[outer];
            if (!target || typeof target !== 'object') {
              (doc as Record<string, unknown>)[outer] = {};
              target = doc[outer];
            }
            let cur = target as Record<string, unknown>;
            for (let i = 0; i < rest.length - 1; i += 1) {
              const key = rest[i];
              if (!cur[key] || typeof cur[key] !== 'object') cur[key] = {};
              cur = cur[key] as Record<string, unknown>;
            }
            const lastKey = rest[rest.length - 1];
            (cur as Record<string, number>)[lastKey] = ((cur[lastKey] as number) ?? 0) + v;
          }
        });
      }
      // Same idea for dotted $set keys (nested progress objects).
      if (update.$set) {
        const set = update.$set as Record<string, unknown>;
        Object.entries(set).forEach(([k, v]) => {
          if (k.includes('.')) {
            const [outer, ...rest] = k.split('.');
            let target = doc[outer];
            if (!target || typeof target !== 'object') {
              (doc as Record<string, unknown>)[outer] = {};
              target = doc[outer];
            }
            let cur = target as Record<string, unknown>;
            for (let i = 0; i < rest.length - 1; i += 1) {
              const key = rest[i];
              if (!cur[key] || typeof cur[key] !== 'object') cur[key] = {};
              cur = cur[key] as Record<string, unknown>;
            }
            cur[rest[rest.length - 1]] = v;
          }
        });
      }
      applyUpdate(doc, update);

      return options?.returnDocument === 'after' ? doc : null;
    },

    async updateMany(filter: Record<string, unknown>, update: Record<string, unknown>) {
      const matches = store.filter((doc) => matchFilter(doc as Record<string, unknown>, filter));
      matches.forEach((doc) => {
        applyUpdate(doc as Record<string, unknown>, update);
      });
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
const articleLikesSingleton = createMockCollection();

export const mockUsersCollection = usersSingleton.collection;
export const mockModulesCollection = modulesSingleton.collection;
export const mockArticleLikesCollection = articleLikesSingleton.collection;

export function resetMockDb(): void {
  usersSingleton.reset();
  modulesSingleton.reset();
  articleLikesSingleton.reset();
}
