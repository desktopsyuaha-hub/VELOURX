/* =============================================
   VELOURX — firebase-config.js
   Firebase initialization (Auth + Firestore)
   Loaded as a module on every page that needs login/cart sync
   ============================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ---- YOUR FIREBASE CONFIG ----
const firebaseConfig = {
  apiKey: "AIzaSyBtbzoUH0bLNsdZz8aZ68882nnVzOGsHf4",
  authDomain: "velourx.firebaseapp.com",
  projectId: "velourx",
  storageBucket: "velourx.firebasestorage.app",
  messagingSenderId: "385858256443",
  appId: "1:385858256443:web:023aea6db767b809eee61e"
};

// ---- INITIALIZE ----
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/* =============================================
   AUTH FUNCTIONS
   ============================================= */

// Sign up with email/password + real name
async function vxSignUp(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  // create user doc in Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    name: name,
    email: email,
    createdAt: serverTimestamp(),
    cart: []
  });
  return cred.user;
}

// Login
async function vxLogin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Google Sign-In
async function vxGoogleSignIn() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  // create user doc if doesn't exist
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "VELOURX Customer",
      email: user.email,
      createdAt: serverTimestamp(),
      cart: []
    });
  }
  return user;
}

// Logout
async function vxLogout() {
  await signOut(auth);
}

// Listen for auth state changes (call this on every page)
function vxOnAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get current user's Firestore profile doc
async function vxGetUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

/* =============================================
   CART SYNC (per logged-in user, stored in Firestore)
   ============================================= */

async function vxSaveCartToCloud(uid, cartArray) {
  await updateDoc(doc(db, "users", uid), { cart: cartArray });
}

async function vxLoadCartFromCloud(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists() && snap.data().cart) return snap.data().cart;
  return [];
}

/* =============================================
   ORDERS (real order history per user)
   ============================================= */

async function vxCreateOrder(uid, orderData) {
  const ref = await addDoc(collection(db, "orders"), {
    uid: uid,
    ...orderData,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

async function vxGetUserOrders(uid) {
  // simple version: stored as array reference per user doc is heavier to query;
  // for now orders are tagged with uid and fetched via collection query in account.js
  return [];
}

/* ---- EXPORT TO WINDOW (so non-module scripts like app.js can use these) ---- */
window.vxAuth = auth;
window.vxDb = db;
window.vxSignUp = vxSignUp;
window.vxLogin = vxLogin;
window.vxGoogleSignIn = vxGoogleSignIn;
window.vxLogout = vxLogout;
window.vxOnAuthChange = vxOnAuthChange;
window.vxGetUserProfile = vxGetUserProfile;
window.vxSaveCartToCloud = vxSaveCartToCloud;
window.vxLoadCartFromCloud = vxLoadCartFromCloud;
window.vxCreateOrder = vxCreateOrder;
window.vxFirebaseReady = true;

// Let other scripts know Firebase has finished loading
window.dispatchEvent(new Event('vxFirebaseReady'));

