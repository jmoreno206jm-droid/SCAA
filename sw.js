const CACHE_NAME = "adecco-asistencia-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://unpkg.com/html5-qrcode"
];

// INSTALAR
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVAR
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
});

// FETCH (CACHE FIRST)
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
  );
});
