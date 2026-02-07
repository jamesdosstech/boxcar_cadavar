import React from "react";
import { useIsAdmin } from "../../../hooks/useIsAdmin.hook";
import NavigationLink from "../../../components/NavigationLink/NavigationLink";

interface MobileMenuProps {
  state: any,
  dispatch: any,
  currentUser: any
}

const MobileMenu: React.FC<MobileMenuProps> = ({ state, dispatch, currentUser }) => {
  const isAdmin = useIsAdmin()
  return (
    <div className="mobile-menu">
      <NavigationLink 
        mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })} 
        path="/" 
        title="Home"
      />
      <NavigationLink 
        mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })} 
        path="/showroom" 
        title="Showroom"
      />
      {
        isAdmin && <NavigationLink 
          mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })} 
          path="/admin" 
          title="Admin"
        />
      }
      <NavigationLink 
        mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })} 
        path="/blog" 
        title="Blog"
      />
      <NavigationLink 
        mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })} 
        path="/shop" 
        title="Shop"
      />
      {
        currentUser ? ( 
          <NavigationLink 
            currentUser={currentUser}
            isModalOpen={state.isModalOpen}
            mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })}
            toggleModal={() => dispatch({ type: "TOGGLE_MODAL" })}
          />
        ) : (
          <NavigationLink 
            mobileMenuAction={() => dispatch({ type: "TOGGLE_MENU" })} 
            path="/sign-in" 
            title="Sign In"
          />
        )
      }
    </div>
  )  
};

export default MobileMenu;
