import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../constants";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  collection, // Added this import
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

// Initialize Firebase app
export const doosetrainApp =
  getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage(doosetrainApp);

// User authentication functions
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log("Error signing in:", error.message);
    throw error;
  }
}

export const signOutUser = async () => await signOut(auth);

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.log("Error sending reset email:", error.message);
    throw error;
  }
};

// Update Username
export const updateUserName = async (displayName) => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
      console.log("Username updated successfully");
    } else {
      throw new Error("No user signed in");
    }
  } catch (error) {
    console.error("Error updating username:", error.message);
    throw error;
  }
}

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// User document functions
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
      console.log("Error creating user document:", error.message);
    }
  }
  return userDocRef;
};

// Messaging functions
export const sendMessage = async (user, text) => {
  try {
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      displayName: user.displayName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
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
