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
import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
 } from "firebase/storage";


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
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        sessionStorage.setItem('user_id', user.uid);
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
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        sessionStorage.setItem('user_id', user.uid);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (firstName, lastname, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        sessionStorage.setItem('user_id', user.uid);
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

const getIncomes = async () => {
    try {
        const uid = sessionStorage.getItem("user_id");
        const q = query(collection(db, "income"), where("uid", "==", uid));
        return getDocs(q);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const addIncome = async (title, amount, date) => {
    try {
        const uid = sessionStorage.getItem("user_id");
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

const deleteExpenses = async (uid) => {
    try {
        await deleteDoc(doc(db, "expenses", uid));
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const getExpenses = async () => {
    try {
        const uid = sessionStorage.getItem("user_id");
        const q = query(collection(db, "expenses"), where("uid", "==", uid));
        return getDocs(q);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const addExpenses = async (title, amount, date, file, ext) => {
    try {
        const uid = sessionStorage.getItem("user_id");
        const res = await addDoc(collection(db, "expenses"), {
            uid: uid,
            title: title,
            amount: amount,
            date: Timestamp.fromDate(date),
            fileExtension: ext
        });
        const storageRef = ref(storage, `receipts/${res.id}.${ext}`);
        // const fileName = ref(storageRef, res.id);
        await uploadBytes(storageRef, file);
        return res;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const getExpensesReceiptURL = async (uid) => {
    try {
        return await getDownloadURL(ref(storage, `receipts/${uid}`));
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const getDashboardData = async () => {
    const uid = sessionStorage.getItem("user_id");
    const qExpenses = query(collection(db, "expenses"), where("uid", "==", uid));
    const expenses = await getDocs(qExpenses);

    const qIncomes = query(collection(db, "income"), where("uid", "==", uid));
    const incomes = await getDocs(qIncomes);

    let expensesTotal = 0;
    expenses.docs.forEach(expense => {
        expensesTotal += parseInt(expense.data().amount);
    });

    let incomesTotal = 0;
    incomes.docs.forEach(income => {
        incomesTotal += parseInt(income.data().amount);
    });

    let remainder = incomesTotal - expensesTotal;

    return {
        expenses: expensesTotal,
        incomes: incomesTotal,
        total: remainder
    }
}

const logout = () => {
    sessionStorage.clear();
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
  deleteExpenses,
  getExpenses,
  addExpenses,
  getExpensesReceiptURL,
  getDashboardData,
  logout,
};