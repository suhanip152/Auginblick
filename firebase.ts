// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnsRPiCGlDOyz6-zdOm4DDuJ0LnXsPjDw",
  authDomain: "notion-clone-faa7b.firebaseapp.com",
  projectId: "notion-clone-faa7b",
  storageBucket: "notion-clone-faa7b.appspot.com",
  messagingSenderId: "1050395892433",
  appId: "1:1050395892433:web:268dd0260d5e2878ca43f0"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore(app);


export  { db }
