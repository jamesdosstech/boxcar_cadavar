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
  type UpdateData
} from "firebase/firestore";

import { getStorage } from "firebase/storage";
import { BlogPost, BlogPostInput } from "../../features/dashboard/pages/Blog/blog.types";

// -------------------- Firebase init --------------------
export const doosetrainApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(doosetrainApp);
export const db = getFirestore(doosetrainApp);
export const storage = getStorage(doosetrainApp);

// -------------------- Orders --------------------
export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "needs_attention"
  | "oversold";;

type MinimalUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
};

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

  if (
    s === "pending" ||
    s === "paid" ||
    s === "failed" ||
    s === "refunded" ||
    s === "needs_attention" ||
    s === "oversold"
  ) {
    return s;
  }

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
): Promise<UserCredential> => {
  if (!email || !password) throw new Error("Missing email or password");
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
    const email = userAuth.email ?? null;

    const finalDisplayName =
      (additionalInformation.displayName as string | undefined) ??
      userAuth.displayName ??
      null;

    // Prefer serverTimestamp for consistency
    await setDoc(userDocRef, {
      displayName: finalDisplayName,
      email,
      createdAt: serverTimestamp(),
      ...additionalInformation,
    });
  }

  return userDocRef;
};

// -------------------- Messaging --------------------
// IMPORTANT: TTL should be calculated per message (not once at module load)
const getExpirationTime = () => Timestamp.fromMillis(Date.now() + 60 * 60 * 1000);

export const sendMessage = async (user: MinimalUser, text: string): Promise<void> => {
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

export type ArtworkStatus =
  | "available"
  | "sold"
  | "archive"
  | "coming_soon";

export type Artwork = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  quantity: number;

  isPublished: boolean;
  showInGallery: boolean;
  showInStore: boolean;
  featured: boolean;
  status: ArtworkStatus;
  collection: string;
  medium: string;
  dimensions: string;
  year: string;
  tags: string[];

  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ArtworkInput = Omit<Artwork, "id">;

const DEFAULT_ARTWORK_VALUES: Omit<Artwork, "id"> = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  category: "",
  quantity: 0,

  isPublished: true,
  showInGallery: false,
  showInStore: true,
  featured: false,
  status: "available",
  collection: "",
  medium: "",
  dimensions: "",
  year: "",
  tags: [],

  createdAt: undefined,
  updatedAt: undefined,
};

const normalizeArtworkStatus = (value: unknown): ArtworkStatus => {
  const status = String(value ?? "available").toLowerCase();

  if (
    status === "available" ||
    status === "sold" ||
    status === "archive" ||
    status === "coming_soon"
  ) {
    return status;
  }

  return "available";
};

const mapArtwork = (
  docSnap: QueryDocumentSnapshot<DocumentData> | Awaited<ReturnType<typeof getDoc>>
): Artwork => {
  const data = docSnap.data() as Record<string, unknown>;

  return {
    id: docSnap.id,
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    price: Number(data.price ?? 0),
    imageUrl: String(data.imageUrl ?? ""),
    category: String(data.category ?? ""),
    quantity: Number(data.quantity ?? 0),

    isPublished: Boolean(data.isPublished ?? true),
    showInGallery: Boolean(data.showInGallery ?? false),
    showInStore: Boolean(data.showInStore ?? true),
    featured: Boolean(data.featured ?? false),
    status: normalizeArtworkStatus(data.status),
    collection: String(data.collection ?? ""),
    medium: String(data.medium ?? ""),
    dimensions: String(data.dimensions ?? ""),
    year: String(data.year ?? ""),
    tags: Array.isArray(data.tags)
      ? data.tags.map((tag) => String(tag))
      : [],

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// -------------------- Store / Artwork --------------------
const productsRef = collection(db, "products");

export const getAllProducts = async (): Promise<Artwork[]> => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((d) => mapArtwork(d));
};

export const getStoreProducts = async (): Promise<Artwork[]> => {
  const products = await getAllProducts();
  return products.filter(
    (item) =>
      item.isPublished &&
      item.showInStore &&
      item.status !== "archive"
  );
};

export const canViewStoreProduct = (item: Artwork): boolean => {
  return (
    item.isPublished &&
    item.showInStore &&
    item.status !== "archive"
  );
};

export const getPurchasableProducts = async (): Promise<Artwork[]> => {
  const products = await getAllProducts();
  return products.filter(isPurchasable);
};

export const getProduct = async (id: string): Promise<Artwork> => {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Product not found");
  }

  return mapArtwork(snapshot);
};

