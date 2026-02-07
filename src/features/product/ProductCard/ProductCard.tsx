import type { ReactNode } from "react";
import type { Product } from "../product.types";
import "./ProductCard.scss";

type Props = {
  product: Product;
  actions?: ReactNode;
};

export default function ProductCard({ product, actions }: Props) {
  const {
    name,
    description,
    imageUrl,
    price,
    currency,
    category,
    quantity,
  } = product;

  const safeName = name || "Untitled product";
  const safeDesc = (description ?? "").trim();
  const hasDesc = safeDesc.length > 0;

  const cents = typeof price === "number" ? price : Number(price ?? 0);
  const cur = (currency ?? "usd").toUpperCase();
  const formattedPrice = (cents / 100).toFixed(2);

  return (
    <article className="ds-product-card" aria-label={`Product: ${safeName}`}>
      <div className="ds-product-card-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={safeName}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="ds-product-card-placeholder" aria-hidden="true">
            No image
          </div>
        )}
      </div>

      <div className="ds-product-card-body">
        <h3 className="ds-product-card-title">{safeName}</h3>

        {hasDesc && (
          <p className="ds-product-card-desc">
            {safeDesc.length > 110 ? `${safeDesc.slice(0, 110)}…` : safeDesc}
          </p>
        )}

        <dl className="ds-product-card-meta">
          <div>
            <dt>Price</dt>
            <dd>
              {formattedPrice} {cur}
            </dd>
          </div>

          {category && (
            <div>
              <dt>Category</dt>
              <dd>{category}</dd>
            </div>
          )}

          <div>
            <dt>Quantity</dt>
            <dd>{quantity ?? "N/A"}</dd>
          </div>
        </dl>

        {actions && <div className="ds-product-card-actions">{actions}</div>}
      </div>
    </article>
  );
}
