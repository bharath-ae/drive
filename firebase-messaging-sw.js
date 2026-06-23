// firebase-messaging-sw.js
// Firebase Cloud Messaging background service worker for DrivePro.
//
// IMPORTANT: This file must be hosted at the ROOT of your site
// (e.g. https://yourdomain.com/firebase-messaging-sw.js), as a sibling
// to your index.html — NOT inside a subfolder, and NOT inlined into the
// HTML file. Service workers are registered by exact URL and their
// default scope covers everything at or below the folder they're served
// from, so it needs to sit at the root to control the whole app.
//
// The app already calls:
//   navigator.serviceWorker.register('/firebase-messaging-sw.js')
// so as long as this file is uploaded to that exact path, it will be
// picked up automatically — no other code changes are required.

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDTjBL6tbQ1cbX-0Fvn8i6D5cEuf-Tr1w8",
  authDomain: "driving-scoolmanagement.firebaseapp.com",
  projectId: "driving-scoolmanagement",
  storageBucket: "driving-scoolmanagement.firebasestorage.app",
  messagingSenderId: "741852892786",
  appId: "1:741852892786:web:7a419b6efcba83be7d7ceb",
  measurementId: "G-HG1WLCY5W0"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Fired when a push arrives while the app/tab is closed or in the
// background (i.e. not the active, focused tab).
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'DrivePro Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || 'You have a new message.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    // Carry along any extra data (e.g. a deep link) sent from your backend
    // so the click handler below can use it.
    data: payload.data || {},
    tag: payload.data?.tag || 'drivepro-notification'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// When the user taps/clicks the notification, focus an existing app tab
// if one is open, otherwise open a new one. Without this, clicking a
// notification does nothing visible to the user.
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
