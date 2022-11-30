import './App.css';
import { Route, Routes } from 'react-router-dom';

import Splash from './routes/splash/splash.component';
import Showroom from './routes/showroom/showroom.component';
import Navigation from './routes/navigation/navigation.component'
import Authentication from './routes/authentication/authentication.component'

const App = () => {
  const date = new Date();
  const dateCopy = new Date(date.getTime());
  const nextFriday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7),
      dateCopy.setHours(0),
      dateCopy.setMinutes(0),
      dateCopy.setSeconds(0)
    )
  );  

  const actualNextFriday = nextFriday.getTime();  

  const timeAfterThreeDays = actualNextFriday;

  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Splash targetDate={timeAfterThreeDays} />}/>
          <Route path='/showroom' element={<Showroom />}/>
          <Route path='sign-in' element={<Authentication />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
