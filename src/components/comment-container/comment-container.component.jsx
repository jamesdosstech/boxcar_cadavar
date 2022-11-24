import { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../context/user/user.context';
import { MessagesContext } from '../../context/messages/messages.context'
import {getMessagesAndDocuments} from '../../utils/firebase/firebase.utils'

const CommentContainer = ({ currentUser }) => {
    const { messagesMap } = useContext(MessagesContext);

    const { displayName } = currentUser

    console.log('messagesMap: ', messagesMap);

    const [messages, setMessages] = useState(messagesMap);

    const [newMessage, setNewMessage] = useState('');

    const handleOnChange = (e) => {
        setNewMessage(e.target.value)
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();

        const trimmedMessage = newMessage.trim();
        if(trimmedMessage) {
            messagesMap.push({
                text: trimmedMessage
            });
            setNewMessage('');
        }
    }

    useEffect(() => {
        setMessages(messagesMap)
    },[messagesMap])
    return (
        <div>
            <div>
            {
                messages && messages.map((message) => {
                    console.log(message.text);
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