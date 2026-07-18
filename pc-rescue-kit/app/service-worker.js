const CACHE_NAME = "winhacks-pc-rescue-layout-fix-v11";
const APP_SHELL = [
  "./",
  "./index.html",
  "./offline.html",
  "./styles/rescue-kit.css",
  "/css/style.css",
  "./js/app.js",
  "./js/components-loader.js",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "/components/navbar.html",
  "/components/footer.html",
  "/assets/images/logo-winhacks-horizontal.webp",
  "../browser/knowledge-engine.browser.js",
  "../browser/decision-engine.browser.js",
  "../browser/session-engine.browser.js",
  "../generated/knowledge-index.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isKnowledgeData =
    url.pathname.includes("/pc-rescue-kit/knowledge/") ||
    url.pathname.endsWith("/pc-rescue-kit/generated/knowledge-index.json");

  if (isKnowledgeData) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error("Recurso no disponible sin conexión.");
  }
}
