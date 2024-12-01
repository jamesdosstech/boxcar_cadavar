const Message = ({ message, isOwnMessage }) => {
    const { displayName, text } = message;
  
    return (
      <div className={`message ${isOwnMessage ? "own-message" : "other-message"}`}>
        <h5 className="sender">{displayName}</h5>
        <p>{text}</p>
      </div>
    );
  };
  
  export default Message;
  