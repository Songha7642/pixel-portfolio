// firebase-init.js — KHỞI TẠO Firebase + Expose helpers ra window

// 1) App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

// 2) Firestore
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp, // để lưu thời gian máy chủ
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 3) Storage
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// ==== Cấu hình dự án ====
const firebaseConfig = {
  apiKey: "AIzaSyBiSJ3gQYsPge2t8k6xb23erbPySBmdkRU",
  authDomain: "postinstore-d132f.firebaseapp.com",
  projectId: "postinstore-d132f",
  storageBucket: "postinstore-d132f.firebasestorage.app", // nếu lỗi, thử "postinstore-d132f.appspot.com"
  messagingSenderId: "659330503960",
  appId: "1:659330503960:web:29b7673c0939fca75b3a6d",
  measurementId: "G-BTMZHJ8S7R",
};

// ==== Khởi tạo app / db / storage ====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ==== Expose TẤT CẢ helpers ra window cho script.js dùng ====
window.firebaseApp = {
  // Firestore
  db,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,

  // Storage
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
};
