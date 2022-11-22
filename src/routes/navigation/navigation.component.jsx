import { Outlet, Link } from 'react-router-dom';
import { Fragment, useContext } from 'react';

import { UserContext } from '../../context/user/user.context';
import { signOutUser } from '../../utils/firebase/firebase.utils';

const Navigation = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
  }
  return (
    <>
      <div>
      {
        currentUser ? (
          <h1 onClick={signOutHandler}>SIGN OUT</h1>
        ) : (
          <Link to='/sign-in'>
            <h1>SIGN IN</h1>
          </Link>
        )
      }
      </div>
      <Outlet />
    </>
  )
}

export default Navigation
