import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/users');
        if (response.status === 200) {
          const data = response.data;
          setUsers(data.users);
        } else {
          console.error('Error retrieving users:', response.status);
        }
      } catch (error) {
        console.error('Error retrieving users:', error);
      }
    }

    fetchUsers();
  }, []);
  
  return (
    <div className='w-full'>
      <h1>List of Users</h1>
      <div className="flex items-center my-2 text-base ">
        <table className="w-full max-w-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}