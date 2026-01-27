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
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

// -------------------- Firebase init --------------------
export const doosetrainApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(doosetrainApp);
export const db = getFirestore(doosetrainApp);
export const storage = getStorage(doosetrainApp);

// -------------------- Orders --------------------
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderContact = {
  name: string | null;
  email: string | null;
  phone: string | null;
};

export type OrderItemSnapshot = {
  productId: string;
  qty: number;
  nameSnapshot: string;
  priceCentsSnapshot: number;
  imageSnapshot?: string;
};

export type ShippingAddress = {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postal_code: string;
  state: string;
};

export type Order = {
  id: string;
  uid: string;

  createdAt: Date | null;
  status: OrderStatus;
  currency: string;

  totalCents: number;
  subtotalCents: number;
  shippingCents: number;

  contact: OrderContact;

  items?: OrderItemSnapshot[];
  shippingAddress?: ShippingAddress;

  deliveryNotes?: string;
  inventoryApplied?: boolean;
  paymentIntentId?: string;
};

export const upsertOrderById = async (
  orderId: string,
  data: Omit<Order, "id" | "createdAt"> & { createdAt?: unknown }
): Promise<void> => {
  const ref = doc(db, "orders", orderId);
  await setDoc(
    ref,
    {
      ...data,
      // always set createdAt once, keep if already there
      createdAt: (data as any).createdAt ?? serverTimestamp(),
    },
    { merge: true }
  );
};

export type CreateOrderInput = Omit<Order, "id" | "createdAt">;

const ordersRef = collection(db, "orders");

const toDate = (v: unknown): Date | null => {
  if (v instanceof Timestamp) return v.toDate();
  return null;
};

const normalizeStatus = (v: unknown): OrderStatus => {
  const s = String(v ?? "pending").toLowerCase();
  if (s === "pending" || s === "paid" || s === "failed" || s === "refunded") return s;
  return "pending";
};

const mapOrder = (docSnap: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = docSnap.data() as Record<string, unknown>;
  const contactRaw = (data.contact ?? {}) as Record<string, unknown>;

  return {
    id: docSnap.id,
    uid: String(data.uid ?? ""),

    createdAt: toDate(data.createdAt),
    status: normalizeStatus(data.status),
    currency: String(data.currency ?? "usd"),

    totalCents: Number(data.totalCents ?? 0),
    subtotalCents: Number(data.subtotalCents ?? 0),
    shippingCents: Number(data.shippingCents ?? 0),

    contact: {
      name: (contactRaw.name as string) ?? null,
      email: (contactRaw.email as string) ?? null,
      phone: (contactRaw.phone as string) ?? null,
    },

    items: (data.items as OrderItemSnapshot[]) ?? [],
    shippingAddress: (data.shippingAddress as ShippingAddress) ?? undefined,

    deliveryNotes: (data.deliveryNotes as string) ?? "",
    inventoryApplied: Boolean(data.inventoryApplied ?? false),
    paymentIntentId: (data.paymentIntentId as string) ?? "",
  };
};

export const getRecentOrders = async (max = 8): Promise<Order[]> => {
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(mapOrder);
};

/**
 * Use this whenever you create an order from your app.
 * Guarantees createdAt is always present and consistent.
 */
export const createOrder = async (data: CreateOrderInput): Promise<{ id: string }> => {
  const docRef = await addDoc(ordersRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
};

// Optional helper: quick audit
export const getOrdersMissingCreatedAt = async (): Promise<string[]> => {
  const snap = await getDocs(collection(db, "orders"));
  return snap.docs.filter((d) => !d.data()?.createdAt).map((d) => d.id);
};

// -------------------- Auth helpers --------------------
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

export const updateUserName = async (displayName: string): Promise<void> => {
  if (!auth.currentUser) throw new Error("No user signed in");
  await updateProfile(auth.currentUser, { displayName });
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// -------------------- User doc --------------------
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

// -------------------- Messaging --------------------
// IMPORTANT: TTL should be calculated per message (not once at module load)
const getExpirationTime = () => Timestamp.fromMillis(Date.now() + 60 * 60 * 1000);

export const sendMessage = async (user: User, text: string): Promise<void> => {
  await addDoc(collection(db, "messages"), {
    uid: user.uid,
    displayName: user.displayName,
    text: text.trim(),
    timestamp: serverTimestamp(),
    ttl: getExpirationTime(),
  });
};

export const getMessages = (
  callback: (messages: Array<{ id: string } & DocumentData>) => void
) => {
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

// -------------------- Store (Products) --------------------
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

// Blog


export const blogPostsRef = collection(db, "blogPosts");

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const q = query(blogPostsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const getBlogPost = async (id: string): Promise<BlogPost> => {
  const ref = doc(db, "blogPosts", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Post not found");
  return { id: snap.id, ...(snap.data() as any) };
};

export const createBlogPost = async (data: BlogPostInput): Promise<{ id: string }> => {
  const docRef = await addDoc(blogPostsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id };
};

export const updateBlogPost = async (id: string, data: BlogPostInput): Promise<void> => {
  const ref = doc(db, "blogPosts", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const ref = doc(db, "blogPosts", id);
  await deleteDoc(ref);
};