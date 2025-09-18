import { LRUCache } from "lru-cache";

// Define cache options with TypeScript
type CacheOptions = {
  max: number; // Maximum number of items
  ttl: number; // Time to live in milliseconds
  allowStale?: boolean;
};

// Create separate caches for different types of data
const createCache = <T extends Record<string, any>>(options: CacheOptions) =>
  new LRUCache<string, T>({
    max: options.max,
    ttl: options.ttl,
    allowStale: options.allowStale ?? false,
    updateAgeOnGet: true,
  });

// Cache for repository tree data (24 hours)
export const treeCache = createCache<Record<string, any>>({
  max: 1,
  ttl: 24 * 60 * 60 * 1000,
  allowStale: true, // Allow serving stale data while revalidating
});

// Cache for file contents (1 hour)
export const fileCache = createCache<Record<string, any>>({
  max: 1000, // Store up to 1000 files
  ttl: 60 * 60 * 1000,
  allowStale: true,
});

// Cache for package data (30 minutes)
export const packageCache = createCache<Record<string, any>>({
  max: 1,
  ttl: 30 * 60 * 1000,
  allowStale: true,
});

// Utility functions
export const getCached = async <T extends Record<string, any>>(
  cache: LRUCache<string, T>,
  key: string,
  fetchFn: () => Promise<T>,
): Promise<T> => {
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache hit for ${key}`);
    return cached;
  }

  console.log(`Cache miss for ${key}, fetching data...`);
  const data = await fetchFn();
  cache.set(key, data);
  return data;
};
