import { useContext, useEffect, useState } from "react";
import "./showroom.styles.scss";
import StreamContainer from "../../components/stream-container/stream-container.component";
import CommentContainer from "../../components/comment-container/comment-container.component";
import { UserContext } from "../../context/user/user.context";

const Showroom = () => {
  const Title = "Showroom";
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  },[])
  return (
    <div className="App">
      {
        loading ? (
          <div>
            Loading
          </div>
        ) : (
        <div className="showroom-container">
          <StreamContainer />
          {/* <CommentContainer currentUser={currentUser} /> */}
          {currentUser ? (
            <CommentContainer currentUser={currentUser} />
          ) : (
            <>
              <CommentContainer currentUser={null} />
              {/* <Button ><Link to='/sign-in'>Sign In</Link></Button> */}
            </>
          )}
          {/* <Comments comments={initialComments}/> */}
        </div>    
        )
      }
      
    </div>
  );
};

export default Showroom;
