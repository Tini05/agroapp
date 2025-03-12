import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <-- Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCsDOR7ImeivDIPqrIuKZb1kBO5q46zGtc",
  authDomain: "agroappmk.firebaseapp.com",
  databaseURL: "https://agroappmk-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "agroappmk",
  storageBucket: "agroappmk.firebasestorage.app",
  messagingSenderId: "581585738204",
  appId: "1:581585738204:web:03084e7d04efa9a2469719",
  measurementId: "G-3CB5FX2WK4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // <-- Initialize Firebase Storage and export it
