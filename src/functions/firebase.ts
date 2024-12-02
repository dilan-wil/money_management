// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5QKFZd-j71lAHFT9AdZlfjB_H1hJSmpE",
  authDomain: "money-management-fd73e.firebaseapp.com",
  projectId: "money-management-fd73e",
  storageBucket: "money-management-fd73e.firebasestorage.app",
  messagingSenderId: "65077078549",
  appId: "1:65077078549:web:29429a7d31910584153c1c",
  measurementId: "G-F5GN4JQ31W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }