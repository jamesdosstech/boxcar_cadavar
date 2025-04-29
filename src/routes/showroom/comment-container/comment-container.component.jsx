import { useState, useLayoutEffect, useRef } from "react";
import Button from "../../../components/button/button.component";
import { sendMessage } from "../../../utils/firebase/firebase.utils";
import { useMessages } from "../../../hooks/useMessages.hook";
import "./comment-container.styles.scss";
import Message from "./message/message.component";
import { Link } from "react-router-dom";

const CommentContainer = ({ currentUser }) => {
  const messages = useMessages();
  const containerRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    sendMessage(currentUser, newMessage);
    setNewMessage("");
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      // containerRef.current.scrollTop = 0;
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="message-list-container" ref={containerRef}>
        <div className="message-list">
          {messages && messages.length > 0 ? (
            messages
              .slice()
              .reverse()
              .map((message) => {
                const isOwnMessage =
                  currentUser && message.uid === currentUser.uid;
                return (
                  <Message
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage}
                  />
                );
              })
          ) : (
            <p className="empty-state">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>
      </div>
      {
        currentUser ? (
          <form className="input-container" onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={handleOnChange}
          placeholder="Type your message and press Enter"
          className="input-field"
        />
        <Button type="submit" className="send-button" disabled={!newMessage}>
          Send
        </Button>
      </form>
        ) : (
          <div>
            <p>Please <span><Link to={'/sign-in'}>Sign In to Join the Conversation</Link></span></p>
          </div>
        )
      }
      
    </div>
  );
};

export default CommentContainer;
