// Use a cacheName for cache versioning
var CACHE_STORE = 'v1:static';
var $FILES = ['./']
caches.delete('v1:static');
// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(CACHE_STORE).then(function(cache) {
            return cache.addAll($FILES).then(function() {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', event => {
   event.waitUntil(
     caches.open(CACHE_STORE)
       .then(cache => {
         return cache.keys()
           .then(cacheNames => {
             return Promise.all(
               cacheNames.filter(cacheName => {
                 return $FILES.indexOf(cacheName) === -1;
               }).map(cacheName => {
                 return caches.delete(cacheName);
               })
             );
           })
           .then(() => {
             return self.clients.claim();
           });
       })
   );
 });

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});
