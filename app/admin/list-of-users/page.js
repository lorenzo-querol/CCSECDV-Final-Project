"use client";

import {
	AiOutlineArrowLeft,
	AiOutlineArrowRight,
	AiFillEye,
} from "react-icons/ai";
import { BiSort } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserLogs from "@/app/components/UserLogs";

export default function Users() {
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState();
	const [limit, setLimit] = useState();
	const [totalPages, setTotalPages] = useState();
	const [totalUsers, setTotalUsers] = useState();
	const [sortBy, setSortBy] = useState("name"); // Default sort by is 'name'
	const [sortOrder, setSortOrder] = useState("ASC"); // Default sort order is 'ASC'
	const [showLogs, setShowLogs] = useState(false);

	const handleNext = () => setPage((prevPage) => prevPage + 1);
	const handlePrev = () => setPage((prevPage) => prevPage - 1);

	// Function to handle sorting when the sort button is clicked
	const handleSortClick = (field) => {
		setSortBy(field);
		setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
	};

	const showLogsModal = () => {
		setShowLogs(true);
	}

	const fetchUsers = async (page, sortBy, sortOrder) => {
		try {
			const res = await fetch(
				`/api/users?page=${page}&sortby=${sortBy}&order=${sortOrder}`,
				{
					cache: "no-store",
				},
			);

			const { data } = await res.json();
			setUsers(data.users);
			setLimit(data.limit);
			setTotalPages(data.totalPages);
			setTotalUsers(data.totalUsers);
		} catch (error) {
			console.log("Something went wrong:", error.message);
		}
	};

	useEffect(() => {
		fetchUsers(page, sortBy, sortOrder);
	}, [page, sortBy, sortOrder]);

	if (!users) return <div>Fetching users...</div>;

	return (
		<>
			<div className="w-full h-full overflow-y-auto">
				{/* List of users */}
				<div className="h-1/2">
					<div className="flex">
						<div className="flex-1 m-2">
							<h2 className="px-4 py-2 text-2xl font-bold text-white">
								List of Users
							</h2>
						</div>
					</div>
					<hr className="border-indigo-600" />
					{/* Table */}
					<div className="flex items-center my-2 text-base">
						<table className="table w-full mx-auto text-center shadow-md">
							<thead>
								<tr>
									<th className="w-1/3 px-4 py-2 border-b ">
										<div className="flex items-center justify-center">
											Name
											<button
												onClick={() => handleSortClick("name")}
												className="flex justify-center"
											>
												<BiSort size={20} />
											</button>
										</div>
									</th>
									<th className="w-1/3 px-4 py-2 border-b">
										<div className="flex items-center justify-center">
											Email
											<button
												onClick={() => handleSortClick("email")}
												className="flex justify-center"
											>
												<BiSort size={20} />
											</button>
										</div>
									</th>
									<th className="w-1/3 px-4 py-2 border-b">
										<div className="flex items-center justify-center">
											Logs
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="items-center justify-center w-full mx-auto">
								{users.map((user, index) => (
									<tr key={index}>
										<td className="px-4 py-2 border-b">{user.name}</td>
										<td className="px-4 py-2 border-b">{user.email}</td>
										<td className="px-4 py-2 border-b">
											<div className="flex justify-center " onClick={showLogsModal}>
												<AiFillEye size={20} className="rounded hover:bg-indigo-500" />
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="bottom-0 flex flex-col items-center">
						{/* Help text */}
						<span className="text-sm text-indigo-700 dark:text-indigo-400">
							Showing{" "}
							<span className="font-semibold text-indigo-900 dark:text-white">
								{Math.min((page - 1) * limit + 1, totalUsers)}
							</span>{" "}
							to{" "}
							<span className="font-semibold text-indigo-900 dark:text-white">
								{Math.min(page * limit, totalUsers)}
							</span>{" "}
							of{" "}
							<span className="font-semibold text-indigo-900 dark:text-white">
								{totalUsers}
							</span>{" "}
							Users
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

			{showLogs && <UserLogs onClose={() => setShowLogs(false)} />}

		</>
	);
}
