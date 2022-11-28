import { getMessages } from '../utils/firebase/firebase.utils';
import { useState, useEffect } from 'react';

export const useMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = getMessages(setMessages);
        return unsubscribe;
    }, []);

    return messages
}