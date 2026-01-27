export type Product = {
  id: string;
  name: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
  // add fields as you discover them
};

export type ProductInput = Omit<Product, "id">;
