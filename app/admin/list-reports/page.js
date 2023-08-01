"use client";

import {
	AiFillCheckCircle,
	AiFillCloseCircle,
	AiOutlineArrowLeft,
	AiOutlineArrowRight,
} from "react-icons/ai";
import { BiBlock, BiSort } from "react-icons/bi";
import React, { useEffect, useState } from "react";

import Loading from "@/app/components/Loading";
import { useRouter } from "next/router";

export default function ReportedUsers() {
	const [page, setPage] = useState(1);
	const [reports, setReports] = useState();
	const [limit, setLimit] = useState();
	const [totalPages, setTotalPages] = useState();
	const [totalReports, setTotalReports] = useState();

	const [sortBy, setSortBy] = useState("name"); // Default sort by is 'name'
	const [sortOrder, setSortOrder] = useState("ASC"); // Default sort order is 'ASC'
	const [timeValue, setTimeValue] = useState(""); // State to handle the time input value
	const [timeUnit, setTimeUnit] = useState("minutes"); // State to handle the selected time unit

	const handleNext = () => setPage((prevPage) => prevPage + 1);
	const handlePrev = () => setPage((prevPage) => prevPage - 1);

	// Function to handle sorting when the sort button is clicked
	const handleSortClick = (field) => {
		setSortBy(field);
		setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
	};

	// Function to handle time input and dropdown changes
	const handleTimeChange = (event) => {
		if (event.target.name === "timeValue") {
			setTimeValue(event.target.value);
		} else if (event.target.name === "timeUnit") {
			setTimeUnit(event.target.value);
		}
	};

	const handleNameClick = () => {
		alert("Go to userProfile");
		// router.push('/userProfile_report'); // Change the path to the appropriate route
	};

	const fetchReports = async (page, sortBy, sortOrder) => {
		try {
			const res = await fetch(
				`/api/reports?page=${page}&sortby=${sortBy}&order=${sortOrder}`,
				{
					cache: "no-store",
				},
			);

			const { data } = await res.json();

			setReports(data.reports);
			setLimit(data.limit);
			setTotalPages(data.totalPages);
			setTotalReports(data.totalReports);
		} catch (error) {
			console.log("Something went wrong:", error.message);
		}
	};

	useEffect(() => {
		fetchReports(page, sortBy, sortOrder);
	}, [page, sortBy, sortOrder]);

	if (!reports) return <Loading />;

	return (
		<div
			div
			className="w-full h-full overflow-y-auto"
		>
			<div className="h-1/2">
				<div className="flex">
					<div className="flex-1 m-2">
						<h2 className="px-4 py-2 text-2xl font-bold text-white">
							List of Reported Users
						</h2>
					</div>
				</div>
				<hr className="border-indigo-600" />
				<div className="flex items-center my-2 text-base">
					{/* Table */}
					<table className="table w-full mx-auto text-center shadow-md">
						<thead>
							<tr>
								<th className="w-1/6 px-4 py-2 border-b ">
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
								<th className="w-1/6 px-4 py-2 border-b">
									<div className="flex items-center justify-center">
										Report
										<button
											onClick={() => handleSortClick("report")}
											className="flex justify-center"
										>
											<BiSort size={20} />
										</button>
									</div>
								</th>
								<th className="w-1/6 px-4 py-2 border-b">
									<div className="flex items-center justify-center">
										Report Status
										<button
											onClick={() => handleSortClick("status")}
											className="flex justify-center"
										>
											<BiSort size={20} />
										</button>
									</div>
								</th>
								<th className="w-1/6 px-4 py-2 border-b">
									<div className="flex items-center justify-center">
										Set Cooldown
									</div>
								</th>
								<th className="w-1/6 px-4 py-2 border-b">
									<div className="flex items-center justify-center">
										Cooldown
									</div>
								</th>
								<th className="w-1/6 px-4 py-2 border-b">
									<div className="flex items-center justify-center">Action</div>
								</th>
							</tr>
						</thead>
						<tbody className="items-center justify-center w-full mx-auto"></tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex flex-col items-center">
					{/* Help text */}
					<span className="text-sm text-indigo-700 dark:text-indigo-400">
						Showing{" "}
						<span className="font-semibold text-indigo-900 dark:text-white">
							{/* {Math.min((page - 1) * limit + 1, totalReports)} */}N
						</span>{" "}
						to{" "}
						<span className="font-semibold text-indigo-900 dark:text-white">
							{/* {Math.min(page * limit, totalReports)} */} N
						</span>{" "}
						of{" "}
						<span className="font-semibold text-indigo-900 dark:text-white">
							{/* {totalReports} */}
						</span>{" "}
						Reported Users
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
