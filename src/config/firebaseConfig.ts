import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCNCg9l6r6cEt-yDy40cL_sVknAtXg29X4",
    authDomain: "brancomotos1-903ee.firebaseapp.com",
    projectId: "brancomotos1-903ee",
    storageBucket: "brancomotos1-903ee.firebasestorage.app",
    messagingSenderId: "589299648092",
    appId: "1:589299648092:web:a0a100cbde6009153f0899",
    measurementId: "G-9HN3EKKECK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

let analytics;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
}).catch(console.error);

export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
