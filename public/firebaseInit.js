/*** 🔥 Firebase Initialization ***/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAOnK4i6IeiIQUMZFdNW44nBFuInl81yfk",
    authDomain: "pip-ai.firebaseapp.com",
    projectId: "pip-ai",
    storageBucket: "pip-ai.firebasestorage.app",
    messagingSenderId: "305570743594",
    appId: "1:305570743594:web:96359b4734bb720f5cca53",
    measurementId: "G-K4TQ4CE34M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
