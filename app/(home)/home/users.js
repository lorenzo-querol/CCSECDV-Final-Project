import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight
} from "react-icons/ai"

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/users', {
          params : {
            option: 1,
        },
      });
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
      <div className="flex">
        <div className="flex-1 m-2">
          <h2 className="px-4 py-2 text-2xl font-bold text-white">List of Users</h2>
        </div>
      </div>
      <hr className="border-indigo-600" />
      <div className="flex items-center my-2 text-base">
        {/* Table */}
        <table className="table w-full mx-auto text-center shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
            </tr>
          </thead>
          <tbody className='items-center justify-center w-full mx-auto'>
            <tr>
              <td className="px-4 py-2 border-b">name</td>
              <td className="px-4 py-2 border-b">email</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b">name</td>
              <td className="px-4 py-2 border-b">email</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b">name</td>
              <td className="px-4 py-2 border-b">email</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b">name</td>
              <td className="px-4 py-2 border-b">email</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b">name</td>
              <td className="px-4 py-2 border-b">email</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b">name</td>
              <td className="px-4 py-2 border-b">email</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center">
        {/* <!-- Help text --> */}
        <span class="text-sm text-indigo-700 dark:text-indigo-400">
          Showing <span class="font-semibold text-indigo-900 dark:text-white">1</span> to <span class="font-semibold text-indigo-900 dark:text-white">10</span> of <span class="font-semibold text-indigo-900 dark:text-white">100</span> Users
        </span>
        {/* <!-- Buttons --> */}
        <div class="inline-flex mt-2 xs:mt-0">
          <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-indigo-800 rounded-l hover:bg-indigo-900 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-700 dark:hover:text-white">
            <AiOutlineArrowLeft size={20} />
          </button>
          <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-indigo-800 border-0 border-l border-indigo-700 rounded-r hover:bg-indigo-900 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-700 dark:hover:text-white">
            <AiOutlineArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>

  );
}