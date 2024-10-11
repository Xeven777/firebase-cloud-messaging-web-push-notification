importScripts("https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAAxu6E_K6N1P3LvD02InhN6icJihoplYg",
  authDomain: "fcm-demo-d7abc.firebaseapp.com",
  projectId: "fcm-demo-d7abc",
  storageBucket: "fcm-demo-d7abc.appspot.com",
  messagingSenderId: "515903194528",
  appId: "1:515903194528:web:1ebbd69638b3bf4fed50c5",
  measurementId: "G-M3H5YB2YQP"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );

    // payload.fcmOptions?.link comes from our backend API route handle
    // payload.data.link comes from the Firebase Console where link is the 'key'
    const link = payload.fcmOptions?.link || payload.data?.link;

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "./next.svg",
      data: { url: link },
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", function (event) {
    console.log("[firebase-messaging-sw.js] Notification click received.");

    event.notification.close();

    // This checks if the client is already open and if it is, it focuses on the tab. If it is not open, it opens a new tab with the URL passed in the notification payload
    event.waitUntil(
      clients
        // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          const url = event.notification.data.url;

          if (!url) return;

          // If relative URL is passed in firebase console or API route handler, it may open a new window as the client.url is the full URL i.e. https://example.com/ and the url is /about whereas if we passed in the full URL, it will focus on the existing tab i.e. https://example.com/about
          for (const client of clientList) {
            if (client.url === url && "focus" in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            console.log("OPENWINDOW ON CLIENT");
            return clients.openWindow(url);
          }
        })
    );
  });

  console.log("[firebase-messaging-sw.js] Firebase Messaging initialized successfully");
} catch (error) {
  console.error("[firebase-messaging-sw.js] Error initializing Firebase: ", error);
}
