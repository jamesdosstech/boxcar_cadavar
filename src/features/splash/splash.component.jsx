import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db, getHomepageArtwork, getHomepageGalleryPreview } from "../../utils/firebase/firebase.utils";
import Loading from "../../components/loading/loading.component";
import { Link } from "react-router-dom";
import "./splash.styles.scss";

const SHOW_DAY = 2; // Tue
const SHOW_HOUR = 20; // 8 PM
const SHOW_DURATION_HOURS = 6;

const addHours = (date, hours) => new Date(date.getTime() + hours * 3600 * 1000);
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getNextShowStart = (fromDate = new Date()) => {
  const d = new Date(fromDate);
  const candidate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), SHOW_HOUR, 0, 0, 0);
  const currentDay = d.getDay();
  let daysUntil = (SHOW_DAY - currentDay + 7) % 7;
  if (daysUntil === 0 && d >= candidate) daysUntil = 7;
  return addDays(candidate, daysUntil);
};

const formatTimeLeft = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds / 3600) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const excerpt = (text = "", max = 160) =>
  text.length > max ? text.slice(0, max).trimEnd() + "…" : text;

export default function Splash() {
  const [latestPost, setLatestPost] = useState(null);
  const [heroArtwork, setHeroArtwork] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);  const [timeText, setTimeText] = useState("");
  const [isLoadingContent, setIsLoadingContent] = useState(true)

  // Timer
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextShowStart = getNextShowStart(now);
      const prevShowStart = addDays(nextShowStart, -7);
      const prevShowEnd = addHours(prevShowStart, SHOW_DURATION_HOURS);

      if (now >= prevShowStart && now < prevShowEnd) {
        const msLeft = prevShowEnd.getTime() - now.getTime();
        setTimeText(`🎶 Live Now 🎶 Ends in ${formatTimeLeft(msLeft)}`);
      } else {
        setTimeText(formatTimeLeft(nextShowStart.getTime() - now.getTime()));
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch featured content
  useEffect(() => {
    const fetchLatest = async () => {
      setIsLoadingContent(true);

      try {
        const blogQ = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), limit(1));

        const [blogSnap, artwork, preview] = await Promise.all([
          getDocs(blogQ),
          getHomepageArtwork(),
          getHomepageGalleryPreview(3),
        ]);

        const blogDoc = blogSnap.docs[0];

        setLatestPost(blogDoc ? { id: blogDoc.id, ...blogDoc.data() } : null);
        setHeroArtwork(artwork);
        setGalleryPreview(preview);
      } catch (error) {
        console.error(error);
        setLatestPost(null);
        setHeroArtwork(null);
        setGalleryPreview([]);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchLatest();
  }, []);

  const heroArtworkPrice = useMemo(() => {
    if (!heroArtwork) return null;
    const dollars = (Number(heroArtwork.price || 0) / 100).toFixed(2);
    return `${dollars} ${(heroArtwork.currency || "usd").toUpperCase()}`;
  }, [heroArtwork]);

  if (isLoadingContent) {
    return (
      <div className="splash-loader-container">
        <Loading />
      </div>
    );
  }
  return (
  <div className="splash">
    <section className="hero-grid">
      {/* LEFT COLUMN */}
      <div className="hero-left">
        <div className="hero-title">
          <h1>Doosetrain</h1>
          <p>Live sets • Original paintings • Blog updates</p>
        </div>

        <div className="timer-card">
          <div className="timer-label">Next show</div>
          <div className="timer-value">{timeText}</div>
          <div className="timer-actions">
            <Link className="btn primary" to="/showroom">
              View Showroom
            </Link>
            <Link className="btn ghost" to="/shop">
              Shop Paintings
            </Link>
          </div>
        </div>

        {/* BLOG MOVED UNDER TIMER */}
        <section className="latest latest-under-timer">
          <div className="section-head">
            <h3>Latest Blog</h3>
            <Link className="link" to="/blog">
              View all
            </Link>
          </div>

          {latestPost ? (
            <div className="blog-preview">
              <div className="blog-body">
                <h4>{latestPost.title}</h4>
                <p className="muted">{excerpt(latestPost.content, 220)}</p>
                <Link className="btn ghost" to={`/blog/${latestPost.id}`}>
                  Read more
                </Link>
              </div>
            </div>
          ) : (
            <div className="blog-preview">
              <div className="blog-body">
                <h4>No blog posts yet</h4>
                <p className="muted">Check back soon for updates.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hero-right">
        {heroArtwork ? (
          <div className="feature-card">
            <div className="feature-image">
              <img src={heroArtwork.imageUrl} alt={heroArtwork.name} />
            </div>
            <div className="feature-meta">
              <div className="badge">{heroArtwork.featured ? "Featured Artwork" : "Latest Artwork"}</div>
              <h2>{heroArtwork.name}</h2>
              <p className="muted">{heroArtwork.description}</p>

              {(heroArtwork.collection || heroArtwork.medium) ? (
                <div className="muted">
                  {[heroArtwork.collection, heroArtwork.medium].filter(Boolean).join(" • ")}
                </div>
              ) : null}

              <div className="price-row">
                <span className="price">
                  {heroArtwork.showInStore ? heroArtworkPrice : "Gallery Piece"}
                </span>
                <span className="stock">
                  {heroArtwork.status === "sold"
                    ? "Sold"
                    : heroArtwork.status === "coming_soon"
                    ? "Coming Soon"
                    : Number(heroArtwork.quantity) > 0
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <div className="feature-actions">
                <Link className="btn primary" to={`/gallery/${heroArtwork.id}`}>
                  View Artwork
                </Link>

                {heroArtwork.showInStore ? (
                  <Link className="btn ghost" to={`/product/${heroArtwork.id}`}>
                    Shop This Piece
                  </Link>
                ) : (
                  <Link className="btn ghost" to="/gallery">
                    Browse Gallery
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="feature-card">
            <div className="feature-meta">
              <div className="badge">Featured Artwork</div>
              <h2>No artwork yet</h2>
              <p className="muted">New work will appear here soon.</p>

              <div className="feature-actions">
                <Link className="btn ghost" to="/gallery">
                  Visit Gallery
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    <section className="latest">
      <div className="section-head">
        <h3>Featured Gallery</h3>
        <Link className="link" to="/gallery">
          View gallery
        </Link>
      </div>

      {galleryPreview.length > 0 ? (
        <div className="gallery-preview-grid">
          {galleryPreview.map((item) => (
            <article key={item.id} className="gallery-preview-card">
              <Link to={`/gallery/${item.id}`}>
                <img src={item.imageUrl} alt={item.name} />
              </Link>
              <div className="gallery-preview-body">
                <h4>{item.name}</h4>
                <p className="muted">
                  {[item.collection, item.year].filter(Boolean).join(" • ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="blog-preview">
          <div className="blog-body">
            <h4>No gallery pieces yet</h4>
            <p className="muted">Featured artwork will appear here soon.</p>
          </div>
        </div>
      )}
    </section>
  </div>
);}
