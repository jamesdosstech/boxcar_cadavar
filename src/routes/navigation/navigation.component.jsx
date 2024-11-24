import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import "./navigation.styles.scss"; // Custom styles
import { ReactComponent as HomeIcon } from "../../assets/train-icon.svg";
import { UserContext } from "../../context/user/user.context";
import { auth, signOutUser } from "../../utils/firebase/firebase.utils";
import { updateProfile } from "firebase/auth";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";

const Navigation = () => {
  const adminEmail = "doosetrain@gmail.com";
  const { currentUser, updateUserContext } = useContext(UserContext);
  const { cartCount } = useContext(ShoppingCartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu toggle state
  const cartDropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect if it's mobile

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCartDropdown = (e) => {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    setIsCartOpen((prev) => !prev);
  };

  const handleMenuToggle = (e) => {
    if (isMobile) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const handleOutsideClick = (event) => {
    if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
      setIsCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  const UserDropdown = () => (
    <div className="user-dropdown">
      <button className="nav-link">{currentUser.displayName || "User"}</button>
      <div className="dropdown-menu">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Change display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={15}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );

  const CartIcon = () => (
    <div className="cart-icon" ref={cartDropdownRef}>
      <button
        className="nav-link"
        aria-haspopup="true"
        aria-expanded={isCartOpen}
        onClick={toggleCartDropdown}
        onKeyDown={toggleCartDropdown}
      >
        <i className="bi bi-cart"></i>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>
      {isCartOpen && <CartDropdown />}
    </div>
  );

  return (
    <nav className={`navbar ${isMenuOpen ? "open" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <HomeIcon
            className={`icon ${isMenuOpen ? "spinning" : ""}`}
            onClick={handleMenuToggle}
          />
          <Link className="custom-link" to="/">Doosetrain</Link>
        </div>

        {/* Desktop view */}
        <div className="navbar-menu">
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/showroom" className="nav-link">Showroom</Link>
          {currentUser?.email === adminEmail && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
          {currentUser && <UserDropdown />}
          <CartIcon />
          <Link to={currentUser ? "/" : "/sign-in"} className="nav-link" onClick={currentUser ? signOutUser : undefined}>
            {currentUser ? "Sign Out" : "Sign In"}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/shop" className="nav-link" onClick={handleMenuToggle}>Shop</Link>
          <Link to="/showroom" className="nav-link" onClick={handleMenuToggle}>Showroom</Link>
          {currentUser?.email === adminEmail && (
            <Link to="/admin" className="nav-link" onClick={handleMenuToggle}>Admin</Link>
          )}
          {currentUser && <UserDropdown />}
          <CartIcon />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
