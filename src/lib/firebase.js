import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDh_ZSFDETA9V8XjY0pWUy9FabS1YstU5g",
    authDomain: "blabla-7cd2c.firebaseapp.com",
    projectId: "blabla-7cd2c",
    storageBucket: "blabla-7cd2c.appspot.com",
    messagingSenderId: "100350327975",
    appId: "1:100350327975:web:85dafaeea9f8673c4d6f82"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)