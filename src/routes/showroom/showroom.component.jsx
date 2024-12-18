import { useContext, lazy, Suspense } from "react";
import "./showroom.styles.scss";
import { UserContext } from "../../context/user/user.context";

const LazyStreamContainer = lazy(() =>
  import("./stream-container/stream-container.component")
);

const LazyCommentContainer = lazy(() =>
  import("./comment-container/comment-container.component")
);

const Showroom = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="showroom-container">
      <Suspense fallback={<div className="loading-screen">Loading Stream...</div>}>
        <div className="stream-container">
          <LazyStreamContainer />
        </div>
        <Suspense fallback={<div className="loading-screen">Loading Chat...</div>}>
          <div className="chat-container">
            <LazyCommentContainer currentUser={currentUser} />
          </div>
        </Suspense>
      </Suspense>
    </div>
  );
};

export default Showroom;
