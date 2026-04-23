const CACHE_NAME = 'knights-hub-v1';
const ASSETS_TO_CACHE = ['/', '/aknight-01.png', '/main.css', '/main.js'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.url.includes('/sockjs/')) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    
    const fetchPromise = fetch(event.request).then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => new Response('Offline', { status: 503 }));

    return cachedResponse || fetchPromise;
  })());
});