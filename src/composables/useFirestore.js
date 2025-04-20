// Import Firebase core and the services you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// Your Firebase config
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

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth,storage };
const storage = getStorage(app);
