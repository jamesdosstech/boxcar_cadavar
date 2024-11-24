import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase/firebase.utils';
import { collection, getDocs } from 'firebase/firestore';
import './DBUsers.styles.scss'; // Assuming you have a styles file for this page.

const DBUsers = () => {
  const [listUsers, setListUsers] = useState([]);

  const fetchAll = async () => {
    const userRef = collection(db, 'users');
    const snapshots = await getDocs(userRef);
    const documents = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setListUsers(documents);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="users-container">
      <h2 className="users-title">User List</h2>
      <table className="table users-table">
        <thead>
          <tr>
            <th scope="col">Display Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {listUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DBUsers;
