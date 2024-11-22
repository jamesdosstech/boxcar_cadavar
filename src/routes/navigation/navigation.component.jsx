import { Outlet, Link } from "react-router-dom";
import { useContext, useState } from "react";
import './navigation.styles.scss';
import { ReactComponent as HomeIcon } from "../../assets/train-icon.svg";
import { UserContext } from "../../context/user/user.context";
import { auth, signOutUser } from "../../utils/firebase/firebase.utils";
import { updateProfile } from "firebase/auth";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component"; // Importing CartDropdown

const Navigation = () => {
  const adminEmail = 'doosetrain@gmail.com';
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);  // Manage dropdown state here
  const { currentUser, updateUserContext } = useContext(UserContext);
  const { cartCount } = useContext(ShoppingCartContext);

  const toggleNavBar = () => setIsNavBarOpen((prev) => !prev);
  const toggleCartDropdown = () => setIsCartOpen((prev) => !prev);  // Toggle cart dropdown visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        updateUserContext({ ...auth.currentUser, displayName });
      } catch (error) {
        console.error("Error updating display name:", error);
      }
    }
  };

  const AdminLink = () =>
    currentUser?.email === adminEmail && (
      <Link className="nav-item nav-link" to="/admin">
        Admin
      </Link>
    );

  const UserDropdown = () =>
    currentUser && (
      <div className="nav-item dropdown">
        <button
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {currentUser.displayName || "User"}
        </button>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <form className="form-inline" onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="text"
              placeholder="Change display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={15}
              required
            />
            <button className="btn btn-outline-success" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <HomeIcon className="icon" />
            Doosetrain
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleNavBar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isNavBarOpen ? "show" : ""}`}
          >
            <div className="navbar-nav" style={{ position: "relative" }}> {/* Apply relative positioning here */}
              <Link className="nav-item nav-link" to="/shop">
                Shop
              </Link>
              <Link className="nav-item nav-link" to="/showroom">
                Showroom
              </Link>
              <AdminLink />
              <UserDropdown />
              <div className="nav-item">
                <button
                  className="nav-link"
                  aria-expanded={isCartOpen ? "true" : "false"}
                  onClick={toggleCartDropdown}  // Toggle cart dropdown visibility
                >
                  <i className="bi bi-cart">{cartCount}</i> {/* Cart Count */}
                </button>

                {isCartOpen && (
                  <div className="cart-dropdown-container">
                    <CartDropdown /> {/* Cart dropdown content */}
                  </div>
                )}
              </div>
              {currentUser ? (
                <Link className="nav-item nav-link" to="/" onClick={signOutUser}>
                  Sign Out
                </Link>
              ) : (
                <Link className="nav-item nav-link" to="/sign-in">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
