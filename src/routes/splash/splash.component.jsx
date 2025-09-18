import { useEffect, useState } from "react";
import "./splash.styles.scss";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";

const Splash = ({ targetDate, trainList, data }) => {
  const [latestPost, setLatestPost] = useState(null);
  const [latestProduct, setLatestProduct] = useState(null)
  const [timeLeft, setTimeLeft] = useState('');

  // Helper: get next Tuesday at 8 PM
  const getNextTuesday = () => {
    const now = new Date();
    const nextTuesday = new Date(now);

    // Calculate days until next Tuesday
    const day = now.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const daysUntilTuesday = (2 - day + 7) % 7 || 7; // always get next Tuesday
    nextTuesday.setDate(now.getDate() + daysUntilTuesday);
    nextTuesday.setHours(20, 0, 0, 0); // 8 PM
    return nextTuesday;
  };

  // Helper: get Wednesday 12 AM following a Tuesday
  const getResetWednesday = (tuesday) => {
    const wednesday = new Date(tuesday);
    wednesday.setDate(wednesday.getDate() + 1);
    wednesday.setHours(0, 0, 0, 0); // 12 AM
    return wednesday;
  };

  useEffect(() => {
    // fetch latest blog Post
    const fetchLatestPost = async () => {
      const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setLatestPost({ id: doc.id, ...doc.data()});
      });
    };
    const fetchLatestProduct = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setLatestProduct({id: doc.id, ...doc.data()})
      })
    }
    fetchLatestProduct();
    fetchLatestPost();
  },[]);

  // countdown timer
  useEffect(() => {
    let nextShow = getNextTuesday();
    let resetTime = getResetWednesday(nextShow);

    const interval = setInterval(() => {
      const now = new Date();

      // Reset next show if past Wednesday 12 AM
      if (now >= resetTime) {
        nextShow = getNextTuesday();
        resetTime = getResetWednesday(nextShow);
      }

      if (now >= nextShow && now < resetTime) {
        // Between Tuesday 8 PM and Wednesday 12 AM
        setTimeLeft("The Show is Starting!");
      } else {
        // Countdown until next Tuesday 8 PM
        const diff = nextShow - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash-component-container">
      <section className="intro">
        <h1>Welcome to Doosetrain</h1>
        <p>Your hub for live sets, merchandise, and news updates</p>
      </section>

      <section className="latest-blog">
        <h2>Latest Blog Post</h2>
        {latestPost ? (
          <div className="blog-card">
            {latestProduct && (
              <div className="blog-image">
                <img src={latestProduct.imageUrl} alt={latestProduct.name} />
              </div>
            )}
            {!latestProduct && <span>...loading.</span>}
            <div className="blog-details">
              <h3>{latestPost.title}</h3>
              <div className="blog-content">
                <p>{latestPost.content}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </section>

      <section className="timer">
        <h2>Next Show Starts In:</h2>
        <p>{timeLeft}</p>
      </section>
    </div>
    // <div className="splash-component-container">
    //   <section className="intro">
    //     <h1>Welcome to Doosetrain</h1>
    //     <p>Your hub for live sets, merchandise, and news updates</p>
    //   </section>
    //   <section className="latest-blog">
    //     <h2>Latest Blog Post</h2>
    //     {latestPost ? (
    //       <div className="blog-card">
    //         <h3>{latestPost.title}</h3>
    //         <div className="blog-content">
    //           <p>{latestPost.content}</p>
    //         </div>
    //       </div>
    //     ): (
    //       <p>Loading...</p>
    //     )}
    //   </section>
    //   <section className="timer">
    //     <h2>Next Show Starts In:</h2>
    //     <p>{timeLeft}</p>
    //   </section>
    // </div>
  );
};

export default Splash;
