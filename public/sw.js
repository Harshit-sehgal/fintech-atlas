// Bump this release identifier when deploying changed static assets.
// Cache-first assets are intentionally versioned so old bundles are purged on activate.
const CACHE_NAME = "fintech-atlas-v3";
const SCOPE = self.registration.scope;
const OFFLINE_URL = new URL("offline.html", SCOPE).toString();
const HOME_URL = new URL("", SCOPE).toString();
const TOOLS_URL = new URL("tools/", SCOPE).toString();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL, HOME_URL, TOOLS_URL])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;

  const requestUrl = new URL(event.request.url);
  // Shared calculator links can contain user-entered financial inputs. Keep
  // query-bearing documents out of the offline cache so another visitor never
  // receives a cached personalized URL from this browser.
  const cacheable = requestUrl.search === "";

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (cacheable && response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => (cacheable ? await caches.match(event.request) : null) || caches.match(OFFLINE_URL)),
    );
    return;
  }

  event.respondWith(
    cacheable
      ? caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return response;
          });
        })
      : fetch(event.request),
  );
});
