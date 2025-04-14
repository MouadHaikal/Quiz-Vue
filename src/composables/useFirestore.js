// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDH2mXVmwA9rIBZjJlQWsfdPTs9jf0BFqM",
    authDomain: "quiz-vue-2a213.firebaseapp.com",
    projectId: "quiz-vue-2a213",
    storageBucket: "quiz-vue-2a213.firebasestorage.app",
    messagingSenderId: "553454177478",
    appId: "1:553454177478:web:200ec9e8375fb9797f5bc7",
    measurementId: "G-4QZDZNYT39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
