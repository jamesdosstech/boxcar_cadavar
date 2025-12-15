import React from "react";

import { useContext, lazy, Suspense } from "react";
import "./showroom.styles.scss";
import { UserContext } from "../../context/user/user.context";
import Loading from "../../components/loading/loading.component";

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
      <Suspense fallback={<Loading />}>
        <div className="stream-container">
          <LazyStreamContainer />
        </div>
        <Suspense fallback={<Loading />}>
          <div className="chat-container">
            <LazyCommentContainer currentUser={currentUser} />
          </div>
        </Suspense>
      </Suspense>
    </div>
  );
};

export default Showroom;
