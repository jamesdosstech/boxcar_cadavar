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
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
  type UserCredential,
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
  collection,
  Timestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

// Initialize Firebase app
export const doosetrainApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(doosetrainApp);
export const db = getFirestore(doosetrainApp);
export const storage = getStorage(doosetrainApp);

// ---------- Auth helpers ----------
export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential | void> => {
  if (!email || !password) return;
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => signOut(auth);

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const reauthenticateUserWithPassword = async (
  user: User,
  currentPassword: string
) => {
  const email = user.email;
  if (!email) throw new Error("No email found for current user.");

  const credential = EmailAuthProvider.credential(email, currentPassword);
  return reauthenticateWithCredential(user, credential);
};

// Update Username
export const updateUserName = async (displayName: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("No user signed in");
  await updateProfile(auth.currentUser, { displayName });
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// ---------- User doc ----------
export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: Record<string, unknown> = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    await setDoc(userDocRef, {
      displayName,
      email,
      createdAt,
      ...additionalInformation,
    });
  }

  return userDocRef;
};

// ---------- Messaging ----------
const expirationTime = Timestamp.fromMillis(Date.now() + 60 * 60 * 1000);

export const sendMessage = async (user: User, text: string): Promise<void> => {
  await addDoc(collection(db, "messages"), {
    uid: user.uid,
    displayName: user.displayName,
    text: text.trim(),
    timestamp: serverTimestamp(),
    ttl: expirationTime,
  });
};

export const getMessages = (callback: (messages: Array<{ id: string } & DocumentData>) => void) => {
  return onSnapshot(
    query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(10)),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(messages);
    }
  );
};

// ---------- Store ----------
const productsRef = collection(db, "products");

export const getAllProducts = async (): Promise<Array<{ id: string } & DocumentData>> => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProduct = async (id: string): Promise<{ id: string } & DocumentData> => {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) throw new Error("Product not found");
  return { id: snapshot.id, ...snapshot.data() };
};

export const createProduct = async (data: Record<string, unknown>): Promise<{ id: string }> => {
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
};

export const updateProduct = async (id: string, data: Record<string, unknown>): Promise<void> => {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};
