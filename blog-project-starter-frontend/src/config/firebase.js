import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBvuidX_q7ayDSJjkHeTZS9rOls9wB5SHc",
  authDomain: "blog-app-58a7f.firebaseapp.com",
  projectId: "blog-app-58a7f",
  storageBucket: "blog-app-58a7f.firebasestorage.app",
  messagingSenderId: "1044504710279",
  appId: "1:1044504710279:web:dfd1dc6c542c71604bbc22",
  measurementId: "G-WRB6C68CC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth
