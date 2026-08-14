const CACHE_NAME = "asistencia-v2";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./icon-192.png",
  "./icon-512.png"
];

// INSTALACION
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVACION
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
  self.clients.claim();
});

// FETCH (CACHE FIRST + NETWORK FALLBACK)
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request)
        .then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, fetchRes.clone());
            return fetchRes;
          });
        })
        .catch(() => {
          // fallback offline
          if (e.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
