// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// 🔹 Configuración de Firebase (usa la tuya)
  const firebaseConfig = {
    apiKey: "AIzaSyDLZ4FpNpC-p3YxYSgaoVQG6HU3qIgAkEk",
    authDomain: "ecopuntos-d237e.firebaseapp.com",
    projectId: "ecopuntos-d237e",
    storageBucket: "ecopuntos-d237e.firebasestorage.app",
    messagingSenderId: "1059612659986",
    appId: "1:1059612659986:web:391a52521c34ec2451e3cb",
    measurementId: "G-PW1ZCBK394"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Registro de usuario
 */
export async function registerUser(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    name,
    email,
    points: 0,
    history: []
  });

  return uid;
}

/**
 * Login
 */
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Logout
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Sumar puntos y guardar historial
 */
export async function addPoints(uid, points, material, quantity) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const currentPoints = userSnap.data().points || 0;
    await updateDoc(userRef, {
      points: currentPoints + points,
      history: arrayUnion({
        material,
        quantity,
        points,
        date: new Date().toISOString()
      })
    });
  }
}

/**
 * Canjear puntos y generar código
 */
export async function redeemReward(uid, cost, rewardName, code) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const currentPoints = userSnap.data().points || 0;
    if (currentPoints >= cost) {
      await updateDoc(userRef, {
        points: currentPoints - cost,
        history: arrayUnion({
          reward: rewardName,
          pointsUsed: cost,
          code,
          date: new Date().toISOString()
        })
      });
      return true;
    } else {
      throw new Error("Puntos insuficientes");
    }
  }
}
