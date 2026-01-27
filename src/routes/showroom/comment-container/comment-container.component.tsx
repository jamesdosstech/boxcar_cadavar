// comment-container.component.tsx
import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button/button.component";
import { sendMessage } from "../../../utils/firebase/firebase.utils";
import { useMessages } from "../../../hooks/useMessages.hook";
import Message, { type ChatMessage } from "./message/message.component";
import "./comment-container.styles.scss";

type AuthUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
} | null;

type Props = {
  currentUser: AuthUser;
};

export default function CommentContainer({ currentUser }: Props): JSX.Element {
  const messages = useMessages() as ChatMessage[]; // if your hook isn't typed yet
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const trimmed = newMessage.trim();
    if (!trimmed) return;

    sendMessage(currentUser, trimmed);
    setNewMessage("");
  };

  // Auto-scroll only if user is already near the bottom
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceFromBottom < 120; // px threshold

    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="ds-chat" aria-label="Live chat">
      <div className="ds-chat__header">
        <div className="ds-chat__title">Chat</div>
        <div className="ds-chat__meta">
          {messages?.length ? `${messages.length} msg` : "No messages yet"}
        </div>
      </div>

      <div className="ds-chat__list" ref={containerRef}>
        <div className="ds-chat__listInner">
          {messages && messages.length > 0 ? (
            messages
              .slice()
              .reverse()
              .map((message) => {
                const isOwnMessage = !!currentUser && message.uid === currentUser.uid;
                return (
                  <Message
                    key={message.id ?? `${message.uid ?? "u"}_${message.createdAt ?? Math.random()}`}
                    message={message}
                    isOwnMessage={isOwnMessage}
                  />
                );
              })
          ) : (
            <p className="ds-chat__empty">No messages yet. Start the conversation!</p>
          )}
        </div>
      </div>

      {currentUser ? (
        <form className="ds-chat__composer" onSubmit={handleOnSubmit}>
          <input
            className="ds-chat__input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message…"
            aria-label="Message"
            autoComplete="off"
          />
          <Button buttonType="chat" type="submit" className="ds-chat__send" disabled={!newMessage.trim()}>
            Send
          </Button>
        </form>
      ) : (
        <div className="ds-chat__authGate">
          <p>
            Please <Link to="/sign-in">Sign In</Link> to join the conversation.
          </p>
        </div>
      )}
    </section>
  );
}
