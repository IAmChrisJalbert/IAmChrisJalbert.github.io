// Service worker for Dad & Lorelai board push notifications.
// Lives at the site root so its scope covers /messages/ too.
// It only wakes up to show a push notification; it never reads the
// message board or touches any other page on the site.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCV5ANtfh-AE1hQPTaybFuoQH49i0B9jNA",
  authDomain: "jalbert-family-board.firebaseapp.com",
  databaseURL: "https://jalbert-family-board-default-rtdb.firebaseio.com",
  projectId: "jalbert-family-board",
  storageBucket: "jalbert-family-board.firebasestorage.app",
  messagingSenderId: "849855568702",
  appId: "1:849855568702:web:93ede9cb7b45006b19ea6f"
});

var messaging = firebase.messaging();

// Background pushes arrive as data-only messages; show the
// notification here so the title, text, and tap target are ours.
messaging.onBackgroundMessage(function (payload) {
  var data = (payload && payload.data) || {};
  var title = data.title || "Dad & Lorelai";
  var body = data.body || "New message on the board.";
  var url = data.url || "/messages/";
  self.registration.showNotification(title, {
    body: body,
    tag: "dad-lorelai-message",
    data: { url: url }
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "/messages/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].url.indexOf("/messages/") !== -1) { return clients[i].focus(); }
      }
      return self.clients.openWindow(url);
    })
  );
});
