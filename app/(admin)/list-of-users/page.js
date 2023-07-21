'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

export default function Users() {
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState();
	const [limit, setLimit] = useState();
	const [totalPages, setTotalPages] = useState();
	const [totalUsers, setTotalUsers] = useState();

	const handleNext = () => setPage((prevPage) => prevPage + 1);
	const handlePrev = () => setPage((prevPage) => prevPage - 1);

	useEffect(() => {
		const fetchUsers = async (page) => {
			try {
				const res = await fetch(`http://localhost:3000/api/users?page=${page}`, {
					cache: 'no-store',
				});

				const { data } = await res.json();
				setUsers(data.users);
				setLimit(data.limit);
				setTotalPages(data.totalPages);
				setTotalUsers(data.totalUsers[0].count);
			} catch (error) {
				console.log('Something went wrong:', error.message);
			}
		};

		fetchUsers(page);
	}, [page]);

	// Pagination
	// const totalItems = users.length;
	// const totalPages = Math.ceil(totalItems / itemsPerPage);
	// const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
	// const indexOfFirstItem = Math.min(
	//     indexOfLastItem - itemsPerPage,
	//     totalItems
	// );
	// const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

	if (!users) return <div>Fetching users...</div>;

	return (
		<div className="w-full">
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
							<th className="w-1/2 px-4 py-2 border-b">Name</th>
							<th className="w-1/2 px-4 py-2 border-b">Email</th>
						</tr>
					</thead>
					<tbody className="items-center justify-center w-full mx-auto">
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-4 py-2 border-b">{user.name}</td>
								<td className="px-4 py-2 border-b">{user.email}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex flex-col items-center">
				{/* Help text */}
				<span className="text-sm text-indigo-700 dark:text-indigo-400">
					Showing{' '}
					<span className="font-semibold text-indigo-900 dark:text-white">
						{Math.min((page - 1) * limit + 1, totalUsers)}
					</span>{' '}
					to <span className="font-semibold text-indigo-900 dark:text-white">{Math.min(page * limit, totalUsers)}</span>{' '}
					of <span className="font-semibold text-indigo-900 dark:text-white">{totalUsers}</span> Users
				</span>
				{/* Buttons */}
				<div className="inline-flex mt-2 xs:mt-0">
					<button
						className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-indigo-800 rounded-l hover:bg-indigo-900 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-700 dark:hover:text-white"
						onClick={handlePrev}
						disabled={page === 1}
					>
						<AiOutlineArrowLeft size={20} />
					</button>
					<button
						className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-indigo-800 border-0 border-l border-indigo-700 rounded-r hover:bg-indigo-900 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-700 dark:hover:text-white"
						onClick={handleNext}
						disabled={page === totalPages}
					>
						<AiOutlineArrowRight size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
