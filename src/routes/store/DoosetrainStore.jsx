import React, { useEffect, useMemo, useState } from "react";
import "./DoosetrainStore.styles.scss";
import { getAllProducts } from "../../utils/firebase/firebase.utils";
import ProductCard from "../Product/ProductCard/ProductCard";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { NavLink, Link } from "react-router-dom";

const formatMoney = (cents, currency = "usd") => {
  const cur = (currency ?? "usd").toUpperCase();
  const amount = Number(cents ?? 0) / 100;
  return `${amount.toFixed(2)} ${cur}`;
};

const DoosetrainStore = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("newest"); // newest | priceAsc | priceDesc | nameAsc
  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addItem, cartItems } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getAllProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load products.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      (products || [])
        .map((p) => (p?.category || "").trim())
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();

    let list = (products || []).filter((p) => {
      const name = (p?.name || "").toLowerCase();
      const matchesSearch = s ? name.includes(s) : true;
      const matchesCategory = categoryFilter ? p?.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });

    list = list.slice().sort((a, b) => {
      if (sort === "priceAsc") return Number(a?.price ?? 0) - Number(b?.price ?? 0);
      if (sort === "priceDesc") return Number(b?.price ?? 0) - Number(a?.price ?? 0);
      if (sort === "nameAsc") return (a?.name || "").localeCompare(b?.name || "");
      // newest (best effort)
      const aMs = a?.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bMs = b?.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bMs - aMs;
    });

    return list;
  }, [products, search, categoryFilter, sort]);

  const handleAddToCart = (product) => {
    addItem(product);
    setToast({ type: "success", message: `Added ${product?.name || "item"} to cart` });
    window.clearTimeout((handleAddToCart)._t);
    (handleAddToCart)._t = window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="shop">
      <header className="shop-head">
        <div>
          <h1 className="shop-title">Shop</h1>
          <p className="shop-subtitle">Original paintings and drops.</p>
        </div>

        <Link className="shop-cart-link" to="/cart">
          Cart
          {cartItems?.length ? <span className="shop-cart-badge">{cartItems.length}</span> : null}
        </Link>
      </header>

      <div className="shop-filters">
        <div className="shop-search">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shop-selects">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="nameAsc">Name: A → Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="shop-state">Loading products…</div>
      ) : error ? (
        <div className="shop-state error">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="shop-state">No products match your filters.</div>
      ) : (
        <div className="shop-grid">
          {filteredProducts.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id);
            const stock = Number(product.quantity ?? 0);
            const quantityInCart = cartItem ? Number(cartItem.quantity ?? 0) : 0;
            const isOutOfStock = stock > 0 ? quantityInCart >= stock : stock === 0;

            return (
              <ProductCard
                key={product.id}
                product={product}
                actions={
                  <>
                    <button
                      className="shop-btn primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      aria-disabled={isOutOfStock}
                      title={isOutOfStock ? "Out of stock" : "Add to cart"}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <NavLink className="shop-btn ghost" to={`/product/${product.id}`}>
                      Details
                    </NavLink>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      {toast ? <div className="shop-toast">{toast.message}</div> : null}
    </div>
  );
};

export default DoosetrainStore;
