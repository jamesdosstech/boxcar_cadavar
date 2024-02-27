import React, { useEffect, useState } from 'react'
import { db } from '../../utils/firebase/firebase.utils';
import { doc, docs, collection, getDocs } from 'firebase/firestore';

const DBUsers = () => {
  const [listUsers, setListUsers] = useState([])

  const fetchAll = async () => {
    // e.preventDefault();
    const userRef = collection(db, 'users');
    const snapshots = await getDocs(userRef)
    const documents = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data
    })
    setListUsers(documents);
  }

  useEffect(() => {
    fetchAll();
  }, [])

  return (
    <div>
      <h2>DBUsers</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Display Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {
            listUsers.map((user) => {
              return (
                  <tr key={user.id}>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                  </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default DBUsers