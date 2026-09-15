// Service worker for the offline translator PWA.
//
// Two caches:
//   - shell:    HTML/JS/CSS/manifest (precached, cache-first)
//   - runtime:  CDN libraries + HuggingFace ONNX model files (runtime cache,
//               cache-first once fetched). Everything the app needs stays
//               available with no network.

const SHELL_CACHE   = "translator-shell-v1";
const RUNTIME_CACHE = "translator-runtime-v1";

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Domains we're willing to cache at runtime for offline use.
const RUNTIME_HOSTS = [
  "cdn.jsdelivr.net",       // transformers.js, tesseract.js
  "huggingface.co",         // model repo pages, config, tokenizer
  "cdn-lfs.huggingface.co", // ONNX weights (LFS)
  "cdn-lfs-us-1.huggingface.co",
];

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // App shell: cache-first, network fallback (offline still works).
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        }).catch(() => cached)
      )
    );
    return;
  }

  // CDN + HuggingFace: cache-first, so a subsequent offline visit still boots.
  if (RUNTIME_HOSTS.includes(url.host) || url.host.endsWith(".huggingface.co")) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res && (res.ok || res.type === "opaque")) {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        } catch (err) {
          // Offline and nothing cached — let the caller see the error.
          throw err;
        }
      })
    );
    return;
  }

  // Anything else: pass-through.
});

// Optional: allow the page to trigger cache warm-ups.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
