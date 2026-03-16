// lib/cache.js — simplified, no async_hooks
export async function withCache(key, fetcher, ttl = 300) {
  // Edge runtime: không cache, gọi thẳng
  return fetcher();
}
export function invalidate(key) {}
export function invalidateAll() {}