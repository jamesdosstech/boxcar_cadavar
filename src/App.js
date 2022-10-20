import './App.css';
import { Route, Routes, Outlet} from 'react-router-dom';
import ImageIcon from './components/image-icon/image-icon.component'

import Splash from './routes/splash/splash.component';
import Showroom from './routes/showroom/showroom.component';
import Navigation from './routes/navigation/navigation.component'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigation />}/>
        <Route index element={<Splash />}/>
        <Route path='/showroom' element={<Showroom />}/>
      </Routes>
    </div>
  );
}

export default App;
