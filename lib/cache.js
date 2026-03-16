// lib/cache.js — In-memory cache
const cache = new Map();
export async function withCache(key, fetcher, ttl=300) {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now-cached.timestamp < ttl*1000) return cached.data;
  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
}
export function invalidate(key) { cache.delete(key); }
export function invalidateAll() { cache.clear(); }
