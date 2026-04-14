import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";

export const ProductsContext = createContext(null);

export function useProductsContext() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsContext must be used within ProductsProvider");
  return ctx;
}

export const ProductsProvider = ({ children, collectionName = "products" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = collection(db, collectionName);
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const value = { products, loading, refreshProducts };
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
