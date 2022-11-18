import './App.css';
import { Route, Routes } from 'react-router-dom';

import Splash from './routes/splash/splash.component';
import Showroom from './routes/showroom/showroom.component';
import Navigation from './routes/navigation/navigation.component'
import SignIn from './routes/sign-in/sign-in.component'

const App = () => {
  const date = new Date();
  const dateCopy = new Date(date.getTime());
  const nextFriday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
    )
  );  

  const actualNextFriday = nextFriday.getTime();  

  const timeAfterThreeDays = actualNextFriday;

  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigation />}/>
        <Route index element={<Splash targetDate={timeAfterThreeDays} />}/>
        <Route path='/showroom' element={<Showroom />}/>
        <Route path='sign-in' element={<SignIn />}/>
      </Routes>
    </div>
  );
}

export default App;
