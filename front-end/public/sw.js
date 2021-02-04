importScripts('/cache-polyfill.js');
const CACHE_NAME="youtubee"

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(CACHE_NAME).then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/main.js',
       '/global.css',
       '/bulma.min.css',
       '/manifest.webmanifest',
       '/favicon.png'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});
