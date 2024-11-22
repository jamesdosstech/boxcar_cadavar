import "./splash.styles.scss";

import { useCountdown } from "../../hooks/usecountdown.component";

import SplashEnter from "../../components/splash-enter/splash-enter.component";
import SplashTimer from "../../components/splash-timer/splash-timer.component";

const Splash = ({ targetDate, trainList, data }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
   // Define the splash messages directly inside the component
   const splashMessage = days === 0 ? 
   {
     welcomeMessage: "You're early! The next show starts in...",
     subtitle: "See you Sunday!",
   } : 
   {
     welcomeMessage: "Welcome to Doosetrain, friends",
     subtitle: "Live DJ streams every Friday",
   };


  // console.log(`days ${days} and hours ${hours}`);
  return (
    <div className="App">
      {days === 0 ? (
        <SplashTimer
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          message={splashMessage}
          trainList={trainList}
        />
      ) : (
        <SplashEnter message={data} trainList={trainList} />
      )}
    </div>
  );
};

export default Splash;
