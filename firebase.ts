import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAxu6E_K6N1P3LvD02InhN6icJihoplYg",
  authDomain: "fcm-demo-d7abc.firebaseapp.com",
  projectId: "fcm-demo-d7abc",
  storageBucket: "fcm-demo-d7abc.appspot.com",
  messagingSenderId: "515903194528",
  appId: "1:515903194528:web:1ebbd69638b3bf4fed50c5",
  measurementId: "G-M3H5YB2YQP",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
