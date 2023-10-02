import { useState, useLayoutEffect, useRef } from "react";

import Button from "../button/button.component";

import { sendMessage } from "../../utils/firebase/firebase.utils";
import { useMessages } from "../../hooks/useMessages.hook";

import "./comment-container.styles.scss";

import Message from "../message/message.component";

const CommentContainer = ({ currentUser }) => {
  // const { messagesMap } = useContext(MessagesContext);
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
      containerRef.current.scrollTop = containerRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  return (
    <div className="comment-container">
      <div className="message-list-container" ref={containerRef}>
        <div className="message-list">
          {currentUser
            ? messages &&
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isOwnMessage={message.uid === currentUser.uid}
                ></Message>
              ))
            : messages &&
              messages.map((message) => (
                <Message key={message.id} message={message}></Message>
              ))}
        </div>
      </div>
      <div>
        {currentUser ? (
          <div>
            <form className="input-container" onSubmit={handleOnSubmit}>
              <input
                type="text"
                value={newMessage}
                onChange={handleOnChange}
                placeholder="Type your message enter"
                className="input-container"
              />
              <Button
                type="submit"
                style={{
                  borderRadius: "0px",
                  height: "42px",
                  width: "64px",
                  fontSize: "10px",
                  border: "none",
                }}
                disabled={!newMessage}
              >
                Send
              </Button>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CommentContainer;
