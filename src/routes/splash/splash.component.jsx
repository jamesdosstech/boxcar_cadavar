import { useMemo } from "react";
import "./splash.styles.scss";
import { useCountdown } from "../../hooks/usecountdown.component";
import SplashEnter from "../../components/splash-enter/splash-enter.component";
import SplashTimer from "../../components/splash-timer/splash-timer.component";

const Splash = ({ targetDate, trainList, data }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  // Memoize splash message based on the days value
  const splashMessage = useMemo(() => {
    return days === 6
      ? {
          welcomeMessage: "You're early! The next show starts in...",
          subtitle: "See you Tuesday!",
        }
      : {
          welcomeMessage: "Welcome to Doosetrain, friends",
          subtitle: "Live DJ streams every Tuesday",
        };
  }, [days]);

  // Define the content that changes based on the countdown
  const renderSplashContent = useMemo(() => {
    if (days !== 6) {
      return (
        <SplashTimer
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          message={splashMessage}
          trainList={trainList}
        />
      );
    }
    return <SplashEnter data={data} trainList={trainList} />;
  }, [days, hours, minutes, seconds, splashMessage, trainList, data]);

  return (
    <div className="splash-component-container">{renderSplashContent}</div>
  );
};

export default Splash;
