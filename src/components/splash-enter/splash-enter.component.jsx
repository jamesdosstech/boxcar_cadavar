import "./splash-enter.styles.scss";

import { Link } from "react-router-dom";

import Button from "../button/button.component";
import ImageIcon from "../image-icon/image-icon.component";

const SplashEnter = ({ message, trainList, displayName }) => {
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
        Sorry {displayName}, This Page is Under Construction
        {/* <Link to='/showroom'>
                    <Button>enter here</Button>
                </Link> */}
      </div>
    </div>
  );
};

export default SplashEnter;
