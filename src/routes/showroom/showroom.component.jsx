import { useContext, lazy, Suspense } from "react";
import "./showroom.styles.scss";
import CommentContainer from "../../components/comment-container/comment-container.component";
import { UserContext } from "../../context/user/user.context";

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
        <Suspense fallback={<div>Loading... Doosez</div>}>
          <LazyStreamContainer />
        </Suspense>
        {currentUser ? (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCommentContainer currentUser={currentUser} />
          </Suspense>
        ) : (
          <>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyCommentContainer currentUser={null} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
};

export default Showroom;
