const CACHE_NAME = "asistencia-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {

  // NO tocar la API
  if (e.request.url.includes("script.google.com")) return;

  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(resp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resp.clone());
          return resp;
        });
      });
    }).catch(() => new Response("Sin conexión"))
  );
});
