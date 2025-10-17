const CACHE_NAME = 'fira-app-tour-v1';

const urlsToCache = [
    './',
    "./agenda.html",
    "./durante-visita.html",
    "./header.html",
    "./inteligencia.html",
    "./ppt.html",
    "./sw.js",
    "./bitacora.html",
    "./ficha-cultivo.html",
    "./login.html",
    "./proyectos.html",
    "./tareas.html",
    "./contactos.html",
    "./footer.html",
    "./manifest.json",
    "./script.js",
    "./dashboard.html",
    "./guias-promocion.html",
    "./index.html",
    "./nueva-guia.html",
    "./style.css",
    "./img/agenda.svg",
    "./img/icon-192x192.png",
    "./img/avanceSemanal.png",
    "./img/icon-512x512.png",
    "./img/back.jpg",
    "./img/ideas.svg",
    "./img/inteligencia.svg",
    "./img/back.svg",
    "./img/llamada.svg",
    "./img/back2.jpg",
    "./img/LOGO-FIRA-2024.svg",
    "./img/bitacora.svg",
    "./img/manual-promotor.svg",
    "./img/candado.svg",
    "./img/navegar.svg",
    "./img/check.svg",
    "./img/notificaciones.svg",
    "./img/contactos.svg",
    "./img/ojo-cerrado.svg",
    "./img/dashboard.svg",
    "./img/ojo.svg",
    "./img/detalle3-hori.svg",
    "./img/organigrama.svg",
    "./img/detalle3-vert.svg",
    "./img/ppt-actividades.png",
    "./img/documento-buro.svg",
    "./img/ppt-esquema.png",
    "./img/editar.svg",
    "./img/ppt.svg",
    "./img/eliminar.svg",
    "./img/promocion.svg",
    "./img/email.svg",
    "./img/reunion.svg",
    "./img/firmar.svg",
    "./img/search.svg",
    "./img/fotografia.svg",
    "./img/tareas.svg",
    "./img/user.svg",
    "./img/guia.svg",
    "./img/visita.svg",
    "./img/home.svg"

];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si encontramos el recurso en el caché, lo devolvemos
                if (response) {
                    return response;
                }
                // Si no, vamos a la red a buscarlo
                return fetch(event.request);
            }
            )
    );
});