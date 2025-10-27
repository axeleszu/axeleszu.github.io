const CACHE_NAME = 'sopa-letras-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './palabras.json',
    './sopa-ico.png',
    './ico/100.png',
    './ico/144.png',
    './ico/152.png',
    './ico/167.png',
    './ico/20.png',
    './ico/29.png',
    './ico/40.png',
    './ico/50.png',
    './ico/58.png',
    './ico/72.png',
    './ico/76.png',
    './ico/80.png',
    './music/background-music-413276.mp3',
    './music/just-relax-11157.mp3',
    './music/lofi-background-music-405228.mp3',
    './music/please-calm-my-mind-125566.mp3',
    './music/soft-background-music-409193.mp3',
    './music/youtube-background-music-lofi-398315.mp3'
];

// Evento de instalación: Cacha los archivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting()) // Fuerza la activación inmediata del nuevo SW
    );
});

// Evento de activación: Elimina cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                    return null;
                })
            );
        }).then(() => self.clients.claim()) // Permite que el nuevo SW controle la página inmediatamente
    );
});

// Evento de fetch: Sirve archivos desde la caché o desde la red
self.addEventListener('fetch', (event) => {
    // Solo interceptar peticiones GET
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Si el recurso está en caché, lo devuelve
                    if (response) {
                        return response;
                    }
                    // Si no está en caché, va a la red
                    return fetch(event.request)
                        .then((networkResponse) => {
                            // Intenta cachear la respuesta si es válida
                            return caches.open(CACHE_NAME).then((cache) => {
                                // Solo cachea respuestas exitosas (código 200) y que no sean extensiones de Chrome
                                if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                                    cache.put(event.request, networkResponse.clone());
                                }
                                return networkResponse;
                            });
                        })
                        .catch(() => {
                            // Manejo de errores de red (por ejemplo, si no hay conexión y no está en caché)
                            console.log('Service Worker: Fallo en la red para', event.request.url);
                            // Podrías devolver una página offline personalizada aquí si tuvieras una
                            // return caches.match('/offline.html');
                            // O simplemente fallar, lo que el navegador manejaría
                            return new Response(null, { status: 503, statusText: 'Service Unavailable (Offline)' });
                        });
                })
        );
    }
});