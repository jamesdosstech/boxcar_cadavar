const Message = ({ message, isOwnMessage }) => {
    const { displayName, text } = message;
    return (
        <div className={['message', isOwnMessage && 'own-message'].join(' ')}>
            <h5 className='sender'>{isOwnMessage ? displayName : displayName}</h5>
            <div>
                <p style={{fontSize: '12px'}}>
                    {text}    
                </p>
            </div>
        </div>
    )
}

export default Message