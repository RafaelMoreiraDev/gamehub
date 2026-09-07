const CACHE = 'gamehub-v1';
const CORE = ['/', '/index.html', '/css/style.css?v=3.4', '/js/main.js?v=3.9', '/js/analytics.js?v=1', '/manifest.json', '/img/icon-192.png', '/img/icon-512.png'];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
    const isPage = event.request.mode === 'navigate';
    event.respondWith(isPage
        ? fetch(event.request).then(response => {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
            return response;
        }).catch(() => caches.match(event.request).then(response => response || caches.match('/index.html')))
        : caches.match(event.request).then(response => response || fetch(event.request).then(network => {
            const copy = network.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
            return network;
        }))
    );
});
