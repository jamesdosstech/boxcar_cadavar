import './App.css';
import { Route, Routes } from 'react-router-dom';

import Splash from './routes/splash/splash.component';
import Showroom from './routes/showroom/showroom.component';
import Navigation from './routes/navigation/navigation.component'

const App = () => {
  const THREE_DAYS_IN_MS = 7*24*60*60*1000;
  const NOW_IN_MS = new Date().getTime();

  const timeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;
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
