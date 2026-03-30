import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  canViewArtwork,
  isPurchasable,
} from "../../utils/firebase/firebase.utils";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import "./ArtworkDetails.styles.scss";

const money = (cents, currency = "usd") => {
  const cur = (currency ?? "usd").toUpperCase();
  const amount = (Number(cents ?? 0) / 100).toFixed(2);
  return `${amount} ${cur}`;
};

export default function ArtworkDetails() {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const { addItem, cartItems } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [imgOk, setImgOk] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchArtwork = async () => {
      setLoading(true);
      setError("");

      try {
        const item = await getProduct(artworkId);
        if (!mounted) return;

        if (!canViewArtwork(item)) {
          setError("This artwork is not currently available.");
          setArtwork(null);
          return;
        }

        setArtwork(item);
        setImgOk(true);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load artwork.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchArtwork();

    return () => {
      mounted = false;
    };
  }, [artworkId]);

  const cartItem = useMemo(
    () => cartItems.find((item) => item.id === artwork?.id),
    [cartItems, artwork?.id]
  );

  if (loading) {
    return (
      <div className="artwork-details">
        <div className="artwork-state">Loading artwork…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artwork-details">
        <div className="artwork-state error">{error}</div>
        <button className="artwork-btn ghost" onClick={() => navigate("/gallery")}>
          Back to gallery
        </button>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="artwork-details">
        <div className="artwork-state">Artwork not found.</div>
        <button className="artwork-btn ghost" onClick={() => navigate("/gallery")}>
          Back to gallery
        </button>
      </div>
    );
  }

  const stock = Number(artwork.quantity ?? 0);
  const inCart = Number(cartItem?.quantity ?? 0);

  const isSold = artwork.status === "sold";
  const isComingSoon = artwork.status === "coming_soon";
  const isAvailableToBuy = isPurchasable(artwork) && stock > 0 && inCart < stock;

  let statusLabel = "Available";
  if (isSold) statusLabel = "Sold";
  else if (isComingSoon) statusLabel = "Coming Soon";
  else if (!isAvailableToBuy) statusLabel = "Unavailable";

  const handleAddToCart = () => {
    if (!isAvailableToBuy) {
      setToast(`${artwork.name || "This artwork"} is not currently available for purchase.`);
      setTimeout(() => setToast(null), 1800);
      return;
    }

    addItem({ ...artwork, stock });
    setToast(`Added ${artwork.name || "artwork"} to cart.`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="artwork-details">
      <button className="artwork-back" onClick={() => navigate("/gallery")}>
        ← Back to gallery
      </button>

      <div className="artwork-grid">
        <div className="artwork-media">
          {artwork.imageUrl && imgOk ? (
            <img
              src={artwork.imageUrl}
              alt={artwork.name || "Artwork"}
              onError={() => setImgOk(false)}
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="artwork-placeholder">No image</div>
          )}
        </div>

        <div className="artwork-info">
          <div className="artwork-badges">
            {artwork.featured ? <span className="artwork-pill">Featured</span> : null}
            {artwork.collection ? <span className="artwork-pill">{artwork.collection}</span> : null}
            <span className={`artwork-pill status status-${artwork.status || "available"}`}>
              {statusLabel}
            </span>
          </div>

          <h1 className="artwork-title">{artwork.name || "Untitled"}</h1>

          {(artwork.year || artwork.medium || artwork.dimensions) ? (
            <div className="artwork-meta-block">
              {artwork.year ? <div><strong>Year:</strong> {artwork.year}</div> : null}
              {artwork.medium ? <div><strong>Medium:</strong> {artwork.medium}</div> : null}
              {artwork.dimensions ? <div><strong>Dimensions:</strong> {artwork.dimensions}</div> : null}
            </div>
          ) : null}

          {artwork.description ? (
            <p className="artwork-description">{artwork.description}</p>
          ) : null}

          {Array.isArray(artwork.tags) && artwork.tags.length > 0 ? (
            <div className="artwork-tags">
              {artwork.tags.map((tag) => (
                <span key={tag} className="artwork-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {artwork.showInStore ? (
            <div className="artwork-purchase-panel">
              <div className="artwork-price">
                {isAvailableToBuy ? money(artwork.price, artwork.currency) : statusLabel}
              </div>

              {inCart > 0 ? (
                <div className="artwork-hint">
                  In your cart: <strong>{inCart}</strong>
                </div>
              ) : null}

              <div className="artwork-actions">
                <button
                  className="artwork-btn primary"
                  disabled={!isAvailableToBuy}
                  onClick={handleAddToCart}
                >
                  {isAvailableToBuy ? "Add to Cart" : statusLabel}
                </button>

                <Link className="artwork-btn ghost" to="/gallery">
                  Back to Gallery
                </Link>

                {artwork.showInStore ? (
                  <Link className="artwork-btn ghost" to={`/product/${artwork.id}`}>
                    Store View
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="artwork-note">
              This piece is displayed in the gallery and is not currently listed in the store.
            </div>
          )}

          {toast ? <div className="artwork-toast">{toast}</div> : null}
        </div>
      </div>
    </div>
  );
}