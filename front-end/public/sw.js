const CACHE_NAME="youtubee"
const BACKEND_URL = process.env.YOUTUBEE_BACK_END_URL;
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(CACHE_NAME).then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/main.js',
       '/global.css',
       '/bulma.min.css',
       '/manifest.webmanifest'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});

var serverData
self.addEventListener('push', function(event) {
  serverData = event.data.json()
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(function(clientList) {
        return clientList.some(c=>c.visibilityState == "visible")
      }).then(pageVisible=>{
        console.log(pageVisible)
        if(pageVisible) return
        if(serverData.status == 'download_ready'){
          const title = 'Your download is ready';
          console.log(event.data.json())
          const options = {
            body: `"${event.data.json().title}" is ready, click here to download`,
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
          self.registration.showNotification(title, options);
        }
      }
    ));


});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.', event);
  event.notification.close();
  if ('actions' in Notification.prototype) {
  // Action buttons are supported.
    if(event.action == "download"){
      //Download file directly
      event.waitUntil(clients.openWindow(BACKEND_URL + serverData.url))
    }else if (event.action == "cancel"){
      //Delete file from server
      if("close" in Notification) Notification.close()
    }else {
      //Show download screen gui
    }
  } else {
    // Action buttons are NOT supported.
    // download file OR Show download screen gui
  }
});
