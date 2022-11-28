// import { useEffect, useState, createContext } from "react";

// // import { getMessagesAndDocuments } from '../../utils/firebase/firebase.utils';

// export const MessagesContext = createContext({
//     messagesMap: []
// })

// export const MessagesProvider = ({children}) => {
//     const [messagesMap, setMessagesMap] = useState([]);
//     useEffect(() => {
//         const getMessagesMap = async () => {
//             // const messageMap = await getMessagesAndDocuments();
//             setMessagesMap(messageMap)
//         }
//         getMessagesMap();
//     },[messageMap])
//     const value = { messagesMap }
//     return (
//         <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
//     )
// }