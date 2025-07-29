
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2qwyKpRU79jYXywOUP14dYTy8xitFn3o",
  authDomain: "sidx1hack.firebaseapp.com",
  projectId: "sidx1hack",
  storageBucket: "sidx1hack.firebasestorage.app",
  messagingSenderId: "1049335486780",
  appId: "1:1049335486780:web:8fc352c9399056262c6639",
  measurementId: "G-HREFBT3C8G"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
