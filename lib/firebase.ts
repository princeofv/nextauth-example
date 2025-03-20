// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyC312aeb917rUmkbJiY-7OsKPKcvnQ27vY",
authDomain: "qwik-notes.firebaseapp.com",
projectId: "qwik-notes",
storageBucket: "qwik-notes.firebasestorage.app",
messagingSenderId: "1046346743022",
appId: "1:1046346743022:web:d3f8784174ca3e8a5107ff",
measurementId: "G-FBQ76WMM17"
};
export const googleProvider = new GoogleAuthProvider();

// Ensure Firebase is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
