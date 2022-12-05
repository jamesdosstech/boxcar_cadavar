const Message = ({ message, isOwnMessage }) => {
    const { displayName, text } = message;
    return (
        <li className={['message', isOwnMessage && 'own-message'].join(' ')}>
            <h5 className='sender'>{isOwnMessage ? 'You' : displayName}</h5>
            <div>
                <p style={{fontSize: '12px'}}>
                    {text}    
                </p>
            </div>
        </li>
    )
}

export default Message