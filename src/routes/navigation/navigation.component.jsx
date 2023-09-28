import { Outlet, Link } from "react-router-dom";
import "./navigation.styles.scss";
import { useContext, useState } from "react";

import { ReactComponent as HomeIcon } from "../../assets/train-icon.svg";

import { UserContext } from "../../context/user/user.context";
import { auth, signOutUser } from "../../utils/firebase/firebase.utils";
import { updateProfile } from "firebase/auth";

const defaultFormFields = {
  displayName: "",
};

const Navigation = () => {
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL
  const { currentUser } = useContext(UserContext);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName } = formFields;

  //firebase logic
  // console.log(auth);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log("submit");
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <HomeIcon
              style={{
                width: "30%",
                height: "30%",
                paddingRight: '5px'
                // paddingTop: "10px",
                // paddingLeft: "10px",
              }}
            />
            Doosetrain
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <div>
                <Link className="nav-item nav-link" to="/shop">Shop</Link>
              </div>
              <div>
                <Link className="nav-item nav-link" to="/showroom">Showroom</Link>
              </div>
              <div>
                {currentUser && currentUser.email === adminEmail && <Link className="nav-item nav-link" to="/admin">Admin</Link>}
              </div>
              { currentUser && (
                  <div className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {currentUser && currentUser.displayName}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <form className="form-inline" onSubmit={handleSubmit}>
                        <input 
                          className="form-control mr-sm-2" 
                          type="search" 
                          name="displayName"
                          value={displayName}
                          onChange={handleChange}
                          required
                          maxLength={15}
                          placeholder={currentUser && `${currentUser?.displayName}`}
                          aria-label="Change Username" 
                        />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Submit</button>
                      </form>
                    </div>
                  </div>  
                )
              }
              
              <div>
                {currentUser ? (
                  <Link className="nav-item nav-link" onClick={signOutUser}>Sign Out</Link>
                ) : (
                  <Link className="nav-item nav-link" to="/sign-in">
                    <div>Sign In</div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
