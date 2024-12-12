import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';  
import { getApp, initializeApp } from 'firebase/app';

export const environment={ 
    firebaseConfig : {
    apiKey: "AIzaSyDJr6O5jBURBfIX10VNl4hsK2qQV4gaE4s",
    authDomain: "event-management-portal-49cff.firebaseapp.com",
    projectId: "event-management-portal-49cff",
    storageBucket: "event-management-portal-49cff.firebasestorage.app",
    messagingSenderId: "1012170355515",
    appId: "1:1012170355515:web:853607a4e8089bf2fb7d1e"
  }
}

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);