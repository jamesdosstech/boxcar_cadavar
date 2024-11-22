import "./splash-enter.styles.scss";
import { Link } from "react-router-dom";
import Button from "../button/button.component";
import ImageIcon from "../image-icon/image-icon.component";

const SplashEnter = ({ message, trainList }) => {
  const { welcomeMessage, subtitle } = message[0];

  return (
    <div className="splash-container">
      <div className="train-list">
        {trainList.map((train) => {
          const { id, name } = train;
          return <ImageIcon key={id} alt={name} />;
        })}
      </div>
      <div className="message-container">
        <h1 className="welcome-message">{welcomeMessage}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      <div className="info-text">
        <p>
          This site is currently under construction. Plans for this page are to become a fully-fledged store. Look out for future updates. In the meantime, we will continue to stream on Tuesdays.
        </p>
        <Link to='/showroom'>
          <Button>Enter Showroom</Button>
        </Link>
      </div>
    </div>
  );
};

export default SplashEnter;
