// message.component.tsx
import React from "react";
import "./message.styles.scss";

export type ChatMessage = {
  id?: string;
  uid?: string;
  displayName?: string | null;
  text: string;
  createdAt?: any; // Firestore Timestamp (type later if you want)
};

type Props = {
  message: ChatMessage;
  isOwnMessage: boolean;
};

export default function Message({ message, isOwnMessage }: Props): JSX.Element {
  const displayName = (message.displayName ?? "Anonymous").trim() || "Anonymous";
  const text = (message.text ?? "").toString();

  return (
    <div className={`ds-msg ${isOwnMessage ? "is-own" : "is-other"}`}>
      <div className="ds-msg__sender">{displayName}</div>
      <p className="ds-msg__text">{text}</p>
    </div>
  );
}

