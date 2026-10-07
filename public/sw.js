const CACHE_NAME = "agent-factory-v1";
const STATIC_ASSETS = ["/manifest.json", "/favicon.svg", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // NEVER intercept Next.js chunks, HMR, or API SSE streams!
  if (
    url.includes("/_next/") ||
    url.includes("/api/") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Network-first for HTML pages so user always sees the latest UI
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
