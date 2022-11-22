import { Outlet, Link } from 'react-router-dom';
import './navigation.styles.scss';
import { Fragment, useContext } from 'react';

import { UserContext } from '../../context/user/user.context';
import { signOutUser } from '../../utils/firebase/firebase.utils';

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  
  return (
    <>
      <div className='navigation-container'>
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
