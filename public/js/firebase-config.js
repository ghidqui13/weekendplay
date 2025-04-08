import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWIGsGORaZ1IAV8NhdtjYEMiKQm4aNfgM",
  authDomain: "weekendplay-f8155.firebaseapp.com",
  projectId: "weekendplay-f8155",
  storageBucket: "weekendplay-f8155.firebasestorage.app",
  messagingSenderId: "932744229170",
  appId: "1:932744229170:web:cf5c4378729826aaefe72b",
  measurementId: "G-HELFK3NWWN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

console.log("Firebase inicializado correctamente");

export { db, analytics };
