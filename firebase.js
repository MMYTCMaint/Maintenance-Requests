// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4AHWrHdytdhRCJT48hZKuvfnhmnwOVxs",
  authDomain: "maintenance-request-d98ba.firebaseapp.com",
  projectId: "maintenance-request-d98ba",
  storageBucket: "maintenance-request-d98ba.appspot.com",
  messagingSenderId: "573805910976",
  appId: "1:573805910976:web:e08358db39a0379aec4625",
  measurementId: "G-6TX3D53K3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
