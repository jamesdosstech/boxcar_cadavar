import { useContext, lazy, Suspense } from "react";
import "./showroom.styles.scss";
import { UserContext } from "../../context/user/user.context";

// Lazy-load the components
const LazyStreamContainer = lazy(() =>
  import("../../components/stream-container/stream-container.component")
);

const LazyCommentContainer = lazy(() =>
  import("../../components/comment-container/comment-container.component")
);

const Showroom = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <div className="showroom-container">
        {/* Lazy load StreamContainer */}
        <Suspense fallback={<div className="loading-screen">Loading the Stream... Please Hang Tight!</div>}>
          <LazyStreamContainer />
        </Suspense>

        <Suspense fallback={<div className="loading-screen">Preparing the Chatroom... Please Wait!</div>}>
          <LazyCommentContainer currentUser={currentUser} />
        </Suspense>
      </div>
    </>
  );
};

export default Showroom;
