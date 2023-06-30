// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCakOmADgzuIMA-q6xKTHbPIMnw8jV8Ugw",
  authDomain: "time-tracker-974a0.firebaseapp.com",
  projectId: "time-tracker-974a0",
  storageBucket: "time-tracker-974a0.appspot.com",
  messagingSenderId: "64820418705",
  appId: "1:64820418705:web:4f79f77b3dc8b7ec6b8730",
  measurementId: "G-6GJMTGPSGT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const DB = getFirestore(app);
