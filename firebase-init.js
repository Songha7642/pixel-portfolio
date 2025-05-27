import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiSJ3gQYsPge2t8k6xb23erbPySBmdkRU",
  authDomain: "postinstore-d132f.firebaseapp.com",
  projectId: "postinstore-d132f",
  storageBucket: "postinstore-d132f.firebasestorage.app",
  messagingSenderId: "659330503960",
  appId: "1:659330503960:web:29b7673c0939fca75b3a6d",
  measurementId: "G-BTMZHJ8S7R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Gán cho global window để file script.js dùng được
window.firebaseApp = {
 db,
  storage,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  ref,
  uploadBytes,
  getDownloadURL,
  query,
  orderBy
};
