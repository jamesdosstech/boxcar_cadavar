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
  showInGallery?: boolean;
  isPublished?: boolean;
  showInStore?: boolean;
  featured?: boolean;
  status?: "available" | "sold" | "archive" | "coming_soon";
  collection?: string;
  medium?: string;
  dimensions?: string;
  year?: string;
  tags?: string[];
};

export type ProductInput = Omit<Product, "id">;
