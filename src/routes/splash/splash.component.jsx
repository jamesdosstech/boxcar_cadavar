import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import Loading from '../../components/loading/loading.component';
import './splash.styles.scss';

const SHOW_DAY = 2; // Tuesday (0=Sunday)
const SHOW_HOUR = 20; // 8 PM
const SHOW_DURATION_HOURS = 6;

const Splash = ({ data }) => {
  const [latestPost, setLatestPost] = useState(null);
  const [latestProduct, setLatestProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // ——— Helper Functions ———
  const getNextShow = (fromDate = new Date()) => {
    const result = new Date(fromDate);
    const day = result.getDay();
    let daysUntilShow = (SHOW_DAY - day + 7) % 7;
    const isSameDayAfterHour = daysUntilShow === 0 && result.getHours() >= SHOW_HOUR;
    if (isSameDayAfterHour) daysUntilShow = 7;
    result.setDate(result.getDate() + daysUntilShow);
    result.setHours(SHOW_HOUR, 0, 0, 0);
    return result;
  };

  const getShowEnd = (showStart) => {
    const end = new Date(showStart);
    end.setHours(end.getHours() + SHOW_DURATION_HOURS);
    return end;
  };

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // ——— Timer Effect ———
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      // Determine the show window dynamically
      let nextShow = getNextShow(now);
      let showEnd = getShowEnd(nextShow);

      // If we are currently inside this week's show window
      const lastShow = getNextShow(new Date(now.getTime() - 7 * 24 * 3600 * 1000));
      const lastShowEnd = getShowEnd(lastShow);
      if (now >= lastShow && now < lastShowEnd) {
        setTimeLeft("🎶 Show Has Started! 🎶");
      } else if (now >= nextShow && now < showEnd) {
        setTimeLeft("🎶 Show Has Started! 🎶");
      } else {
        setTimeLeft(formatTimeLeft(nextShow - now));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ——— Fetch Latest Blog & Product ———
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const blogQuery = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(1));
        const blogSnapshot = await getDocs(blogQuery);
        blogSnapshot.forEach(doc => setLatestPost({ id: doc.id, ...doc.data() }));

        const productQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(1));
        const productSnapshot = await getDocs(productQuery);
        productSnapshot.forEach(doc => setLatestProduct({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLatest();
  }, []);

  // ——— Render ———
  if (!latestPost || !latestProduct) {
    return (
      <div className="splash-loader-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="splash-component-container">
      <section className="intro">
        <h1>Welcome to Doosetrain</h1>
        <p>Your hub for live sets, merchandise, and news updates</p>
      </section>

      <section className="latest-blog">
        <h2>Latest Blog Post</h2>
        <div className="blog-card">
          <div className="blog-image">
            <img src={latestProduct.imageUrl} alt={latestProduct.name} />
          </div>
          <div className="blog-details">
            <h3>{latestPost.title}</h3>
            <p>{latestPost.content}</p>
          </div>
        </div>
      </section>

      <section className="timer">
        <h2>Next Show Starts In:</h2>
        <p>{timeLeft}</p>
      </section>
    </div>
  );
};

export default Splash;
