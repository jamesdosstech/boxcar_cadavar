import { useEffect, useId, useMemo, useState } from "react";
import styles from "./ProductForm.module.scss";
import type { Product, ProductInput } from "../product.types";

type Props = {
  initialData?: Partial<Product>;
  mode?: "create" | "edit";
  onSave: (data: ProductInput) => Promise<void> | void;
};

const EMPTY_INITIAL_DATA: Partial<Product> = {};

const DEFAULT_CATEGORIES = ["shirts", "canvas", "prints", "stickers"] as const;
type Category = (typeof DEFAULT_CATEGORIES)[number] | "";

export default function ProductForm({
  initialData = EMPTY_INITIAL_DATA,
  mode = "create",
  onSave,
}: Props) {
  const nameId = useId();
  const descId = useId();
  const priceId = useId();
  const currencyId = useId();
  const imageId = useId();
  const categoryId = useId();
  const qtyId = useId();

  const [name, setName] = useState(initialData.name ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [price, setPrice] = useState(String(initialData.price ?? ""));
  const [currency, setCurrency] = useState(initialData.currency ?? "usd");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl ?? "");
  const [category, setCategory] = useState<Category>(
    (initialData.category as Category) ?? ""
  );
  const [quantity, setQuantity] = useState(String(initialData.quantity ?? ""));
  const [active, setActive] = useState<boolean>(initialData.active ?? true);
  const [showInGallery, setShowInGallery] = useState(
    initialData.showInGallery ?? false
  );

  const [showInStore, setShowInStore] = useState(
    initialData.showInStore ?? true
  );

  const [isPublished, setIsPublished] = useState(
    initialData.isPublished ?? true
  );

  const [featured, setFeatured] = useState(
    initialData.featured ?? false
  );

  const [status, setStatus] = useState<
    "available" | "sold" | "archive" | "coming_soon"
  >(initialData.status ?? "available");
  

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // If initialData changes (edit loads async), update form once
  useEffect(() => {
    if(mode !== 'edit') return;
    setName(initialData.name ?? "");
    setDescription(initialData.description ?? "");
    setPrice(String(initialData.price ?? ""));
    setCurrency(initialData.currency ?? "usd");
    setImageUrl(initialData.imageUrl ?? "");
    setCategory(((initialData.category as Category) ?? "") as Category);
    setQuantity(String(initialData.quantity ?? ""));
    setActive(initialData.active ?? true);
    setShowInGallery(initialData.showInGallery ?? false);
    setShowInStore(initialData.showInStore ?? true);
    setIsPublished(initialData.isPublished ?? true);
    setFeatured(initialData.featured ?? false);
    setStatus(initialData.status ?? "available");
  }, [initialData, mode]);

  const categories = useMemo(() => DEFAULT_CATEGORIES, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) return setError("Name is required.");

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (price !== "" && Number.isNaN(parsedPrice)) {
      return setError("Price must be a valid number.");
    }

    if (quantity !== "" && Number.isNaN(parsedQuantity)) {
      return setError("Quantity must be a valid number.");
    }

    if (parsedPrice < 0) return setError("Price must be 0 or greater.");
    if (parsedQuantity < 0) return setError("Quantity must be 0 or greater.");
    setIsSaving(true);
    try {
      await onSave({
        name: trimmedName,
        description: description.trim(),
        price: parsedPrice || 0,
        currency: currency.trim() || "usd",
        imageUrl: imageUrl.trim(),
        category: category || undefined,
        quantity: parsedQuantity || 0,
        active,
        showInGallery,
        // 🔥 NEW
        isPublished,
        showInStore,
        featured,
        status,
      });
    } catch (err) {
      setError("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Product form">
      <header className={styles.header}>
        <h3 className={styles.title}>
          {mode === "edit" ? "Edit product" : "Create product"}
        </h3>
        <p className={styles.subtitle}>
          Keep names consistent and use cents for prices (e.g., 1999 = $19.99).
        </p>
      </header>

      {error && (
        <p className="ds-error" role="alert">
          {error}
        </p>
      )}

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={nameId}>Name</label>
          <input
            id={nameId}
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className={styles.fieldFull}>
          <label className={styles.label} htmlFor={descId}>Description</label>
          <textarea
            id={descId}
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={priceId}>Price (cents)</label>
          <input
            id={priceId}
            className={styles.input}
            type="number"
            inputMode="numeric"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={currencyId}>Currency</label>
          <input
            id={currencyId}
            className={styles.input}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="usd"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={qtyId}>Quantity</label>
          <input
            id={qtyId}
            className={styles.input}
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={categoryId}>Category</label>
          <select
            id={categoryId}
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldFull}>
          <label className={styles.label} htmlFor={imageId}>Image URL</label>
          <input
            id={imageId}
            className={styles.input}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>

        <div className={styles.fieldFull}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active (visible in shop)
          </label>
        </div>
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Published
        </label>
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showInStore}
            onChange={(e) => setShowInStore(e.target.checked)}
          />
          Show in Store
        </label>
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showInGallery}
            onChange={(e) => setShowInGallery(e.target.checked)}
          />
          Show in Gallery
        </label>
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.select}
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as "available" | "sold" | "archive" | "coming_soon"
            )
          }
        >
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="coming_soon">Coming Soon</option>
          <option value="archive">Archive</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button className="ds-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : mode === "edit" ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
