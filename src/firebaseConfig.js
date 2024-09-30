// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration (ajusta esta configuración con la que obtuviste de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyA-dJQXoaPmDW2BBNxyPyO1SbqLi9dpVlU",
  authDomain: "prueba-44a8b.firebaseapp.com",
  databaseURL: "https://prueba-44a8b-default-rtdb.firebaseio.com",
  projectId: "prueba-44a8b",
  storageBucket: "prueba-44a8b.appspot.com",
  messagingSenderId: "179450795567",
  appId: "1:179450795567:web:33ae78b560a5972af998da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Inicializa Firebase Realtime Database

export { db };
