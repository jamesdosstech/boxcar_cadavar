const Message = ({ message, isOwnMessage }) => {
    const { displayName, text } = message;
    return (
        <li className={['message', isOwnMessage && 'own-message'].join(' ')}>
            <h4 className='sender'>{isOwnMessage ? 'You' : displayName}</h4>
            <div>
                <p style={{fontSize: '8px'}}>
                    {text}    
                </p>
            </div>
        </li>
    )
}

export default Message