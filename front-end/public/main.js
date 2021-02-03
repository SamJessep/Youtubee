// Register the service worker if available.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");


}, false);

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");

}, false);

// Check if the user is connected.
if (navigator.onLine) {

} else {
    // Show offline message

}

// Set Knockout view model bindings.
