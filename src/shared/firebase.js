// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Techsynergy Solutions
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API, 
  authDomain: "crm-solutions-34e5f.firebaseapp.com",
  projectId: "crm-solutions-34e5f",
  storageBucket: "crm-solutions-34e5f.firebasestorage.app",
  messagingSenderId: "435834723182",
  appId: "1:435834723182:web:741906c5a7ba4ec574ff7f",
  measurementId: "G-VR3W0KQQVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);