// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVRXOmp513dEl-Gw1YKlsmlFXgumyS9cM",
  authDomain: "gesgan-3be6d.firebaseapp.com",
  projectId: "gesgan-3be6d",
  storageBucket: "gesgan-3be6d.appspot.com",
  messagingSenderId: "41510388529",
  appId: "1:41510388529:web:ffd598e2ad27d887cd6610",
  measurementId: "G-0N732CBWGL",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Colección de transacciones
const transactionsCollection = collection(db, "transactions");

export { db, transactionsCollection };
