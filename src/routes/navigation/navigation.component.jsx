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
  // const adminEmail = process.env.REACT_APP_ADMIN_EMAIL
  const adminEmail = "doosetrain@gmail.com";
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const setDropDown = () => {
    setIsCartOpen(!isCartOpen);
    console.log(isCartOpen, "set to new status");
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
                paddingRight: "5px",
                // paddingTop: "10px",
                // paddingLeft: "10px",
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
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNavAltMarkup"
                  className="nav-item nav-link"
                  to="/shop"
                  // onClick={setNavBarStatus}
                >
                  Shop
                </Link>
              </div>
              <div>
                <Link
                  className="nav-item nav-link"
                  to="/showroom"
                  data-toggle="collapse"
                  data-target="#navbarNavAltMarkup"
                >
                  Showroom
                </Link>
              </div>
              <div>
                {currentUser && currentUser.email === adminEmail && (
                  <Link
                    className="nav-item nav-link"
                    to="/admin"
                    data-toggle="collapse"
                    data-target="#navbarNavAltMarkup"
                  >
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
                  >
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
              )}
              <div>
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
