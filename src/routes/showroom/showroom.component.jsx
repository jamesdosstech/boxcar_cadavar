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
    <div className="App">
      <div className="showroom-container">
        {/* Lazy load StreamContainer */}
        <Suspense fallback={<div>Loading... Doosez</div>}>
          <LazyStreamContainer />
        </Suspense>

        {/* Conditionally render LazyCommentContainer based on currentUser */}
        <Suspense fallback={<div>Loading comments...</div>}>
          <LazyCommentContainer currentUser={currentUser} />
        </Suspense>
      </div>
    </div>
  );
};

export default Showroom;
