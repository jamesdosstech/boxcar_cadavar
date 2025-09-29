import { useEffect, useState } from "react";
import "./splash.styles.scss";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";

const Splash = ({ targetDate, trainList, data }) => {
  const [latestPost, setLatestPost] = useState(null);
  const [latestProduct, setLatestProduct] = useState(null)
  const [timeLeft, setTimeLeft] = useState('');
  const debug = false;

  // Helper: get next Tuesday at 8 PM
  const getNextTuesdayAt8 = (fromDate = new Date()) => {
    const result = new Date(fromDate);
    const day = fromDate.getDay(); // 0=Sun, 1=Mon, 2=Tue...
    let daysUntilTuesday = (2 - day + 7) % 7; // how many days until Tuesday
    if (daysUntilTuesday === 0 && fromDate.getHours() >= 20) {
      // it's already Tuesday 8PM or later → move to next week
      daysUntilTuesday = 7;
    }
    result.setDate(fromDate.getDate() + daysUntilTuesday);
    result.setHours(20, 0, 0, 0); // Tuesday 8PM
    return result;
  };

  // 🔹 Dummy (today @ 8PM, or tomorrow if past 8PM)
  const getDummyShow = (fromDate = new Date()) => {
    const result = new Date(fromDate);
    result.setHours(20, 0, 0, 0); // always today at 8PM
    return result;
  };

  // Helper: get "end of show" (Tuesday 8PM + 6h)
  const getShowEnd = (showStart) => {
    const end = new Date(showStart);
    end.setHours(end.getHours() + 6); // add 6 hours
    return end;
  };

  useEffect(() => {
    let nextShow = debug ? getDummyShow() : getNextTuesdayAt8();

    const interval = setInterval(() => {
      const now = new Date();
      const showEnd = getShowEnd(nextShow);

      if (now >= nextShow && now < showEnd) {
        // during the show window
        setTimeLeft("🎶 Show Has Started! 🎶");
      } else if (now >= showEnd) {
        // after the show window → reset to next Tuesday
        nextShow = getNextTuesdayAt8(now);
      } else {
        // countdown until next show
        const diff = nextShow - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [debug]);

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
        const productData = {d: doc.id, ...doc.data()}
        console.log("Latest product:", productData);
        setLatestProduct(productData)
      })
    }
    fetchLatestProduct();
    fetchLatestPost();
  },[]);

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
