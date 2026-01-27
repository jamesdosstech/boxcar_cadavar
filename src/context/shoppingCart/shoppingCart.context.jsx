import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";

const CartContext = createContext(null);

const CART_KEY = "doosetrain_cart_v1";

const initialState = { cartItems: [] };

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const cartReducer = (state, action) => {
  console.log("CartProvider mounted");
  switch (action.type) {
    case "ADD_ITEM": {
      const p = action.payload;
      const stock = toNumber(p.quantity ?? p.stock, 0);
      const existing = state.cartItems.find((i) => i.id === p.id);

      if (existing) {
        if (existing.quantity >= existing.stock) return state;
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      if (stock <= 0) return state;

      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            id: p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            price: toNumber(p.price, 0),
            currency: p.currency || "usd",
            category: p.category || "",
            description: p.description || "",
            stock,
            quantity: 1,
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return { ...state, cartItems: state.cartItems.filter((i) => i.id !== action.payload) };

    case "CLEAR_CART":
      return initialState;

    case "DECREMENT_ITEM": {
      const id = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return state;

      if (item.quantity <= 1) {
        return { ...state, cartItems: state.cartItems.filter((i) => i.id !== id) };
      }

      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }

    case "SET_QTY": {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return state;

      const nextQty = clamp(toNumber(qty, 1), 0, item.stock);

      if (nextQty === 0) {
        return { ...state, cartItems: state.cartItems.filter((i) => i.id !== id) };
      }

      return {
        ...state,
        cartItems: state.cartItems.map((i) => (i.id === id ? { ...i, quantity: nextQty } : i)),
      };
    }

    default:
      return state;
  }
};

// IMPORTANT:
// Cart is initialized via lazy useReducer init()
// Do NOT add separate hydrate effects (StrictMode-safe)


const init = () => {
  // Vite is client-side, but keep this safe anyway
  if (typeof window === "undefined") return initialState;

  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : initialState;
  } catch {
    return initialState;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, init);
  const instanceId = useRef(Math.random().toString(16).slice(2)).current;
useEffect(() => {
  console.log("CartProvider mounted:", instanceId);
}, [instanceId]);
  // Persist exactly once per state change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const addItem = (product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const decrementItem = (id) => dispatch({ type: "DECREMENT_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const setItemQty = (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } });

  const subtotalCents = useMemo(
    () =>
      state.cartItems.reduce(
        (sum, i) => sum + toNumber(i.price, 0) * toNumber(i.quantity, 0),
        0
      ),
    [state.cartItems]
  );

  const itemCount = useMemo(
    () => state.cartItems.reduce((sum, i) => sum + toNumber(i.quantity, 0), 0),
    [state.cartItems]
  );

  const value = {
    cartItems: state.cartItems,
    addItem,
    removeItem,
    decrementItem,
    setItemQty,
    clearCart,
    subtotalCents,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
