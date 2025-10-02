import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase.utils";

export const getNextFridayAt6PM = () => {
  const date = new Date();
  const nextFriday = new Date(
    date.setDate(date.getDate() + ((2 - date.getDay() + 7) % 7 || 7))
  );
  nextFriday.setHours(18, 0, 0, 0); // set for 6pm
  return nextFriday.getTime();
};

export const deleteAllChats = async () => {
  const snapshot = await getDocs(collection(db, 'messages'));

  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref)
  }

  console.log(`Deleted ${snapshot.size} chat messages.`)
}
