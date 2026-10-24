// Minimal offline shell — cache the app shell, always try network first for API
const CACHE = 'bestapply-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache Claude / API calls
  if (url.hostname.includes('anthropic.com') || url.pathname.startsWith('/api/')) return;
  // Network-first, fall back to cache for shell
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && e.request.method === 'GET' && url.origin === location.origin) {
        const clone = r.clone(); caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
