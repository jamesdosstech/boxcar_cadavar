import React, { Suspense, lazy, useContext, useEffect } from "react";
import "./showroom.styles.scss";
import Loading from "../../components/loading/loading.component";
import { UserContext } from "../../context/user/user.context";

const StreamContainer = lazy(() => import("./stream-container/stream-container.component"));
const CommentContainer = lazy(() => import("./comment-container/comment-container.component"));

export default function Showroom(): JSX.Element {
  const { currentUser } = useContext(UserContext);

  // optional: set a body class for page-specific styling (if you want)
  useEffect(() => {
    document.body.classList.add("page-showroom");
    return () => document.body.classList.remove("page-showroom");
  }, []);

  return (
    <div className="showroom-container">
      <Suspense fallback={<Loading />}>
        <div className="showroom-stream">
          <StreamContainer />
        </div>
        <div className="showroom-chat">
          <CommentContainer currentUser={currentUser ?? null} />
        </div>
      </Suspense>
    </div>
  );
}
