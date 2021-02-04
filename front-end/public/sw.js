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


self.addEventListener('push', function(event) {
  //Remove website name from notification
  const title = 'Youtubee';
  const options = {
    body: 'Your download is ready',
    icon: '/icons/download-notification.png',
    badge: '/icons/download-notification.png',
    //image: video thumbnail,
    //Change this to video specific tag later
    tag: 'download',
    renotify: true,
    requireInteraction: true,
    actions: [
      { "action": "download", "title": "Download" },
      { "action": "cancel", "title": "Cancel" }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.', event);
  event.notification.close();

  if ('actions' in Notification.prototype) {
  // Action buttons are supported.
    if(event.action == "download"){
      //Download file directly
      // event.data.json()
      // event.data.text()
    }else if (event.action == "cancel"){
      //Delete file from server
    }else {
      //Show download screen gui
    }
  } else {
    // Action buttons are NOT supported.
    // download file OR Show download screen gui
  }
  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});