export const getHomepageArtwork = async (): Promise<Artwork | null> => {
  const galleryItems = sortGalleryProducts(await getGalleryProducts());

  const featured = galleryItems.find((item) => item.featured);
  if (featured) return featured;

  return galleryItems[0] ?? null;
};

export const getHomepageStoreItem = async (): Promise<Artwork | null> => {
  const storeItems = await getStoreProducts();
  return storeItems[0] ?? null;
};

export const getHomepageGalleryPreview = async (count = 3): Promise<Artwork[]> => {
  const galleryItems = sortGalleryProducts(await getGalleryProducts());
  return galleryItems.slice(0, count);
};

export const createProduct = async (
  data: Partial<ArtworkInput>
): Promise<{ id: string }> => {
  const payload = {
    ...DEFAULT_ARTWORK_VALUES,
    ...data,
    status: normalizeArtworkStatus(data.status),
    tags: Array.isArray(data.tags) ? data.tags.map((tag) => String(tag)) : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(productsRef, payload);
  return { id: docRef.id };
};

export const updateProduct = async (
  id: string,
  data: Partial<ArtworkInput>
): Promise<void> => {
  const docRef = doc(db, "products", id);

  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if ("status" in data) {
    payload.status = normalizeArtworkStatus(data.status);
  }

  if ("tags" in data) {
    payload.tags = Array.isArray(data.tags)
      ? data.tags.map((tag) => String(tag))
      : [];
  }

  await updateDoc(docRef, payload as UpdateData<DocumentData>);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};

export const validateCartItems = async (cartItems: Artwork[]) => {
  const products = await getAllProducts();
  const productMap = new Map(products.map((item) => [item.id, item]));

  const validItems: Artwork[] = [];
  const invalidItems: Artwork[] = [];

  for (const cartItem of cartItems) {
    const latest = productMap.get(cartItem.id);

    if (!latest || !isPurchasable(latest)) {
      invalidItems.push(cartItem);
      continue;
    }

    const requestedQty = Number(cartItem.quantity ?? 0);
    const availableQty = Number(latest.quantity ?? 0);

    if (requestedQty > availableQty) {
      invalidItems.push(cartItem);
      continue;
    }

    validItems.push({
      ...cartItem,
      ...latest,
    });
  }

  return { validItems, invalidItems };
};

export const isStoreVisible = (item: Artwork): boolean => {
  return (
    item.isPublished &&
    item.showInStore &&
    item.status !== "archive" &&
    item.status !== "sold"
  );
};

export const isPurchasable = (item: Artwork): boolean => {
  return (
    item.isPublished &&
    item.showInStore &&
    item.status === "available" &&
    item.quantity > 0
  );
};

export const isGalleryVisible = (item: Artwork): boolean => {
  return item.isPublished && item.showInGallery && item.status !== "archive";
};

export const canViewArtwork = (item: Artwork): boolean => {
  return (
    item.isPublished &&
    item.status !== "archive" &&
    (item.showInGallery || item.showInStore)
  );
};

export const getGalleryProducts = async (): Promise<Artwork[]> => {
  const products = await getAllProducts();
  return products.filter(isGalleryVisible);
};

export const getFeaturedGalleryProducts = async (): Promise<Artwork[]> => {
  const products = await getGalleryProducts();
  return products.filter((item) => item.featured);
};

const getTime = (value?: unknown): number => {
  if (!value) return 0;

  if (typeof value === "number") return value;

  if (value instanceof Timestamp) return value.toMillis();

  if (typeof value === "object" && "toMillis" in value) {
    return (value as any).toMillis();
  }

  return 0;
};

export const sortGalleryProducts = (items: Artwork[]): Artwork[] => {
  return [...items].sort((a, b) => {
    const featuredCompare = Number(b.featured) - Number(a.featured);
    if (featuredCompare !== 0) return featuredCompare;

    const yearA = Number(a.year || 0);
    const yearB = Number(b.year || 0);
    if (yearA !== yearB) return yearB - yearA;

    const aMs = getTime(a.createdAt);
    const bMs = getTime(b.createdAt);

    return bMs - aMs;
  });
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

export const subscribeToOrderById = (
  orderId: string,
  callback: (order: Order | null) => void
) => {
  const ref = doc(db, "orders", orderId);

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    const data = snap.data() as Record<string, unknown>;
    const contactRaw = (data.contact ?? {}) as Record<string, unknown>;

    callback({
      id: snap.id,
      uid: String(data.uid ?? ""),

      createdAt: toDate(data.createdAt),
      status: String(data.status ?? "pending") as OrderStatus,
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
    });
  });
};