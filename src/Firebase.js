// Import Modules
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    deleteDoc, 
    doc,
    Timestamp
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDXv-lsd9UUeLHVifUXCUwOeow_ErePHVU",
    authDomain: "wddm-122-assignment-2.firebaseapp.com",
    projectId: "wddm-122-assignment-2",
    storageBucket: "wddm-122-assignment-2.appspot.com",
    messagingSenderId: "390560871690",
    appId: "1:390560871690:web:68577d7aae47019b9db6f3",
    measurementId: "G-GRWPGM7GV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "GOOGLE",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (firstName, lastname, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: `${firstName} ${lastname}`,
            authProvider: "LOCAL",
            email,
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const deleteIncome = async (uid) => {
    try {
        await deleteDoc(doc(db, "income", uid));
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const getIncomes = async (uid) => {
    try {
        // const q = query(collection(db, "users"), where("uid", "==", uid));
        // const doc = await getDocs(q);
        // const data = doc.docs[0].data();
        // if (user) {
            // return await getDocs(collection(db, "income"), where("uid", "==", uid));
        // } else {
        //     alert("Conseptual Error: User not authorized to access page.");
        // }
        const auth = getAuth();
        return await onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user)
                return await getDocs(collection(db, "income"), where("uid", "==", user.uid));
            }
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const addIncome = async (uid, title, amount, date) => {
    try {
        return await addDoc(collection(db, "income"), {
            uid: uid,
            title: title,
            amount: amount,
            date: Timestamp.fromDate(date)
          });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const logout = () => {
    signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  deleteIncome,
  getIncomes,
  addIncome,
  logout,
};