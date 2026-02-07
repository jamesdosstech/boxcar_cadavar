import { useEffect, useId, useMemo, useState } from "react";
import styles from "./ProductForm.module.scss";
import type { Product, ProductInput } from "../product.types";

type Props = {
  initialData?: Partial<Product>;
  mode?: "create" | "edit";
  onSave: (data: ProductInput) => Promise<void> | void;
};

const DEFAULT_CATEGORIES = ["shirts", "canvas", "prints", "stickers"] as const;
type Category = (typeof DEFAULT_CATEGORIES)[number] | "";

export default function ProductForm({
  initialData = {},
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
  const [price, setPrice] = useState<number>(Number(initialData.price ?? 0));
  const [currency, setCurrency] = useState(initialData.currency ?? "usd");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl ?? "");
  const [category, setCategory] = useState<Category>(
    (initialData.category as Category) ?? ""
  );
  const [quantity, setQuantity] = useState<number>(Number(initialData.quantity ?? 0));
  const [active, setActive] = useState<boolean>(initialData.active ?? true);

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // If initialData changes (edit loads async), update form once
  useEffect(() => {
    setName(initialData.name ?? "");
    setDescription(initialData.description ?? "");
    setPrice(Number(initialData.price ?? 0));
    setCurrency(initialData.currency ?? "usd");
    setImageUrl(initialData.imageUrl ?? "");
    setCategory(((initialData.category as Category) ?? "") as Category);
    setQuantity(Number(initialData.quantity ?? 0));
    setActive(initialData.active ?? true);
  }, [initialData]);

  const categories = useMemo(() => DEFAULT_CATEGORIES, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) return setError("Name is required.");

    if (price < 0) return setError("Price must be 0 or greater.");
    if (quantity < 0) return setError("Quantity must be 0 or greater.");

    setIsSaving(true);
    try {
      await onSave({
        name: trimmedName,
        description: description.trim(),
        price: Number(price),
        currency: currency.trim() || "usd",
        imageUrl: imageUrl.trim(),
        category: category || undefined,
        quantity: Number(quantity),
        active,
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
            onChange={(e) => setPrice(Number(e.target.value))}
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
            onChange={(e) => setQuantity(Number(e.target.value))}
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

      <div className={styles.actions}>
        <button className="ds-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : mode === "edit" ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
