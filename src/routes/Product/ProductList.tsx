import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../../utils/firebase/firebase.utils";
import ProductCard from "./ProductCard/ProductCard";
import type { Product } from "./product.types";
import "./ProductList.styles.scss";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = (await getAllProducts()) as Product[];
        if (alive) setProducts(data);
      } catch (e) {
        if (alive) setErrMsg("Failed to load products.");
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const matchesSearch = !s || name.includes(s);
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;

    // optimistic UI
    const prev = products;
    setProducts((p) => p.filter((x) => x.id !== id));

    try {
      await deleteProduct(id);
    } catch (e) {
      setErrMsg("Failed to delete product.");
      setProducts(prev);
    }
  };

  if (isLoading) return <p className="ds-muted">Loading products…</p>;
  if (errMsg) return <p className="ds-error" role="alert">{errMsg}</p>;

  return (
    <div className="ds-products">
      <div className="ds-products-toolbar">
        <div className="ds-field">
          <label className="ds-label" htmlFor="product-search">Search</label>
          <input
            id="product-search"
            className="ds-input"
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="product-category">Category</label>
          <select
            id="product-category"
            className="ds-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-products-toolbar-actions">
          <Link className="ds-btn ds-btn-sm" to="new-product">
            + New
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="ds-empty">
          <h3>No products found</h3>
          <p className="ds-muted">Try changing your search or category filter.</p>
          <Link className="ds-btn ds-btn-sm" to="new-product">Create a product</Link>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actions={
                <div className="ds-row ds-row-tight">
                  <Link className="ds-btn ds-btn-ghost ds-btn-sm" to={`edit/${product.id}`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="ds-btn ds-btn-danger ds-btn-sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
