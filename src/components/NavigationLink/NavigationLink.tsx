import React from 'react'
import { NavLink } from 'react-router-dom'
import './NavigationLink.styles.scss'
import AccountModal from '../../routes/navigation/AccountModal/AccountModal';
interface NavigationLinkProps {
  path?: string;
  title?: string;
  mobileMenuAction?: any;
  end?: boolean;

  //account-related props
  currentUser?: any;
  isModalOpen?: boolean;
  toggleModal?: () => void;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  path, 
  title, 
  mobileMenuAction,
  end,
  currentUser,
  isModalOpen,
  toggleModal
}) => {
  if(currentUser && toggleModal) {
    return (
      <>
        <button style={{textAlign: "left", margin: '0'}} className="nav-link" onClick={toggleModal}>
          {currentUser.displayName || "User"}
        </button>
        {isModalOpen && (
          <AccountModal currentUser={currentUser} onClose={toggleModal} />
        )}
      </>
    )
  }
  return (
    <>
        <NavLink onClick={mobileMenuAction} to={path ?? '#'} className={({isActive}) => isActive ? 'active' : ''} end>
            {title}
        </NavLink>
    </>
  )
}

export default NavigationLink