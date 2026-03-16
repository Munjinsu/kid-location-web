// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA0qnnrOiBRBNPhM_484eCO6xjgwvK8rSo",
  authDomain: "kid-location-tracker.firebaseapp.com",
  databaseURL: "https://kid-location-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kid-location-tracker",
  storageBucket: "kid-location-tracker.firebasestorage.app",
  messagingSenderId: "476847945412",
  appId: "1:476847945412:web:6aa2dcfc1129573250fb91"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);