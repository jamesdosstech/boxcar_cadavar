import { useState } from "react";
import { auth } from "../../utils/firebase/firebase.utils";
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (error) {
      console.error(error);
      setError("Failed to send reset email. Please check the email address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {resetSent ? (
        <div className="reset-confirmation" aria-live="polite">
          An email with instructions to reset your password has been sent to your
          inbox.
        </div>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="forgot-password-header">Forgot Your Password?</div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <div className="error-message" aria-live="polite">
              {error}
            </div>
          )}
          <div className="buttons-container">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
