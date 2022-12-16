import { Outlet, Link } from 'react-router-dom';
import './navigation.styles.scss';
import { Fragment, useContext } from 'react';
import ImageIcon from '../../components/image-icon/image-icon.component'

import { ReactComponent as HomeIcon} from '../../assets/train-icon.svg'

import { UserContext } from '../../context/user/user.context';
import { signOutUser } from '../../utils/firebase/firebase.utils';

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  
  return (
    <>
      <div className='navigation-container'>
      <div>
        <Link to='/'>
          <HomeIcon style={{height: '20px', paddingTop: '10px'}}/>
        </Link>
      </div>
      {
        currentUser ? (
          <div className='red-dot' onClick={signOutUser}></div>
        ) : (
          <Link to='/sign-in'>
            <div className='green-dot'></div>
          </Link>
        )
      }
      </div>
      <Outlet />
    </>
  )
}

export default Navigation
