import { useState } from "react";
import { updateProfile, updatePassword } from "firebase/auth";
import {
  signOutUser,
  updateUserName,
} from "../../../utils/firebase/firebase.utils";

const AccountModal = ({ onClose, currentUser }) => {
  const [newUsername, setNewUsername] = useState(currentUser.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [step, setStep] = useState(1); // Step control for form

  console.log(currentUser);

  const handleSignOut = () => {
    signOutUser();
    onClose();
  };
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (newUsername === currentUser.displayName) return;
    setIsUpdating(true);
    try {
      await updateUserName(newUsername);
      alert("Username updated successfully!");
      setStep(2); // Move to password change step
    } catch (error) {
      console.log(error.message);
      setError("Failed to update username.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    setIsUpdating(true);
    try {
      await updatePassword(currentUser, newPassword);
      alert("Password updated successfully!");
      onClose();
    } catch (error) {
      setError("Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Account Options</h3>

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Step 1: Show only sign out and username change */}
        {step === 1 && (
          <>
            <button onClick={onClose}>Close</button>
            {/* <button onClick={signOutUser}>Sign Out</button> */}
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => setStep(2)}>Change Username</button>
          </>
        )}

        {/* Step 2: Change Username */}
        {step === 2 && (
          <form onSubmit={handleUsernameChange}>
            <label>
              Change Username:
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={newUsername}
                required
              />
            </label>
            <button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Username"}
            </button>
            {/* <button type="button" onClick={() => setStep(3)}>
              Change Password
            </button> */}
            <button type="button" onClick={() => setStep(1)}>
              Back
            </button>
          </form>
        )}

        {/* Step 3: Change Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordChange}>
            <label>
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                required
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </label>
            <button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
            <button type="button" onClick={() => setStep(2)}>
              Back to Username
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
