// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import exp from "constants";

// import "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvv8hpHMXE_aKHbXmCUGygFSEIiHZTvJM",
    authDomain: "handy35l.firebaseapp.com",
    projectId: "handy35l",
    storageBucket: "handy35l.firebasestorage.app",
    messagingSenderId: "690933385734",
    appId: "1:690933385734:web:3171e6615b22ba54bc9187",
    measurementId: "G-5P03H6DNQ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// import app from './firebase';
export default app;