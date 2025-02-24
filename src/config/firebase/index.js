// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADAGuv7H_6S7FzRk37GEaoGud24GcN5Og",
  authDomain: "food-hub-hsd.firebaseapp.com",
  projectId: "food-hub-hsd",
  storageBucket: "food-hub-hsd.firebasestorage.app",
  messagingSenderId: "152988302873",
  appId: "1:152988302873:web:3aa6649c160011cc983488",
  measurementId: "G-8QQ40PHNMQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const DB = getFirestore(app);

export { auth, signInWithEmailAndPassword, DB, doc, setDoc, getDoc };
