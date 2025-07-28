// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGQh4I8whYW3W3ARkhFoZprK66uqgBxdc",
  authDomain: "bhagwan-traders.firebaseapp.com",
  projectId: "bhagwan-traders",
  storageBucket: "bhagwan-traders.firebasestorage.app",
  messagingSenderId: "771911695390",
  appId: "1:771911695390:web:bcf7c9b81dab3371bdc20f",
  measurementId: "G-EM34QFH8HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };