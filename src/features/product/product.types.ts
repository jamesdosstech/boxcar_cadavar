export type Product = {
  id: string;
  name: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
  // add fields as you discover them
  currency: string;   // e.g. "usd"
  quantity: number;   // inventory or quantity field your UI expects
  active: boolean;    // enabled/disabled
};

export type ProductInput = Omit<Product, "id">;
