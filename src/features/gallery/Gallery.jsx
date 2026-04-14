import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getGalleryProducts,
  sortGalleryProducts,
  isPurchasable,
} from "../../utils/firebase/firebase.utils";
import "./Gallery.styles.scss";

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getGalleryProducts()
      .then((data) => {
        if (!mounted) return;
        const normalized = Array.isArray(data) ? data : [];
        setArtworks(sortGalleryProducts(normalized));
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load gallery.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const collections = useMemo(() => {
    const set = new Set(
      artworks
        .map((item) => (item.collection || "").trim())
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = artworks.filter((item) => {
      const haystack = [
        item.name,
        item.description,
        item.collection,
        item.medium,
        ...(Array.isArray(item.tags) ? item.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = term ? haystack.includes(term) : true;
      const matchesCollection = collectionFilter
        ? item.collection === collectionFilter
        : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return matchesSearch && matchesCollection && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      if (sort === "yearDesc") return Number(b.year || 0) - Number(a.year || 0);
      if (sort === "yearAsc") return Number(a.year || 0) - Number(b.year || 0);
      if (sort === "nameAsc") return (a.name || "").localeCompare(b.name || "");
      return sortGalleryProducts(list).indexOf(a) - sortGalleryProducts(list).indexOf(b);
    });

    return list;
  }, [artworks, search, collectionFilter, statusFilter, sort]);

  const getStatusLabel = (item) => {
    if (item.status === "sold") return "Sold";
    if (item.status === "coming_soon") return "Coming Soon";
    if (isPurchasable(item)) return "Available";
    return "Unavailable";
  };

  return (
    <div className="gallery-page">
      <header className="gallery-hero">
        <h1>Gallery</h1>
        <p>Original works, featured collections, and archived moments in progress.</p>
      </header>

      <div className="gallery-filters">
        <input
          type="text"
          placeholder="Search by title, medium, collection, or tag"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={collectionFilter}
          onChange={(e) => setCollectionFilter(e.target.value)}
        >
          <option value="">All Collections</option>
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="coming_soon">Coming Soon</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured / Newest</option>
          <option value="yearDesc">Year: Newest</option>
          <option value="yearAsc">Year: Oldest</option>
          <option value="nameAsc">Name: A–Z</option>
        </select>
      </div>

      {loading ? (
        <div className="gallery-state">Loading gallery…</div>
      ) : error ? (
        <div className="gallery-state error">{error}</div>
      ) : filteredArtworks.length === 0 ? (
        <div className="gallery-state">No artworks match your filters.</div>
      ) : (
        <div className="gallery-grid">
          {filteredArtworks.map((item) => (
            <article key={item.id} className="gallery-card">
              <div className="gallery-card__media">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name || "Artwork"} loading="lazy" />
                ) : (
                  <div className="gallery-card__placeholder">No image</div>
                )}

                {item.featured ? (
                  <span className="gallery-badge gallery-badge--featured">Featured</span>
                ) : null}

                <span className={`gallery-badge gallery-badge--${item.status || "available"}`}>
                  {getStatusLabel(item)}
                </span>
              </div>

              <div className="gallery-card__body">
                <h2>{item.name || "Untitled"}</h2>

                {item.collection ? (
                  <div className="gallery-meta">Collection: {item.collection}</div>
                ) : null}

                {item.medium ? (
                  <div className="gallery-meta">Medium: {item.medium}</div>
                ) : null}

                {(item.dimensions || item.year) ? (
                  <div className="gallery-meta">
                    {[item.dimensions, item.year].filter(Boolean).join(" • ")}
                  </div>
                ) : null}

                {item.description ? (
                  <p className="gallery-desc">{item.description}</p>
                ) : null}

                {Array.isArray(item.tags) && item.tags.length > 0 ? (
                  <div className="gallery-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="gallery-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="gallery-actions">
                  <Link className="gallery-btn" to={`/gallery/${item.id}`}>
                    View Details
                  </Link>

                  {isPurchasable(item) ? (
                    <Link className="gallery-btn gallery-btn--ghost" to={`/product/${item.id}`}>
                      Purchase
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;