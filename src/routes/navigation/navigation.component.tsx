import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useRef, useReducer } from "react";
import "./navigation.styles.scss"; // Custom styles
import { UserContext } from "../../context/user/user.context";
// import {
//   auth,
//   signOutUser,
//   updateUserName,
// } from "../../utils/firebase/firebase.utils";
// import { updateProfile } from "firebase/auth";
// import UserDropdown from "./UserDropdown/UserDropdown";
// import { CartIcon } from "./CartIcon/CartIcon";
import { adminEmail } from "../../constants";
import AccountModal from "./AccountModal/AccountModal";
import NavbarContainer from "./NavbarContainer/NavbarContainer";
import { initialState, reducer } from "./navReducer";
import MobileMenu from "./MobileMenu/MobileMenu";
import DesktopMenu from "./DesktopMenu/DesktopMenu";
import { useIsAdmin } from "../../hooks/useIsAdmin.hook";
import AccountButton from "./AccountButton/AccountButton";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import CartIcon from "../../components/cart-icon/cart-icon.component";
import CartModal from "../Cart/Cart";
// import { CartIcon } from "./CartIcon/CartIcon";
// import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";

// Initial state for reducer
// const initialState = {
//   isMenuOpen: false,
//   isModalOpen: false,
//   isMobile: window.innerWidth <= 768,
// };

// Reducer function to manage state transitions
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "TOGGLE_MENU":
//       return { ...state, isMenuOpen: !state.isMenuOpen };
//     case "TOGGLE_MODAL":
//       return { ...state, isModalOpen: !state.isModalOpen };
//     case "SET_MOBILE":
//       return { ...state, isMobile: action.payload };
//     default:
//       return state;
//   }
// };

const NavigationLinkDetails = [
  {
    title: 'Home',
    link: '/'
  },
  {
    title: 'Showroom',
    link: 'showroom'
  },
  {
    title: 'Blog',
    link: 'blog'
  }, 
  // {
  //   title: 'Shop',
  //   link: 'shop'
  // }
]

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const { cartItems } = useCart()
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isAdmin = useIsAdmin()
  // Update mobile state on resize
  // useEffect(() => {
  //   const handleResize = () =>
  //     dispatch({ type: "SET_MOBILE", payload: window.innerWidth <= 768 });
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
//  
  return (
    <>
      <nav className="scroll-x">
        {NavigationLinkDetails.map(({title, link}) => {
          return (
            <NavLink key={title} to={link} end>
              {title}
            </NavLink>
          )
        })}
        {/* Shopping Cart */}
        {/* <button className="nav-link" onClick={() => setIsCartOpen(true)}>
          <span><i className="bi bi-cart"></i> {cartItems.length}</span>
        </button> */}
        {isAdmin && <NavLink to={'/admin'}>Admin</NavLink>}
        {currentUser ? (
            <AccountButton 
              currentUser={currentUser}
              isModalOpen={state.isModalOpen}
              toggleModal={() => dispatch({type: 'TOGGLE_MODAL'})}
            />
          ):(
            <NavLink to={'/sign-in'}>
              Sign In
            </NavLink>
          )
        }
      </nav>
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)}/>}
    </>
    // <nav className={`navbar ${state.isMenuOpen ? 'open' : ''}`}>
    //   <div className="navbar-container">
    //     <NavbarContainer state={state} dispatch={dispatch}/>
    //     {state.isMobile ? (
    //       state.isMenuOpen && (
    //         <MobileMenu state={state} dispatch={dispatch} currentUser={currentUser}/>
    //       )
    //     ): (
    //       <DesktopMenu state={state} dispatch={dispatch} currentUser={currentUser}/>
    //     )}
    //   </div>
    // </nav>
    // <nav className={`navbar ${state.isMenuOpen ? "open" : ""}`}>
    //   <div className="navbar-container">
    //     {/* Brand section */}
    //     <div className="navbar-brand">
    //       <HomeIcon
    //         className={`icon ${state.isMenuOpen ? "spinning" : ""}`}
    //         onClick={() => dispatch({ type: "TOGGLE_MENU" })}
    //       />
    //       <Link className="custom-link" to="/">
    //         Doosetrain
    //       </Link>
    //     </div>

    //     {/* Desktop Menu */}
    //     {!state.isMobile && (
    //       <div className="navbar-menu">
    //         <Link to="/showroom" className="nav-link">
    //           Showroom
    //         </Link>
    //         {currentUser ? (
    //           <>
    //             <button
    //               className="nav-link"
    //               onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
    //             >
    //               {currentUser.displayName || "User"}
    //             </button>
    //             {state.isModalOpen && (
    //               <AccountModal
    //                 currentUser={currentUser}
    //                 onClose={() => dispatch({ type: "TOGGLE_MODAL" })}
    //               />
    //             )}
    //           </>
    //         ) : (
    //           <Link to="/sign-in" className="nav-link">
    //             Sign In
    //           </Link>
    //         )}
    //         <Link>
    //         Admin</Link>
    //         <Link>Shop</Link>
    //       </div>
    //     )}
    //   </div>

    //   {/* Mobile Menu */}
    //   {state.isMobile && state.isMenuOpen && (
    //     <div className="mobile-menu">
    //       <Link
    //         to="/showroom"
    //         className="nav-link"
    //         onClick={() => dispatch({ type: "TOGGLE_MENU" })}
    //       >
    //         Showroom
    //       </Link>
    //       {currentUser ? (
    //         <>
    //           <button
    //             className="nav-link"
    //             onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
    //           >
    //             {currentUser.displayName || "User"}
    //           </button>
    //           {state.isModalOpen && (
    //             <AccountModal
    //               currentUser={currentUser}
    //               onClose={() => dispatch({ type: "TOGGLE_MODAL" })}
    //             />
    //           )}
    //         </>
    //       ) : (
    //         <>
    //           <Link
    //             to="/sign-in"
    //             className="nav-link"
    //             onClick={() => dispatch({ type: "TOGGLE_MENU" })}
    //           >
    //             Sign In
    //           </Link>
    //         </>
    //       )}
    //       <Link>
    //         Admin
    //       </Link>

    //         <Link>Shop</Link>
    //     </div>
    //   )}
    // </nav>
  );
};

export default Navigation;
