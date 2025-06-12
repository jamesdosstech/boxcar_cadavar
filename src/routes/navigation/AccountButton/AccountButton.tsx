import React from "react";
import AccountModal from "../AccountModal/AccountModal";

interface AccountButtonProps {
    currentUser: any,
    isModalOpen: any,
    toggleModal: any
}

const AccountButton: React.FC<AccountButtonProps> = ({ currentUser, isModalOpen, toggleModal }) => (
  <>
    <button style={{textAlign: "left"}} className="nav-link" onClick={toggleModal}>
      {currentUser.displayName || "User"}
    </button>
    {isModalOpen && (
      <AccountModal currentUser={currentUser} onClose={toggleModal} />
    )}
  </>
);

export default AccountButton;
