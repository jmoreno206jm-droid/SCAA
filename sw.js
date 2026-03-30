const CACHE_NAME = "rrhh-cache-v3";

const urlsToCache = [
  "/SCAA/",
  "/SCAA/index.html",
  "/SCAA/manifest.json",
  "/SCAA/icon-192.png",
  "/SCAA/icon-512.png",
  "https://unpkg.com/html5-qrcode"
];

// INSTALAR
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ACTIVAR
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH (cache + red + fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/SCAA/index.html");
        }
      });
    })
  );
});
