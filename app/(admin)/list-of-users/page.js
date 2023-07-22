'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { BiSort, BiBlock } from 'react-icons/bi';

export default function Users() {
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState();
	const [limit, setLimit] = useState();
	const [totalPages, setTotalPages] = useState();
	const [totalUsers, setTotalUsers] = useState();
	const [status, setStatus] = useState('pending'); // Default status is 'pending'

	const handleNext = () => setPage((prevPage) => prevPage + 1);
	const handlePrev = () => setPage((prevPage) => prevPage - 1);

	// Function to handle sorting when the button is clicked
	const handleSortClick = (field) => {
		alert('Sort!');
	};

	// Function to handle status change
	const handleStatusChange = (event) => {
		setStatus(event.target.value);
	};

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

	if (!users) return <div>Fetching users...</div>;

	return (
		<div className="w-full h-full overflow-y-auto">
			{/* List of users */}
			<div className='h-1/2'>
				<div className="flex">
					<div className="flex-1 m-2">
						<h2 className="px-4 py-2 text-2xl font-bold text-white">List of Users</h2>
					</div>
				</div>
				<hr className="border-indigo-600" />
				{/* Table */}
				<div className="flex items-center my-2 text-base">
					<table className="table w-full mx-auto text-center shadow-md">
						<thead>
							<tr>
								<th className="w-1/2 px-4 py-2 border-b ">
									<div className='flex items-center justify-center'>
										Name
										<button onClick={() => handleSortClick('name')} className='flex justify-center'><BiSort size={20} /></button>
									</div>
								</th>
								<th className="w-1/2 px-4 py-2 border-b">
									<div className='flex items-center justify-center'>
										Email
										<button onClick={() => handleSortClick('email')} className='flex justify-center'><BiSort size={20} /></button>
									</div>
								</th>
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
				<div className="bottom-0 flex flex-col items-center">
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

			<hr className="border-4 border-indigo-800" />
			<div></div>

			{/* List of Reported Users */}
			<div className='h-1/2'>
				<div className="flex">
					<div className="flex-1 m-2">
						<h2 className="px-4 py-2 text-2xl font-bold text-white">List of Reported Users</h2>
					</div>
				</div>
				<hr className="border-indigo-600" />
				<div className="flex items-center my-2 text-base">
					{/* Table */}
					<table className="table w-full mx-auto text-center shadow-md">
						<thead>
							<tr>
								<th className="w-1/5 px-4 py-2 border-b ">
									<div className='flex items-center justify-center'>
										Name
										<button onClick={() => handleSortClick('name')} className='flex justify-center'><BiSort size={20} /></button>
									</div>
								</th>
								<th className="w-1/5 px-4 py-2 border-b">
									<div className='flex items-center justify-center'>
										Report
										<button onClick={() => handleSortClick('report')} className='flex justify-center'><BiSort size={20} /></button>
									</div>
								</th>
								<th className="w-1/5 px-4 py-2 border-b">
									<div className='flex items-center justify-center'>
										Report Status
										<button onClick={() => handleSortClick('status')} className='flex justify-center'><BiSort size={20} /></button>
									</div>
								</th>
								<th className="w-1/5 px-4 py-2 border-b">
									<div className='flex items-center justify-center'>
										Action
									</div>
								</th>
								<th className="w-1/5 px-4 py-2 border-b">
									<div className='flex items-center justify-center'>
										Cooldown
									</div>
								</th>
							</tr>
						</thead>
						<tbody className="items-center justify-center w-full mx-auto">
							<tr >
								<td className="px-4 py-2 border-b">name</td>
								<td className="px-4 py-2 border-b">description</td>
								<td className="px-4 py-2 border-b">
									<div className="flex items-center justify-center">
										<select
											id="status"
											name="status"
											className="px-2 py-1 bg-indigo-500 rounded-md"
										>
											<option value="pending">Pending</option>
											<option value="approved">Approved</option>
											<option value="disapproved">Disapproved</option>
										</select>
									</div>
								</td>
								<td className="items-center px-4 py-2 border-b">
									<div className='flex items-center justify-center '>
										<button className='flex justify-center p-2 rounded-r hover:bg-indigo-500'>
											<BiBlock size={20} />
											Timeout
										</button>
									</div>

								</td>
								<td className="px-4 py-2 border-b">countdown</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex flex-col items-center">
					{/* Help text */}
					<span className="text-sm text-indigo-700 dark:text-indigo-400">
						Showing{' '}
						<span className="font-semibold text-indigo-900 dark:text-white">
							{/* {Math.min((page - 1) * limit + 1, totalReports)} */}
							N
						</span>{' '}
						to <span className="font-semibold text-indigo-900 dark:text-white">
							{/* {Math.min(page * limit, totalReports)} */} N
						</span>{' '}
						of <span className="font-semibold text-indigo-900 dark:text-white">
							{/* {totalReports} */}
						</span> Reported Users
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
		</div>
	);
}
