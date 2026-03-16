const CACHE_VERSION = "v1";
const SHELL_CACHE   = `muachungcu-shell-${CACHE_VERSION}`;
const API_CACHE     = `muachungcu-api-${CACHE_VERSION}`;
const IMG_CACHE     = `muachungcu-img-${CACHE_VERSION}`;
const SHELL_URLS    = ["/", "/offline", "/manifest.json"];

self.addEventListener("install", e => { e.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL_URLS))); self.skipWaiting(); });

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==SHELL_CACHE&&k!==API_CACHE&&k!==IMG_CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method!=="GET"||!url.protocol.startsWith("http")) return;
  if (url.pathname.startsWith("/api/")) { e.respondWith(networkFirst(request, API_CACHE)); return; }
  if (request.destination==="image") { e.respondWith(cacheFirst(request, IMG_CACHE)); return; }
  if (url.origin===self.location.origin) { e.respondWith(shellStrategy(request)); return; }
  e.respondWith(cacheFirst(request, SHELL_CACHE));
});

async function networkFirst(request, cacheName, timeout=5000) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([fetch(request.clone()), new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),timeout))]);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ success:false, error:"Offline", offline:true }), { headers:{"Content-Type":"application/json"} });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try { const res = await fetch(request); if (res.ok) cache.put(request, res.clone()); return res; } catch { return new Response("",{status:404}); }
}

async function shellStrategy(request) {
  const cache = await caches.open(SHELL_CACHE);
  try { const res = await fetch(request); if (res.ok) cache.put(request, res.clone()); return res; }
  catch { return (await cache.match(request)) || (await cache.match("/offline")) || new Response("<h1>Offline</h1>",{headers:{"Content-Type":"text/html"}}); }
}

self.addEventListener("push", e => {
  const data = e.data?.json()??{};
  e.waitUntil(self.registration.showNotification(data.title||"MuaChungCu.net", { body:data.body||"Có thông tin mới về dự án bạn quan tâm", icon:"/icons/icon-192x192.png", data:{ url:data.url||"/" } }));
});

self.addEventListener("notificationclick", e => { e.notification.close(); e.waitUntil(clients.openWindow(e.notification.data.url)); });
