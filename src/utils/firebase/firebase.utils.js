import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsxtaefK62L21AezkX6S4sDCRj90lU7DQ",
  authDomain: "doosetrain-52f13.firebaseapp.com",
  projectId: "doosetrain-52f13",
  storageBucket: "doosetrain-52f13.appspot.com",
  messagingSenderId: "279844528484",
  appId: "1:279844528484:web:4d55f1956b7de676c49a71",
  measurementId: "G-DSHDM3JS4Q",
};

// eslint-disable-next-line
const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

export const auth = getAuth();

export const db = getFirestore();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error", error.message);
    }
  }
  return userDocRef;
};

export const updateUserName = async (newName) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: newName,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const sendMessage = async (user, text) => {
  try {
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      displayName: user.displayName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
};

export const getMessages = (callback) => {
  return onSnapshot(
    query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(10)),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    }
  );
};
