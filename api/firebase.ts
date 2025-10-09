// api/firebase.ts
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCuX7qboDJLAnLJgoHutbYtMx-p3urFNOY",
  authDomain: "easemart-72a14.firebaseapp.com",
  projectId: "easemart-72a14",
  storageBucket: "easemart-72a14.firebasestorage.app",
  messagingSenderId: "1019797663229",
  appId: "1:1019797663229:web:ac516056710dc87219fd94",
  measurementId: "G-4GY1NHYN28"
};

// ✅ initialize app
export const app = initializeApp(firebaseConfig);

// ✅ initialize auth (with default persistence — we already handled persistence in context)
export const auth = initializeAuth(app);

// ✅ initialize Firestore
export const db = getFirestore(app);

// ✅ initialize Storage if needed
export const storage = getStorage(app);

export default app;
