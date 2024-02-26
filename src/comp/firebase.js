import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { ref, remove } from 'firebase/database';
// import { db } from './firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDyJH1NzttOpkoObcvKmsZfJk7AO2JB2fE",
  authDomain: "campushub-94be5.firebaseapp.com",
  databaseURL: "https://campushub-94be5-default-rtdb.firebaseio.com",
  projectId: "campushub-94be5",
  storageBucket: "campushub-94be5.appspot.com",
  messagingSenderId: "594066045684",
  appId: "1:594066045684:web:50f7273fb6c1ea211d7ca1",
  measurementId: "G-BWJ2SR5L69"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const deleteTransaction = (transactionId) => {
  const transactionRef = ref(db, `transactions/${transactionId}`);
  remove(transactionRef)
    .then(() => {
      console.log('Transaction deleted successfully.');
    })
    .catch((error) => {
      console.error('Error deleting transaction:', error);
    });
};


export { db, app, auth, deleteTransaction }