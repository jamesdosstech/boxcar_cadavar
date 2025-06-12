import { Link } from "react-router-dom";
import AccountButton from "../AccountButton/AccountButton";
import React from "react";
import { useIsAdmin } from "../../../hooks/useIsAdmin.hook";

interface MobileMenuProps {
  state: any,
  dispatch: any,
  currentUser: any
}

const MobileMenu: React.FC<MobileMenuProps> = ({ state, dispatch, currentUser }) => {
  const isAdmin = useIsAdmin()
  return (
    <div className="mobile-menu">
    <Link
      to="/showroom"
      className="nav-link"
      onClick={() => dispatch({ type: "TOGGLE_MENU" })}
    >
      Showroom
    </Link>
    {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
    {/* <Link to="/shop" className="nav-link">Shop</Link> */}
    {currentUser ? (
      <AccountButton
        currentUser={currentUser}
        isModalOpen={state.isModalOpen}
        toggleModal={() => dispatch({ type: "TOGGLE_MODAL" })}
      />
    ) : (
      <Link
        to="/sign-in"
        className="nav-link"
        onClick={() => dispatch({ type: "TOGGLE_MENU" })}
      >
        Sign In
      </Link>
    )}
  </div>
  )  
};

export default MobileMenu;
