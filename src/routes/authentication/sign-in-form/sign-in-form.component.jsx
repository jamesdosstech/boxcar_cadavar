import { useState } from "react";

// import "./sign-in-form.styles.scss";

import {
  signInUser,
  resetPassword,
} from "../../../utils/firebase/firebase.utils";

const SignInForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInUser(email, password);
      // if (onClose) onClose(); // Close modal on success if onClose is provided
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      alert("Password reset email sent!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="sign-in-form">
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="nav-link" type="submit">Sign In</button>
      </form>
      <button className="nav-link" onClick={handleResetPassword}>Forgot Password?</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default SignInForm;
