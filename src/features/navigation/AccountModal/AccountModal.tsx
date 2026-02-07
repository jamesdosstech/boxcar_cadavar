import React, { useEffect, useId, useRef, useState } from "react";
import "./AccountModal.styles.scss";

import { collection, getDocs, query, where } from "firebase/firestore";
import { updatePassword, User } from "firebase/auth";

import { db, reauthenticateUserWithPassword, signOutUser, updateUserName } from "../../../utils/firebase/firebase.utils";

import SignInForm from "../../../features/authentication/sign-in-form/sign-in-form.component";
import SignUpForm from "../../../features/authentication/sign-up-form/sign-up-form.component";
import StepLayout from "./StepLayout.component";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Props = {
  onClose: () => void;
  currentUser: User | null;
  step?: number;
  setStep?: React.Dispatch<React.SetStateAction<Step>>;
};

export default function AccountModal({ onClose, currentUser, step, setStep }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [newUsername, setNewUsername] = useState(currentUser?.displayName ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // (not used yet — see note below)
  const [error, setError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Focus management + Escape close
  useEffect(() => {
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // simple focus trap (minimal but effective)
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSignOut = () => {
    signOutUser();
    setStep?.(4);
  };

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const next = newUsername.trim();
    if (!next) return setError("Username cannot be empty.");
    if (next === currentUser?.displayName) return setError("That’s already your current username.");

    setIsUpdating(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", next));
      const snap = await getDocs(q);

      if (!snap.empty) {
        setError("That username is already taken. Please choose another.");
        return;
      }

      await updateUserName(next);
      setConfirmationMessage("✅ Username updated successfully!");
      setStep?.(6);
    } catch (err) {
      setError("Failed to update username.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      setError("You must be signed in to change your password.");
      return;
    }

    if (!currentPassword) return setError("Please enter your current password.");
    if (!newPassword) return setError("Please enter a new password.");

    setIsUpdating(true);
    try {
      await reauthenticateUserWithPassword(currentUser, currentPassword);
      await updatePassword(currentUser, newPassword);
      setConfirmationMessage("✅ Password updated successfully!");
      setStep?.(6);
    } catch (err: any) {
      const msg =
        err?.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : err?.code === "auth/too-many-requests"
          ? "Too many attempts. Try again later."
          : err?.code === "auth/requires-recent-login"
          ? "Please sign in again and retry changing your password."
          : "Failed to update password.";
      setError(msg);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div
      className="ds-modal-backdrop"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ds-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="ds-modal-header">
          <h2 id={titleId} className="ds-modal-title">
            Account
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="ds-icon-button"
            onClick={onClose}
            aria-label="Close account dialog"
          >
            ✕
          </button>
        </div>

        {error && <p className="ds-error" role="alert">{error}</p>}

        {currentUser && step === 1 && (
          <StepLayout>
            <h3 className="ds-center">Welcome {currentUser?.displayName ?? "User"}</h3>
            <button className="ds-btn" type="button" onClick={handleSignOut}>
              Sign Out
            </button>
            <button className="ds-btn" type="button" onClick={() => setStep?.(2)}>
              Change Username
            </button>
            <button className="ds-btn" type="button" onClick={() => setStep?.(3)}>
              Change Password
            </button>
            <button className="ds-btn ds-btn-ghost" type="button" onClick={onClose}>
              Close
            </button>
          </StepLayout>
        )}

        {step === 2 && (
          <StepLayout>
            <form onSubmit={handleUsernameChange}>
              <label className="ds-label">
                New username
                <input
                  className="ds-input"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  autoComplete="nickname"
                  required
                />
              </label>

              <div className="ds-row">
                <button className="ds-btn" type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </button>
                <button
                  className="ds-btn ds-btn-ghost"
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep?.(1);
                  }}
                >
                  Back
                </button>
              </div>
            </form>
          </StepLayout>
        )}

        {step === 3 && (
          <StepLayout>
            <form onSubmit={handlePasswordChange}>
              <label className="ds-label">
                Current password
                <input
                  className="ds-input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              <label className="ds-label">
                New password
                <input
                  className="ds-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>

              <div className="ds-row">
                <button className="ds-btn" type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Password"}
                </button>
                <button
                  className="ds-btn ds-btn-ghost"
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep?.(2);
                  }}
                >
                  Back
                </button>
              </div>
            </form>
          </StepLayout>
        )}
        {step === 4 && (
          <StepLayout>
            <h3 className="ds-center">Sign In</h3>
            <SignInForm onClose={onClose} />
            <p className="ds-center">
              Create an account{" "}
              <button className="ds-link-btn" type="button" onClick={() => setStep?.(5)}>
                Sign Up
              </button>
            </p>
          </StepLayout>
        )}
        {step === 5 && (
          <StepLayout>
            <h3 className="ds-center">Sign Up</h3>
            <SignUpForm
              onSuccess={() => {
                setConfirmationMessage("Account created successfully!");
                setStep?.(6);
              }}
            />
            <p className="ds-center">
              Already have an account?{" "}
              <button className="ds-link-btn" type="button" onClick={() => setStep?.(4)}>
                Sign In
              </button>
            </p>
          </StepLayout>
        )}
        {step === 6 && (
          <StepLayout>
            <h3 className="ds-center">{confirmationMessage}</h3>
            <button className="ds-btn" type="button" onClick={() => setStep?.(1)}>
              Continue
            </button>
          </StepLayout>
        )}
      </div>
    </div>
  );
}
