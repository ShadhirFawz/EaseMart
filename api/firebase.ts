// Firebase init (auth, firestore, storage)
// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuX7qboDJLAnLJgoHutbYtMx-p3urFNOY",
  authDomain: "easemart-72a14.firebaseapp.com",
  projectId: "easemart-72a14",
  storageBucket: "easemart-72a14.firebasestorage.app",
  messagingSenderId: "1019797663229",
  appId: "1:1019797663229:web:ac516056710dc87219fd94",
  measurementId: "G-4GY1NHYN28"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
