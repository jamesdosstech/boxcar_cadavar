import "./splash.styles.scss";

import { useCountdown } from "../../hooks/usecountdown.component";

import SplashEnter from "../../components/splash-enter/splash-enter.component";
import SplashTimer from "../../components/splash-timer/splash-timer.component";

const Splash = ({ targetDate, trainList, data }) => {
  const splashMessage = [
    {
      id: 0,
      welcomeMessage: "welcome to doosetrain, friends",
      subtitle: "live dj streams every friday",
    },
    {
      id: 1,
      welcomeMessage: "welcome to doosetrain, friends",
      subtitle: "you're early! the next show starts in...",
      reminder: "see you Sunday!",
    },
  ];

  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  // console.log(`days ${days} and hours ${hours}`);
  return (
    <div className="App">
      {days === 7 || (days === 1 && hours <= 12) ? (
        <SplashEnter message={data} trainList={trainList} />
      ) : (
        <SplashTimer
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          message={splashMessage}
          trainList={trainList}
        />
      )}
    </div>
  );
};

export default Splash;
