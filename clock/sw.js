const CACHE_NAME = 'activity-timeline-cache-v1';

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './dexie.js',
    './manifest.json',
    './ding.mp3',
    './CatSpriteSheet.png',
    './fonts.css',
    './fonts/nunito-latin-ext-italic.woff2',
    './fonts/nunito-latin-ext.woff2',
    './fonts/nunito-latin-italic.woff2',
    './fonts/nunito-latin.woff2',
    './ico/all.min.css',
    './ico/fa-brands-400.woff2',
    './ico/fa-regular-400.woff2',
    './ico/fa-solid-900.woff2',
    './ico/fa-v4compatibility.woff2',
    './backend.html',
    './backenStyle.css',
    './backendScript.js',
    './icon-1024x1024.png',
    './icon-512x512.png',
    './icon-192x192.png'
];

// 1. Installation
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// 2. Activation
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. Fetch
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the request is in the cache, return the cached response.
                if (response) {
                    return response;
                }
                // If it's not in the cache, fetch it from the network.
                return fetch(event.request);
            })
    );
});