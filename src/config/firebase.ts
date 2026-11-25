import { getDatabase } from "firebase/database";
import { initializeApp, getApp, getApps } from "firebase/app";

import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  databaseURL: "https://filmx-adac8-default-rtdb.asia-southeast1.firebasedatabase.app",
  apiKey: "AIzaSyCNmNecadwXc8YIrJdd14CF0xjvGBAPIEA",
  authDomain: "filmx-adac8.firebaseapp.com",
  projectId: "filmx-adac8",
  storageBucket: "filmx-adac8.firebasestorage.app",
  messagingSenderId: "570546844135",
  appId: "1:570546844135:web:7ae6825acb6f32dcfd8d42",
  measurementId: "G-KWZDCJNGP2",
};

// Firebase App
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// Firebase Authentication + Session Persistence
const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: any) {
    if (error.code === "auth/already-initialized") {
      return getAuth(app);
    }

    throw error;
  }
})();

// Cloud Firestore
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };