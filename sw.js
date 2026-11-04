/* Service worker de l'appli web Les Aventuriers (lot W3).
   Tout est gardé en cache à l'installation : le jeu marche hors-ligne. Une nouvelle version s'installe en arrière-plan
   et attend ; la page propose « Recharger » et envoie « activer » quand le joueur accepte. La version et la liste des fichiers
   sont remplis par build.js. */
const VERSION = '2.64-25ce6a32', CACHE = 'aventuriers-' + VERSION, FICHIERS = ["./","index.html","manifest.webmanifest","polices.css","fonts/caveat-latin-600-normal.woff2","fonts/caveat-latin-ext-600-normal.woff2","fonts/karla-latin-400-normal.woff2","fonts/karla-latin-600-normal.woff2","fonts/karla-latin-800-normal.woff2","fonts/karla-latin-ext-400-normal.woff2","fonts/karla-latin-ext-600-normal.woff2","fonts/karla-latin-ext-800-normal.woff2","fonts/rubik-dirt-latin-400-normal.woff2","fonts/rubik-dirt-latin-ext-400-normal.woff2","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('aventuriers-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'activer') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // la page : le cache d'abord (hors-ligne), mise à jour par le service worker suivant
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r).catch(() => r.mode === 'navigate' ? caches.match('./') : Response.error())));
});
