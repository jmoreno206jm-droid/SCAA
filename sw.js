const CACHE_NAME = "rrhh-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icono-192.png",
  "./icono-512.png",
  "https://unpkg.com/html5-qrcode"
];

// INSTALACIÓN
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ACTIVACIÓN
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

// FETCH (modo híbrido: cache + red)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // fallback básico offline
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});