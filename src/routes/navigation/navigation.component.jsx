import { Outlet, Link } from "react-router-dom";
import "./navigation.styles.scss";
import { useContext, useState } from "react";

import { ReactComponent as HomeIcon } from "../../assets/train-icon.svg";

import { UserContext } from "../../context/user/user.context";
import { auth, signOutUser } from "../../utils/firebase/firebase.utils";
import { updateProfile } from "firebase/auth";
import CartDropDown from "../../components/cart-dropdown/cart-dropdown.component";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";

const defaultFormFields = {
  displayName: "",
};

const Navigation = () => {
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;

  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const { currentUser, setCurrentUser, updateUserContext } =
    useContext(UserContext);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName } = formFields;

  const { cartCount } = useContext(ShoppingCartContext);

  //firebase logic
  // console.log(auth);

  const setNavBarStatus = () => setIsNavBarOpen(!isNavBarOpen);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        console.log(auth.currentUser);
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });

        updateUserContext({
          ...auth.currentUser,
          displayName: displayName,
        });
        console.log("displayName is on display");
      }
    } catch (error) {
      console.error("error updating display name:", error);
    }
    console.log("submit");
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
                paddingRight: "5px",
              }}
            />
            Doosetrain
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={setNavBarStatus}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav">
              <div>
                <Link
                  // data-bs-toggle="collapse"
                  // data-bs-target="#navbarNavAltMarkup"
                  className="nav-item nav-link"
                  to="/shop"
                  // onClick={setNavBarStatus}
                >
                  Shop
                </Link>
              </div>
              <div>
                <Link className="nav-item nav-link" to="/showroom">
                  Showroom
                </Link>
              </div>
              <div>
                {currentUser && currentUser.email === adminEmail && (
                  <Link className="nav-item nav-link" to="/admin">
                    Admin
                  </Link>
                )}
              </div>
              {currentUser && (
                <div className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {currentUser && currentUser.displayName}
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                    data-bs-theme="dark"
                  >
                    <div className="container">
                      <form className="form-inline" onSubmit={handleSubmit}>
                        <input
                          className="form-control mr-sm-2"
                          type="search"
                          name="displayName"
                          value={displayName}
                          onChange={handleChange}
                          required
                          maxLength={15}
                          placeholder={"change your display"}
                          aria-label="Change Username"
                        />
                        <button
                          className="btn btn-outline-success my-2 my-sm-0"
                          type="submit"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              <div data-bs-theme="dark">
                <div className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="shopDropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i style={{ color: "white" }} className="bi bi-cart">
                      {cartCount}
                    </i>
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="shopDropdownMenuLink"
                  >
                    <div className="container-fluid">
                      <CartDropDown />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {currentUser ? (
                  <Link className="nav-item nav-link" onClick={signOutUser}>
                    Sign Out
                  </Link>
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
