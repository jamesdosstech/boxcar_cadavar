import { Outlet, Link } from "react-router-dom";
import "./navigation.styles.scss";
import { useContext } from "react";

import { ReactComponent as HomeIcon } from "../../assets/train-icon.svg";

import { UserContext } from "../../context/user/user.context";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import DisplayNameInput from "../../components/displayNameInput/display-name-input.component";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  // console.log(currentUser);
  return (
    <>
      <div className="navigation-container">
        <div className="nav-col">
          <Link to="/">
            <HomeIcon
              style={{
                width: "33",
                height: "20px",
                paddingTop: "10px",
                paddingLeft: "10px",
              }}
            />
          </Link>
        </div>
        <div className="nav-col" style={{ textDecoration: "none" }}>
          <Link to="/shop">Shop</Link>
        </div>
        <div className="nav-col">{currentUser ? <DisplayNameInput /> : ""}</div>

        <div className="nav-col">
          {currentUser ? (
            <div onClick={signOutUser}>Sign Out</div>
          ) : (
            <Link to="/sign-in">
              <div>Sign In</div>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
