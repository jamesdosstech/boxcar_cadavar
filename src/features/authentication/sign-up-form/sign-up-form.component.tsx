import { useId, useState } from "react";
import { updateProfile } from "firebase/auth";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../../utils/firebase/firebase.utils";

type Props = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: Props) {
  const nameId = useId();
  const emailId = useId();
  const passId = useId();
  const confirmId = useId();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const dn = displayName.trim();
    if (!dn) {
      setErrorMessage("Please enter a display name.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await createAuthUserWithEmailAndPassword(email.trim(), password);

      // Set auth profile first so UI reads displayName immediately
      await updateProfile(user, { displayName: dn });

      // Create user doc (include any default fields you want)
      await createUserDocumentFromAuth(user, {
        displayName: dn,
        role: "user",
      });

      setStatusMessage("Account created successfully.");
      onSuccess?.();

      // optional: keep fields or clear them
      setDisplayName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.code === "auth/email-already-in-use" ? "That email is already in use."
        : err?.code === "auth/invalid-email" ? "Please enter a valid email."
        : err?.code === "auth/weak-password" ? "Password is too weak."
        : err?.message || "Sign up failed.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="ds-auth-form" onSubmit={handleSignUp} aria-label="Sign up form">
      <div className="ds-field">
        <label className="ds-label" htmlFor={nameId}>Display Name</label>
        <input
          id={nameId}
          className="ds-input"
          type="text"
          autoComplete="nickname"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor={confirmId}>Confirm Password</label>
        <input
          id={confirmId}
          className="ds-input"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isLoading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
