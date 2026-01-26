import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
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
  const [latestProduct, setLatestProduct] = useState(null);
  const [timeText, setTimeText] = useState("");

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
      const blogQ = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), limit(1));
      const prodQ = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(1));

      const [blogSnap, prodSnap] = await Promise.all([getDocs(blogQ), getDocs(prodQ)]);

      const blogDoc = blogSnap.docs[0];
      const prodDoc = prodSnap.docs[0];

      if (blogDoc) setLatestPost({ id: blogDoc.id, ...blogDoc.data() });
      if (prodDoc) setLatestProduct({ id: prodDoc.id, ...prodDoc.data() });
    };

    fetchLatest().catch(console.error);
  }, []);

  const productPrice = useMemo(() => {
    if (!latestProduct) return null;
    const dollars = (Number(latestProduct.price || 0) / 100).toFixed(2);
    return `${dollars} ${(latestProduct.currency || "usd").toUpperCase()}`;
  }, [latestProduct]);

  if (!latestPost || !latestProduct) {
    return (
      <div className="splash-loader-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="splash">
      {/* HERO */}
      <section className="hero">
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
        </div>

        <div className="hero-right">
          <div className="feature-card">
            <div className="feature-image">
              <img src={latestProduct.imageUrl} alt={latestProduct.name} />
            </div>
            <div className="feature-meta">
              <div className="badge">Latest Drop</div>
              <h2>{latestProduct.name}</h2>
              <p className="muted">{latestProduct.description}</p>
              <div className="price-row">
                <span className="price">{productPrice}</span>
                <span className="stock">
                  {Number(latestProduct.quantity) > 0 ? "In stock" : "Sold out"}
                </span>
              </div>
              <div className="feature-actions">
                <Link className="btn primary" to={`/product/${latestProduct.id}`}>
                  View Details
                </Link>
                <Link className="btn ghost" to="/shop">
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className="latest">
        <div className="section-head">
          <h3>Latest Blog</h3>
          <Link className="link" to="/blog">
            View all
          </Link>
        </div>

        <div className="blog-preview">
          <div className="blog-body">
            <h4>{latestPost.title}</h4>
            <p className="muted">{excerpt(latestPost.content, 220)}</p>
            <Link className="btn ghost" to={`/blog/${latestPost.id}`}>
              Read more
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
