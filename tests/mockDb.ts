const INITIAL_ID = 1;
let nextId = INITIAL_ID;

// match doc to filter; supports $exists for migration-style queries
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

export function createMockCollection() {
  const store: Record<string, unknown>[] = [];

  const collection = {
    async findOne(filter: Record<string, unknown>) {
      return store.find((doc) => matchFilter(doc as Record<string, unknown>, filter)) ?? null;
    },

    find(filter: Record<string, unknown> = {}, _options?: Record<string, unknown>) {
      const matches = store.filter((doc) => matchFilter(doc as Record<string, unknown>, filter));
      const cursor = {
        sort() { return cursor; },
        async toArray() { return matches; },
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

  return { collection, store, reset: () => { store.length = 0; nextId = INITIAL_ID; } };
}

// one shared store so vi.mock and server share the same collection
const singleton = createMockCollection();
export const mockUsersCollection = singleton.collection;
export const resetMockDb = singleton.reset;
