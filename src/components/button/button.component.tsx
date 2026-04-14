// button.component.tsx
import React from "react";
import "./button.styles.scss";

type ButtonType = "default" | "splash" | "google" | "chat";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType?: ButtonType;
};

const BUTTON_TYPE_CLASSES: Record<ButtonType, string> = {
  default: "",
  splash: "splash-enter",       // keep old name for compatibility
  google: "google-sign-in",     // keep old name for compatibility
  chat: "chat-button",
};

export default function Button({
  children,
  buttonType = "default",
  className = "",
  ...otherProps
}: Props) {
  const variant = BUTTON_TYPE_CLASSES[buttonType] ?? "";

  return (
    <button
      {...otherProps}
      className={`button-container ${variant} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
