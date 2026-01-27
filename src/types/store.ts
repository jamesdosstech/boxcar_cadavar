// src/types/store.ts

export type CurrencyCode = string; // you can narrow later

export type Product = {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  price: number;          // cents
  currency?: CurrencyCode;
  category?: string;
  quantity?: number;      // inventory (stock on hand)
  createdAt?: any;        // Firestore Timestamp (type later)
};

export type CartItem = {
  id: string;
  name: string;
  price: number;          // cents
  imageUrl?: string;
  quantity: number;       // qty in cart
  stock?: number;         // snapshot at time added (optional but useful)
  currency?: CurrencyCode;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string; // "US"
};

export type ShippingInfo = {
  name: string;
  email: string;
  phone?: string;
  address: ShippingAddress;
  deliveryNotes?: string;
};

export type CreatePaymentIntentPayload = {
  items: { productId: string; qty: number }[];
  uid: string | null;
  orderId: string;
  shipping: ShippingInfo;
};

export type PaymentIntentResponse = {
  clientSecret: string;
  summary: {
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
  };
};
