import './App.css';
import { Route, Routes } from 'react-router-dom';

import Splash from './routes/splash/splash.component';
import Showroom from './routes/showroom/showroom.component';
import Navigation from './routes/navigation/navigation.component'

const App = () => {
  const THREE_DAYS_IN_MS = 7*24*60*60*1000;
  const NOW_IN_MS = new Date().getTime();

  // console.log(new Date().getDate() + ((7 - NOW_IN_MS.getDay() + 5)))
    const date = new Date();
    const dateCopy = new Date(date.getTime());
    const nextFriday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
      )
    );  
    console.log('next firday', nextFriday.getTime());

    const acutalNextFriday = nextFriday.getTime();


  console.log('next friday plus the timer rules', nextFriday - THREE_DAYS_IN_MS)
  

  const timeAfterThreeDays = acutalNextFriday;
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigation />}/>
        <Route index element={<Splash targetDate={timeAfterThreeDays} />}/>
        <Route path='/showroom' element={<Showroom />}/>
      </Routes>
    </div>
  );
}

export default App;
