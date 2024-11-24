import { useState, useEffect } from "react";
import "./splash-enter.styles.scss";
import { Link } from "react-router-dom";
import Button from "../button/button.component";
import ImageIcon from "../image-icon/image-icon.component";

const SplashEnter = ({ trainList,data }) => {
  const { welcomeMessage, subtitle } = data;
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Activate the glitch effect after a slight delay when the component mounts
    const timer = setTimeout(() => {
      setGlitchActive(true);
    }, 1000); // Delay of 1 second
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="splash-container">
      <div className="train-list">
        {trainList.length > 0 ? (
          trainList.map((train) => {
            const { id, name } = train;
            return <ImageIcon key={id} alt={name} />;
          })
        ) : (
          <p>No trains available</p>
        )}
      </div>
      <div className="message-container">
        <h1
          className={`welcome-message ${glitchActive ? "glitch" : ""}`}
          data-text={welcomeMessage}
        >
          {welcomeMessage}
        </h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      <div className="info-text">
        <p>
          This site is currently under construction. Plans for this page are to
          become a fully-fledged store. Look out for future updates. In the
          meantime, we will continue to stream on Tuesdays.
        </p>
        <Link to="/showroom">
          <Button>Enter Showroom</Button>
        </Link>
      </div>
    </div>
  );
};

export default SplashEnter;
