importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBGQh4I8whYW3W3ARkhFoZprK66uqgBxdc",
    authDomain: "bhagwan-traders.firebaseapp.com",
    projectId: "bhagwan-traders",
    messagingSenderId: "771911695390",
    appId: "1:771911695390:web:bcf7c9b81dab3371bdc20f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
