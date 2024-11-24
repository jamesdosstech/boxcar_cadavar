import { useState, useLayoutEffect, useRef } from "react";
import Button from "../button/button.component";
import { sendMessage } from "../../utils/firebase/firebase.utils";
import { useMessages } from "../../hooks/useMessages.hook";
import "./comment-container.styles.scss";
import Message from "../message/message.component";

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
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="comment-container">
      <div className="message-list-container" ref={containerRef}>
        <div className="message-list">
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const isOwnMessage = currentUser && message.uid === currentUser.uid;
              return (
                <Message
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              );
            })
          ) : (
            <p className="empty-state">No messages yet. Start the conversation!</p>
          )}
        </div>
      </div>
      <div>
        {currentUser && (
          <form className="input-container" onSubmit={handleOnSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={handleOnChange}
              placeholder="Type your message and press Enter"
              className="input-field"
            />
            <Button
              type="submit"
              className="send-button"
              disabled={!newMessage}
            >
              Send
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentContainer;
