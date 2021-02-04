// Register the service worker if available.
const applicationServerPublicKey = "BOYuHV4mnhvdYjV_q8GOXI9pY8t-J0Z_2kdS6pFhPGAXwXtQPOUwZnSL513P-_Xv75FJMEDIx-lJ2kwMisTOQ1o"
var swRegistration;
var userSubscription

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
      swRegistration = reg
      initializeUI()
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

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function initializeUI() {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
      userSubscription = subscription
    } else {
      subscribeUser();
      console.log('User is NOT subscribed.');
    }
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');
    updateSubscriptionOnServer(subscription);
    userSubscription = subscription
    isSubscribed = true;
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
  });
}

function updateSubscriptionOnServer(subscription){
  console.log("SERVER", subscription)
}
