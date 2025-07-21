// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyB04bqo0BsEJaV5SymGFY64_YXT2dBd5yw",
  authDomain: "number-guessing-game-c18bc.firebaseapp.com",
  databaseURL: "https://number-guessing-game-c18bc-default-rtdb.firebaseio.com",
  projectId: "number-guessing-game-c18bc",
  storageBucket: "number-guessing-game-c18bc.firebasestorage.app",
  messagingSenderId: "416588493658",
  appId: "1:416588493658:web:a95fdac2e6f75d06adb963",
  measurementId: "G-53HNXR22X2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


window.db = db;
window.ref = ref;
window.set = set;
window.get = get;
window.onValue = onValue;
window.update = update;
