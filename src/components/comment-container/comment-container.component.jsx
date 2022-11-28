import { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react';

import { MessagesContext } from '../../context/messages/messages.context'
import {sendMessage} from '../../utils/firebase/firebase.utils';
import {useMessages } from '../../hooks/useMessages.hook';
import {UserContext} from '../../context/user/user.context'

import './comment-container.styles.scss';

const Message = ({ message, isOwnMessage }) => {
    const { displayName, text } = message;
    return (
        <li className={['message', isOwnMessage && 'own-message'].join(' ')}>
            <h4 className='sender'>{isOwnMessage ? 'You' : displayName}</h4>
            <div>{text}</div>
        </li>
    )
}

const CommentContainer = ({ currentUser }) => {
    // const { messagesMap } = useContext(MessagesContext);
    const messages = useMessages();

    const containerRef = useRef(null)

    const [newMessage, setNewMessage] = useState('');

    const handleOnChange = (e) => {
        setNewMessage(e.target.value)
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        sendMessage(currentUser, newMessage);
        setNewMessage('');
    }

    useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    })

    return (
        <div>
        <div className='message-list-container' >
            <ul className='message-list'>
            {
                messages && messages.map((message) => (
                    <Message key={message.id} message={message} isOwnMessage={message.uid === currentUser.uid}></Message>
                ))
            }    
            </ul>
        </div>
        <div>
            <form onSubmit={handleOnSubmit}>
                <input
                    type='text'
                    value={newMessage}
                    onChange={handleOnChange}
                    placeholder="Type your message enter"
                />
                <button
                    type='submit'
                    disabled={!newMessage}
                >
                    Send
                </button>
            </form>
        </div>
        </div>
    )
}

export default CommentContainer