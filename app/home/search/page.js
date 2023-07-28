"use client";

import {
    AiFillCloseCircle,
    AiFillHeart,
    AiOutlineArrowLeft,
    AiOutlineClose,
    AiOutlineHeart,
    AiOutlineMessage,
} from "react-icons/ai";
import {
    BiDotsVerticalRounded,
    BiImage,
    BiSearch,
    BiVideoPlus,
} from "react-icons/bi";
import React, { useState } from "react";

import { BsFillExclamationTriangleFill } from "react-icons/bs";
import Date from "@/app/components/CustomDate";
import Image from "next/image";
import control from "@/public/control.png";
import sanitize from "sanitize-html";
import sanitizeHtml from "sanitize-html";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

// Icons

// import pic from "@/posts/Zoom Background 2.png";   // temp

export default function Home() {
    const [isLiked, setIsLiked] = useState(false); // State to track heart fill
    const [showDropdown, setShowDropdown] = useState(false); // Dropdown
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [posts, setPosts] = useState(null);
    const { data: session, status } = useSession();

    async function fetchData() {
        const res = await fetch("api/posts", {
            method: "GET",
        });
        const data = await res.json();
        console.log(data);
        setPosts(data.data);
        //res = await res.json();
        //setPosts(res.data);
    }

    useEffect(() => {
        fetchData();
    });

    const handleGoBack = () => {
        alert("go back to home");
    };

    // Function to handle heart icon click
    const handleLike = () => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
    };

    // Function to show dropdown
    const toggleDropdown = (param) => {
        setShowDropdown(!showDropdown);
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
            console.log(sessionOBJ);
            const name = sessionOBJ[0].data.name;
            const user_id = sessionOBJ[1];

            //	name: name,
            //	description: description,
            //	image: "posts/post_" + imageName,
            //};

            const res = await fetch(`api/posts`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    description: postText,
                    avatar: imagePreview,
                    user_id: user_id,
                    name: name,
                }),
            });
            console.log("are u here");
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
        console.log("Posted Text:", postText);
        console.log("Posted Image:", imagePreview);
    };
    if (!posts) return <div>Fetching posts...</div>;
    return (
        <>
            <div className="flex flex-row h-full overflow-y-auto">
                {/* Middle */}
                <div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
                    <div className="flex">
                        <div className="flex items-center m-2">
                            <AiOutlineArrowLeft
                                size={25}
                                onClick={handleGoBack}
                            />
                            <h2 className="px-4 py-2 text-2xl font-bold text-white">
                                Search
                            </h2>
                        </div>
                    </div>
                    <hr className="border-gray-600" />

                    {/* List of posts */}
                    <ul className="list-none">
                        {/* Post */}
                        <li className="border-b-2 border-gray-600 ">
                            <div className="flex flex-shrink-0 p-4 ">
                                <div className="flex-grow">
                                    {/* Post: header */}
                                    <div className="flex items-center justify-between ">
                                        <div className="flex items-center">
                                            {/* Image profile */}
                                            <div>
                                                <Image
                                                    className="inline-block w-10 h-10 rounded-full"
                                                    src={control}
                                                    alt=""
                                                />
                                            </div>
                                            {/* Details */}
                                            <div className="ml-3">
                                                <p className="text-base font-medium leading-6 text-white">
                                                    post.name
                                                    <span className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300">
                                                        &nbsp;&nbsp; •
                                                        &nbsp;&nbsp;
                                                        {/* <Date dateString={post.date_created} /> */}
                                                        Date
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
                                            onClick={toggleDropdown}
                                        />
                                    </div>
                                    {showDropdown && (
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
                                                onClick={() =>
                                                    setShowReportModal(true)
                                                }
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
                                    post.description
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
                                            <div className="flex items-center justify-center flex-1 py-2 m-2 space-x-2 text-center">
                                                <button
                                                    onClick={handleLike}
                                                    className="flex items-center w-12 px-3 py-1 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                                >
                                                    {isLiked ? (
                                                        <AiFillHeart
                                                            size={25}
                                                            className="text-red-500"
                                                        />
                                                    ) : (
                                                        <AiOutlineHeart
                                                            size={25}
                                                        />
                                                    )}
                                                </button>
                                                {/* Only show if there's at least 2 likes */}
                                                <span className="text-sm text-gray-200">
                                                    post.heart_count
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                {/* right menu */}
                <form className="w-fit">
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
                </form>
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
                                            <BsFillExclamationTriangleFill
                                                size={20}
                                            />
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
                                                        reportReason ===
                                                        "Offensive language or content"
                                                    }
                                                    onChange={
                                                        handleReportChange
                                                    }
                                                    className="w-5 h-5 text-indigo-600 form-radio"
                                                />
                                                <span className="ml-2">
                                                    Offensive language or
                                                    content
                                                </span>
                                            </label>
                                        </li>
                                        {/* Harassment or bullying */}
                                        <li>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="Harassment or bullying"
                                                    checked={
                                                        reportReason ===
                                                        "Harassment or bullying"
                                                    }
                                                    onChange={
                                                        handleReportChange
                                                    }
                                                    className="w-5 h-5 text-indigo-600 form-radio"
                                                />
                                                <span className="ml-2">
                                                    Harassment or bullying
                                                </span>
                                            </label>
                                        </li>
                                        {/* Spam or misleading information */}
                                        <li>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="Spam or misleading information"
                                                    checked={
                                                        reportReason ===
                                                        "Spam or misleading information"
                                                    }
                                                    onChange={
                                                        handleReportChange
                                                    }
                                                    className="w-5 h-5 text-indigo-600 form-radio"
                                                />
                                                <span className="ml-2">
                                                    Spam or misleading
                                                    information
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
                                                        reportReason ===
                                                        "Violent or harmful content"
                                                    }
                                                    onChange={
                                                        handleReportChange
                                                    }
                                                    className="w-5 h-5 text-indigo-600 form-radio"
                                                />
                                                <span className="ml-2">
                                                    Violent or harmful content
                                                </span>
                                            </label>
                                        </li>
                                        {/* Impersonation or fake account */}
                                        <li>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value="Impersonation or fake account"
                                                    checked={
                                                        reportReason ===
                                                        "Impersonation or fake account"
                                                    }
                                                    onChange={
                                                        handleReportChange
                                                    }
                                                    className="w-5 h-5 text-indigo-600 form-radio"
                                                />
                                                <span className="ml-2">
                                                    Impersonation or fake
                                                    account
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
