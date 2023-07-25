"use client";

import {
	AiFillCloseCircle,
	AiFillHeart,
	AiOutlineClose,
	AiOutlineHeart,
	AiOutlineMessage,
} from "react-icons/ai";
// Icons
import {
	BiDotsVerticalRounded,
	BiImage,
	BiSearch,
	BiVideoPlus,
} from "react-icons/bi";
import React, { useState } from "react";

import { BsFillExclamationTriangleFill } from "react-icons/bs";
import Date from "@/component/date";
import Image from "next/image";
import control from "@/public/control.png";
import sanitize from "sanitize-html";
import sanitizeHtml from "sanitize-html";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

// import pic from "@/posts/Zoom Background 2.png";   // temp

export default function Home() {
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isLiked, setIsLiked] = useState(false); // State to track heart fill
	const [showDropdown, setShowDropdown] = useState(false); // Dropdown
	const [showReportModal, setShowReportModal] = useState(false);
	const [reportReason, setReportReason] = useState("");
	const [posts, setPosts] = useState(null);
	const { data: session, status } = useSession();

	async function fetchData() {
		try {
			const res = await fetch("/api/posts", {
				method: "GET",
			});
			const { data } = await res.json();
			setPosts(data);
		} catch (error) {
			console.log(error.message);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	// Function to handle image selection
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Function to handle remove button click
	const handleRemoveImage = () => {
		setImagePreview(null);
	};

	// Function to handle heart icon click
	const handleLike = (postId) => {
		setIsLiked((prevIsLiked) => ({
		  ...prevIsLiked,
		  [postId]: !prevIsLiked[postId],
		}));
		if (isLiked[postId]) { 
			console.log("POST id:" + postId + " has -1 heart")
		  } else {
			console.log("POST id:" + postId + " has +1 heart")
		  }
	  };

	// Function to show dropdown
	const toggleDropdown = (postId) => {
		console.log("Selected Post ID: " + postId)
		Object.keys(showDropdown).forEach((key) => {
			if (key !== postId) {
			  setShowDropdown((prevShowDropdown) => ({
				...prevShowDropdown,
				[key]: false,
			  }));
			}
	  })
	  // this segment basically just hides the currently selected dropdown 
	  setShowDropdown((prevShowDropdown) => ({
		...prevShowDropdown,
		[postId]: !prevShowDropdown[postId],
	  }));
	};

	
	const handleReportChange = (event) => {
		setReportReason(event.target.value);
	};
	async function fetchUserData(userID) {
		// Data to display current user name and avatar
		const url = "api/users/" + userID;
		const res = await fetch(url, {
			method: "GET",
		});
		const data = await res.json();
		return data;
	}
	async function getSesh() {
		if (session) {
			const userDATA = await fetchUserData(session.user.user_id);
			return [userDATA, session.user.user_id];
		} else {
			const sessionGET = await getSession();
			const userGETDATA = await fetchUserData(sessionGET.user.user_id);
			return [userGETDATA, sessionGET.user.user_id];
		}
	}

	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		const postText = sanitizeHtml(e.target.elements["post-textarea"].value); // Extract post text from the form
		try {
			const sessionOBJ = await getSesh();

			const fname = sessionOBJ[0].data.first_name;
			const lname = sessionOBJ[0].data.last_name;
			const user_id = sessionOBJ[1];

			const res = await fetch(`api/posts`, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				method: "POST",
				body: JSON.stringify({
					description: postText,
					avatar: imagePreview,
					user_id: user_id,
					name: fname + ' ' + lname,
					image : imagePreview
				}),
			});
			const data = await res.json();
		} catch (error) {
			console.log(error.message);
		}
	};

	if (!posts) return <div>Fetching posts...</div>;

	return (
		<>
			<div className="flex flex-row h-full overflow-y-auto">
				{/* Middle */}
				<div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
					<div className="flex">
						<div className="flex-1 m-2">
							<h2 className="px-4 py-2 text-2xl font-bold text-white">Home</h2>
						</div>
					</div>
					<hr className="border-gray-600" />

					{/* Creat posts */}
					<form onSubmit={handleSubmit}>
						<div className="flex py-2">
							<div className="w-10 py-1 m-2">
								<Image
									className="inline-block w-10 h-10 rounded-full"
									src={control}
									alt=""
								/>
							</div>
							<div className="flex-1 px-2 pt-2 mt-2">
								<textarea
									className="w-full text-lg font-medium text-gray-400 bg-transparent"
									rows="2"
									cols="50"
									name="post-textarea" // Give the textarea a name
									placeholder="What's happening?"
								></textarea>
								{/* Image Preview */}
								{imagePreview && (
									<div className="relative mt-2">
										<button
											onClick={handleRemoveImage}
											className="absolute top-0 right-0 p-2 text-red-500"
										>
											<AiFillCloseCircle size={25} />
										</button>
										<img
											src={imagePreview}
											alt="Image Preview"
											className="w-full max-h-64"
										/>
									</div>
								)}
							</div>
						</div>
						{/* Create posts icons */}
						<div className="flex">
							<div className="w-10"></div>
							<div className="w-64 px-2">
								{/* Icons */}
								<div className="flex items-center">
									{/* Upload image */}
									<div className="flex items-center p-1 m-2">
										<label
											htmlFor="upload-image"
											className="flex items-center p-2 mt-1 text-base font-medium leading-6 text-indigo-400 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
										>
											<BiImage
												size={25}
												className="flex items-center"
											/>
										</label>
										<input
											id="upload-image"
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageChange} // Add onChange event here
										/>
									</div>
								</div>
							</div>

							{/* Post Button */}
							<div className="flex-1">
								<button
									type="submit" // Set the button type to submit
									className="float-right px-8 py-2 mt-5 mr-8 font-bold text-white bg-indigo-400 rounded-full hover:bg-indigo-600"
								>
									Post
								</button>
							</div>
						</div>
					</form>

					<hr className="border-4 border-indigo-800" />
					<div></div>

					{/* List of posts */}
					<ul className="list-none">
						{/* Post */}
						{posts.map((post, index) => (
							<li
								key={index}
								className="border-b-2 border-gray-600 "
							>
								<div className="flex flex-shrink-0 p-4 ">
									<div className="flex-grow">
										{/* Post: header */}
										<div className="flex items-center justify-between ">
											<div className="flex items-center">
												{/* Image profile */}
												<div>
													<Image
														className="inline-block w-10 h-10 rounded-full"
														src={post.avatar}
														alt=""
													/>
												</div>
												{/* Details */}

												<div className="ml-3">
													<p className="text-base font-medium leading-6 text-white">
														{post.name}
														<span className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300">
															&nbsp;&nbsp; • &nbsp;&nbsp;
															<Date dateString={post.date_created} />
														</span>
													</p>
												</div>
											</div>
										</div>
									</div>
									{/* Only show if its the user's post */}
									{/* Dropdown icon */}
									<div className="relative">
										<div className="flex items-center flex-shrink-0 ml-auto">
											<BiDotsVerticalRounded
												size={25}
												onClick={() => toggleDropdown(post.post_id)}
											/>
										</div>
										{showDropdown[post.post_id] && (
											<div className="absolute right-0 w-32 mt-2 bg-white rounded shadow-md z-35">
												<button
													onClick={() => {
														alert("Delete clicked!");
													}}
													className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-red-500 hover:text-white"
												>
													Delete
												</button>
												<button
													onClick={() => {
														alert("Edit clicked!");
													}}
													className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-yellow-500 hover:text-white"
												>
													Edit
												</button>
												<button
													className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-blue-500 hover:text-white"
													onClick={() => setShowReportModal(true)}
												>
													Report user
												</button>
											</div>
										)}
									</div>
								</div>
								{/* Post: content */}
								<div className="pl-16">
									<p className="flex-shrink w-auto text-base font-medium text-white">
										{post.description}
									</p>

									{/* Check if there's an image otherwise, show nothing. */}
									<div className="relative mt-2">
										{/* <Image
										src="{`data:image/${post.avatar.ext.slice(1)};base64,${post.avatar.data}`	},
										alt="Image Preview"
										className="w-full max-w-80 max-h-64"
									/> */}
									</div>

									{/* Post: Footer */}
									{/* Icons */}
									<div className="flex">
										<div className="w-full">
											<div className="flex items-center">
												<div className="flex flex-col items-center justify-center flex-1 py-2 m-2 text-center">
													<button
														 onClick={() => handleLike(post.post_id)}
														className="flex items-center w-12 px-3 py-1 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
													>
														{isLiked[post.post_id] ? (
															<AiFillHeart
																size={25}
																className="text-red-500"
															/>
														) : (
															<AiOutlineHeart size={25} />
														)}
													</button>
													{/* Only show if there's at least 2 likes */}
													<span className="text-sm text-gray-200">
														{post.heart_count}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* <hr className="border-gray-600" /> */}
							</li>
						))}
					</ul>
				</div>
				{/* right menu */}
				<div className="w-fit">
					<div className="relative w-full p-5 mr-16 text-gray-300">
						<button
							type="submit"
							className="absolute mt-3 ml-4 mr-4"
						>
							<BiSearch size={20} />
						</button>
						<input
							type="search"
							name="search"
							placeholder="Search Thoughts"
							className="w-full h-10 px-10 pr-5 text-sm text-gray-200 bg-indigo-800 border-0 rounded-full shadow focus:outline-none"
						/>
					</div>
				</div>
			</div>

			{showReportModal && (
				<div
					className="fixed inset-0 z-50 overflow-y-auto "
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
					id="reportUser-modal"
				>
					{/* <!-- Background --> */}
					<div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
						{/* <!--  Gray Background --> */}
						<div
							className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-80"
							aria-hidden="true"
						></div>
						{/* <!--  Center the pop-up message--> */}
						<span
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true"
						></span>

						<div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
							<div className="flex flex-row items-center justify-between p-4">
								{/* <!--  Top  --> */}
								<div className="flex flex-wrap">
									<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-400 rounded-full sm:mx-0 sm:h-10 sm:w-10">
										<span className="flex items-center px-4 ">
											<BsFillExclamationTriangleFill size={20} />
										</span>
									</div>
									<h1 className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase">
										Report User
									</h1>
								</div>
								<button
									className="focus:outline-none"
									onClick={() => setShowReportModal(false)}
								>
									<span className="flex items-center px-4 text-gray-500">
										<AiOutlineClose size={20} />
									</span>
								</button>
							</div>
							{/* <!--  Content --> */}
							<div className="flex flex-col mx-10 my-2 text-gray-500">
								<p className="mb-2 text-lg text-gray-500 font-raleway">
									Reason for reporting
								</p>
								{/* Option */}
								<div className="flex flex-col pl-4">
									<ul className="list-none">
										{/* Offensive language or content */}
										<li>
											<label className="inline-flex items-center">
												<input
													type="radio"
													value="Offensive language or content"
													checked={
														reportReason === "Offensive language or content"
													}
													onChange={handleReportChange}
													className="w-5 h-5 text-indigo-600 form-radio"
												/>
												<span className="ml-2">
													Offensive language or content
												</span>
											</label>
										</li>
										{/* Harassment or bullying */}
										<li>
											<label className="inline-flex items-center">
												<input
													type="radio"
													value="Harassment or bullying"
													checked={reportReason === "Harassment or bullying"}
													onChange={handleReportChange}
													className="w-5 h-5 text-indigo-600 form-radio"
												/>
												<span className="ml-2">Harassment or bullying</span>
											</label>
										</li>
										{/* Spam or misleading information */}
										<li>
											<label className="inline-flex items-center">
												<input
													type="radio"
													value="Spam or misleading information"
													checked={
														reportReason === "Spam or misleading information"
													}
													onChange={handleReportChange}
													className="w-5 h-5 text-indigo-600 form-radio"
												/>
												<span className="ml-2">
													Spam or misleading information
												</span>
											</label>
										</li>
										{/* Violent or harmful content */}
										<li>
											<label className="inline-flex items-center">
												<input
													type="radio"
													value="Violent or harmful content"
													checked={
														reportReason === "Violent or harmful content"
													}
													onChange={handleReportChange}
													className="w-5 h-5 text-indigo-600 form-radio"
												/>
												<span className="ml-2">Violent or harmful content</span>
											</label>
										</li>
										{/* Impersonation or fake account */}
										<li>
											<label className="inline-flex items-center">
												<input
													type="radio"
													value="Impersonation or fake account"
													checked={
														reportReason === "Impersonation or fake account"
													}
													onChange={handleReportChange}
													className="w-5 h-5 text-indigo-600 form-radio"
												/>
												<span className="ml-2">
													Impersonation or fake account
												</span>
											</label>
										</li>
									</ul>
								</div>
							</div>
							{/* <!--  Bottom --> */}
							<div className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse">
								<button
									className={`px-5 py-3 mt-8 text-white rounded  ${
										reportReason
											? "bg-green-600 cursor-pointer hover:bg-green-500"
											: "bg-gray-400 cursor-not-allowed"
									}`}
									type="submit"
									disabled={!reportReason} // Disable the button if reportReason is empty
								>
									Submit
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
