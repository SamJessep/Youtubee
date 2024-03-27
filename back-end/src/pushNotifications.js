const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = {
  publicKey: 'BOYuHV4mnhvdYjV_q8GOXI9pY8t-J0Z_2kdS6pFhPGAXwXtQPOUwZnSL513P-_Xv75FJMEDIx-lJ2kwMisTOQ1o',
  privateKey: 'EwIrVghHeawpmQY0yncDzvzUpe97Df1JlHNjC7V2d5Q'
};

webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:sam@youtubee.tk',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function SendNotification(sub, data){
  webpush.sendNotification(sub, data);
}

exports.SendNotification = SendNotification
