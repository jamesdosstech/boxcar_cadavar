import "./App.css";
import { Route, Routes } from "react-router-dom";

import Splash from "./routes/splash/splash.component";
import Showroom from "./routes/showroom/showroom.component";
import Navigation from "./routes/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import UnderConstruction from "./components/under-construction/under-contstruction.component";
import SignUpForm from "./components/sign-up-form/sign-up-form.component";
import ResetPassword from "./routes/forgot-password/ResetPassword";

const trainList = [
  {
    id: 0,
    name: "Thomas",
  },
  {
    id: 1,
    name: "James",
  },
  {
    id: 2,
    name: "Doosetrain",
  },
  {
    id: 3,
    name: "Larry Hoover",
  },
  {
    id: 4,
    name: "Mary the Caboose",
  },
];
const splashMessage = [
  {
    id: 0,
    welcomeMessage: "welcome to doosetrain, friends",
    subtitle: "live dj streams every Tuesday",
  },
  {
    id: 1,
    welcomeMessage: "welcome to doosetrain, friends",
    subtitle: "you're early! the next show starts in...",
    reminder: "see you friday!",
  },
];

const App = () => {
  const date = new Date();
  const dateCopy = new Date(date.getTime());
  const nextFriday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 7) % 7 || 7),
      dateCopy.setHours(18),
      dateCopy.setMinutes(0),
      dateCopy.setSeconds(0)
    )
  );

  const dayAndHourOfShow = nextFriday.getTime();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route
            index
            element={
              <Splash
                data={splashMessage}
                trainList={trainList}
                targetDate={dayAndHourOfShow}
              />
            }
          />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/pass-reset" element={<ResetPassword />} />
          <Route path="sign-in" element={<Authentication />} />
          <Route path='shop' element={<UnderConstruction />} />
          <Route path='admin' element={<UnderConstruction />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
