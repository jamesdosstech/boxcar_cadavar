import "./splash-enter.styles.scss";

import { Link } from "react-router-dom";

import Button from "../button/button.component";
import ImageIcon from "../image-icon/image-icon.component";

const SplashEnter = ({ message, trainList }) => {
  return (
    <div className="splash-container">
      <div className="splash-message-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {trainList.map((train) => {
            const { id, name } = train;
            return <ImageIcon key={id} alt={`${name}`} />;
          })}
        </div>
        <div>
          <h1 style={{ color: "white", fontFamily: "Oxanium" }}>
            {message[0].welcomeMessage}
          </h1>
          <p>{message[0].subtitle}</p>
        </div>
      </div>
      <div style={{ color: "white", fontFamily: "Oxanium" }}>
        This site is currently under construction. Plans for this page is to become a full fledge store. Look out for future updates.
        In the meantime we will continue to stream on Tuesday's.
        <div>
          <Link to='/showroom'>
              <Button>Enter Showroom</Button>
          </Link>  
        </div>
      </div>
    </div>
  );
};

export default SplashEnter;
