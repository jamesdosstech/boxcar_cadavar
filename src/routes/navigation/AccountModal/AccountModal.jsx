import { useState } from "react";
import { updateProfile, updatePassword } from "firebase/auth";
import {
  db,
  signOutUser,
  updateUserName,
} from "../../../utils/firebase/firebase.utils";
import SignInForm from "../../authentication/sign-in-form/sign-in-form.component";
import SignUpForm from "../../authentication/sign-up-form/sign-up-form.component";
import { collection, getDocs, query, where } from "firebase/firestore";
import StepLayout from "./StepLayout.component";

const AccountModal = ({ onClose, currentUser, step, setStep }) => {
  const [newUsername, setNewUsername] = useState(currentUser?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('')
  // const [step, setStep] = useState(1); // Step control for form

  console.log(currentUser);

  const handleSignOut = () => {
    signOutUser();
    // onClose();
  };
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (newUsername === currentUser.displayName) return;
    // updated guards
    if (!newUsername || newUsername.trim() === "") {
      setError("Username cannot be empty.");
      return;
    }

    if (newUsername === currentUser.displayName) {
      setError("That’s already your current username.");
      return;
    }
    // changes end
    setIsUpdating(true);
    setError(null)
    try {
      // 🔎 Check Firestore for duplicates
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", newUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("❌ That username is already taken. Please choose another.");
        setIsUpdating(false);
        return;
      }

      // ✅ Safe to update
      await updateUserName(newUsername);
      // alert("Username updated successfully!");
      // setStep(2); // Move to password change step
      setConfirmationMessage("✅ Username updated successfully!");
      setStep(6); // Go to confirmation step
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
      setConfirmationMessage("✅ Password updated successfully!");
      setStep(6); // Go to confirmation step
    } catch (error) {
      setError("Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {/* <h3>Account Options Step: {step}</h3> */}
        {/* <p>Welcome {currentUser && currentUser.displayName + ','} to your Account Settings</p> */}
        {/* Error message */}
        {error && <p className="error-message">{error}</p>}
    
        {/* Step 1: Show only sign out and username change */}
        {currentUser && step === 1 && (
          <StepLayout>
            <h3 style={{textAlign: 'center'}}>Welcome {currentUser.displayName}</h3>
            <button className="nav-link" onClick={onClose}>Close</button>
            {/* <button onClick={signOutUser}>Sign Out</button> */}
            {currentUser && <button className="nav-link" onClick={handleSignOut}>Sign Out</button>}
            {!currentUser && <button className="nav-link" onClick={() => setStep(4)}>Sign In</button>}
            <button className="nav-link" onClick={() => setStep(2)}>Change Username</button>
          </StepLayout>
        )}

        {/* Step 2: Change Username */}
        {step === 2 && (
          <StepLayout>
          <form onSubmit={handleUsernameChange}>
            <label>
              {/* Change Username: */}
              <input
                // style={{backgroundColor: 'white'}}
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={newUsername}
                required
              />
            </label>
            <div style={{display: 'flex'}}>
              <button className="nav-link" type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Username"}
              </button>  
              <button className="nav-link" type="button" onClick={() => {
                setStep(1);
                setError('')
              }}>
                Back
              </button>
            </div>
          </form>
          </StepLayout>
        )}

        {/* Step 3: Change Password */}
        {step === 3 && (
          <StepLayout>
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
              <button className="nav-link" type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Password"}
              </button>
              <button type="button" onClick={() => setStep(2)}>
                Back to Username
              </button>
            </form>  
          </StepLayout>
        )}
        {/* Step 4: Sign In */}
        {step === 4 && (
          <StepLayout>
            <h3>Sign In</h3>
            <SignInForm onClose={onClose} />
            <p>
              Create an account{" "}
              <button className="nav-link" onClick={() => setStep(5)}>Sign Up</button>
            </p>
            <button className="nav-link" onClick={onClose}>Close</button>
          </StepLayout>
        )}
        {/* Step 5: Sign Up */}
        {step === 5 && (
          <StepLayout>
            <h3>Sign Up</h3>
            <SignUpForm />
            <p>
              Already have an account?{" "}
              <button className="nav-link" onClick={() => setStep(4)}>Sign In</button>
            </p>
            <button className="nav-link" onClick={onClose}>Close</button>
          </StepLayout>
        )}
        {/* step 6: confirmation */}
        {step === 6 && (
          <StepLayout>
            <div>
              <h3>{confirmationMessage}</h3>
              <button className="nav-link" onClick={() => setStep(1)}>Continue</button>
            </div>  
          </StepLayout>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
