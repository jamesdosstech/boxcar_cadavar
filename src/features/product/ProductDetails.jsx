import React, { useEffect, useMemo, useState } from "react";
import "./ProductDetails.styles.scss";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getProduct,
  canViewStoreProduct,
  isPurchasable,
} from "../../utils/firebase/firebase.utils";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";

const money = (cents, currency = "usd") => {
  const cur = (currency ?? "usd").toUpperCase();
  const amount = (Number(cents ?? 0) / 100).toFixed(2);
  return `${amount} ${cur}`;
};

export default function ProductDetails() {
  const { addItem, cartItems } = useCart();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [imgOk, setImgOk] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const prod = await getProduct(productId);
        if (!mounted) return;

        if (!canViewStoreProduct(prod)) {
          setError("This item is not available in the shop.");
          setProduct(null);
          return;
        }

        setProduct(prod);
        setImgOk(true);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load product.");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const cartItem = useMemo(
    () => cartItems.find((item) => item.id === product?.id),
    [cartItems, product?.id]
  );

  if (loading) {
    return (
      <div className="pd">
        <div className="pd-state">Loading product…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd">
        <div className="pd-state error">{error}</div>
        <button className="pd-btn ghost" onClick={() => navigate("/shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd">
        <div className="pd-state">Product not found.</div>
        <button className="pd-btn ghost" onClick={() => navigate("/shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  const stock = Number(product.quantity ?? 0);
  const inCart = Number(cartItem?.quantity ?? 0);

  const isSold = product.status === "sold";
  const isComingSoon = product.status === "coming_soon";
  const isOutOfStock = stock <= 0 || inCart >= stock;

  const canBuyBase = isPurchasable(product);
  const canBuy = canBuyBase && !isOutOfStock && !isSold && !isComingSoon;

  const title = product.name || "Untitled product";
  const desc = (product.description ?? "").trim();

  let stockLabel = `${Math.max(stock - inCart, 0)} left`;
  if (isSold) stockLabel = "Sold";
  else if (isComingSoon) stockLabel = "Coming Soon";
  else if (isOutOfStock) stockLabel = "Out of stock";

  let buttonLabel = "Add to Cart";
  if (isSold) buttonLabel = "Sold";
  else if (isComingSoon) buttonLabel = "Coming Soon";
  else if (isOutOfStock) buttonLabel = "Out of Stock";

  const handleAdd = () => {
    if (!canBuy) {
      setToast({
        type: "error",
        message: `${title} is not currently available for purchase`,
      });

      setTimeout(() => setToast(null), 1800);
      return;
    }

    addItem({ ...product, stock });

    setToast({
      type: "success",
      message: `Added ${title} to cart`,
    });

    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="pd">
      <button className="pd-back" onClick={() => navigate("/shop")}>
        ← Back to shop
      </button>

      <div className="pd-grid">
        <div className="pd-media">
          {product.imageUrl && imgOk ? (
            <img
              src={product.imageUrl}
              alt={title}
              onError={() => setImgOk(false)}
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="pd-placeholder" aria-hidden="true">
              No image
            </div>
          )}
        </div>

        <div className="pd-info">
          <div className="pd-badge-row">
            {product.category ? <span className="pd-pill">{product.category}</span> : null}
            <span
              className={`pd-stock ${
                !canBuy ? "is-out" : "is-in"
              }`}
            >
              {stockLabel}
            </span>
          </div>

          <h1 className="pd-title">{title}</h1>
          <div className="pd-price">{money(product.price, product.currency)}</div>

          {desc ? <p className="pd-desc">{desc}</p> : null}

          {product.collection ? <div className="pd-meta">Collection: {product.collection}</div> : null}
          {product.medium ? <div className="pd-meta">Medium: {product.medium}</div> : null}
          {product.dimensions ? <div className="pd-meta">Dimensions: {product.dimensions}</div> : null}
          {product.year ? <div className="pd-meta">Year: {product.year}</div> : null}

          {inCart > 0 ? (
            <div className="pd-hint">
              In your cart: <strong>{inCart}</strong>
            </div>
          ) : null}

          <div className="pd-actions">
            <button
              className="pd-btn primary"
              disabled={!canBuy}
              aria-disabled={!canBuy}
              onClick={handleAdd}
            >
              {buttonLabel}
            </button>

            <Link className="pd-btn ghost" to="/cart">
              View Cart
            </Link>

            <Link className="pd-btn ghost" to="/checkout">
              Checkout
            </Link>
          </div>

          <div className="pd-note">Prices are confirmed at checkout.</div>

          {toast ? <div className="pd-toast">{toast.message}</div> : null}
        </div>
      </div>
    </div>
  );
}