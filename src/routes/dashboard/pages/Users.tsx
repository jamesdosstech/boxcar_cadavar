import React, { useEffect, useState } from 'react';
import { db } from '../../../utils/firebase/firebase.utils';
import { collection, getDocs } from 'firebase/firestore';
import './Users.styles.scss'; // Ensure styles are included

interface User {
  id: string;
  displayName?: string;
  email?: string;
}

const DBUsers: React.FC = () => {
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const userRef = collection(db, 'users');
      const snapshots = await getDocs(userRef);
      const documents = snapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setListUsers(documents);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="users-container">
      <h2 className="users-title">User List</h2>

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th scope="col">Display Name</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {listUsers.length > 0 ? (
              listUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DBUsers;
