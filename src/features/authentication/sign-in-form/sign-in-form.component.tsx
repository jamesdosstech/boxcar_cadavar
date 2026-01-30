import { useId, useState } from "react";
import "./sign-in-form.styles.scss";
import { signInUser, resetPassword } from "../../../utils/firebase/firebase.utils";

type Props = {
  onClose?: () => void;
};

export default function SignInForm({ onClose }: Props) {
  const emailId = useId();
  const passId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsLoading(true);

    try {
      await signInUser(email, password);
      setStatusMessage("Signed in successfully.");
      onClose?.();
    } catch (err: any) {
      const msg =
        err?.code === "auth/invalid-credential" ? "Invalid email or password."
        : err?.code === "auth/too-many-requests" ? "Too many attempts. Try again later."
        : err?.message || "Sign in failed.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage("");
    setStatusMessage("");

    if (!email) {
      setErrorMessage("Enter your email first, then click “Forgot Password?”.");
      return;
    }

    try {
      await resetPassword(email);
      setStatusMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      const msg =
        err?.code === "auth/user-not-found" ? "No account found for that email."
        : err?.message || "Failed to send reset email.";
      setErrorMessage(msg);
    }
  };

  return (
    <form className="ds-auth-form" onSubmit={handleSignIn} aria-label="Sign in form">
      <div className="ds-field">
        <label className="ds-label" htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          className="ds-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor={passId}>Password</label>
        <input
          id={passId}
          className="ds-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {errorMessage && (
        <p className="ds-error" role="alert">
          {errorMessage}
        </p>
      )}

      {statusMessage && (
        <p className="ds-status" role="status">
          {statusMessage}
        </p>
      )}

      <button className="ds-btn" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <button className="ds-link-btn" type="button" onClick={handleResetPassword}>
        Forgot Password?
      </button>
    </form>
  );
}
