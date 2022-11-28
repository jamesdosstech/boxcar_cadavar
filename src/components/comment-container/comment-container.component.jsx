import { useContext, useState, useEffect } from 'react';

import { MessagesContext } from '../../context/messages/messages.context'
import {sendMessage} from '../../utils/firebase/firebase.utils'

const CommentContainer = ({ currentUser }) => {
    const { messagesMap } = useContext(MessagesContext);

    console.log('currentuser: ', currentUser)

    console.log('messagesMap: ', messagesMap);

    const [messages, setMessages] = useState(messagesMap);

    const [newMessage, setNewMessage] = useState('');

    const handleOnChange = (e) => {
        setNewMessage(e.target.value)
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        sendMessage(currentUser, newMessage);
        setNewMessage('');
    }

    useEffect(() => {
        const unsubscribe = setMessages(messagesMap);
        return unsubscribe
    },[messagesMap])

    return (
        <div>
            <div>
            {
                messages && messages.map((message) => {
                    return (
                        <div key={message.id}>{message.text}</div>
                    )
                })
            }    
            </div>
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
    )
}

export default CommentContainer