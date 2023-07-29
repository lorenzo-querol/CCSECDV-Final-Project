"use client";

import {
    AiFillCloseCircle,
    AiFillHeart,
    AiOutlineClose,
    AiOutlineHeart,
} from "react-icons/ai";
import { BiDotsVerticalRounded, BiImage, BiSearch } from "react-icons/bi";
import React, { useState } from "react";

import { BsFillExclamationTriangleFill } from "react-icons/bs";
import CreatePostForm from "@/app/components/CreatePostForm";
import CustomDate from "@/app/components/CustomDate";
import Image from "next/image";
import PostList from "@/app/components/PostList";
import ReportModal from "@/app/components/ReportModal";
import sanitizeHtml from "sanitize-html";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session, status } = useSession();

    // Submission states
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    // Posts states
    const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

    // Function to handle form submission for search
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission
        alert("Searching for: " + sanitizeHtml(searchQuery.trim()));
    };

    const callDelete = async (postId, userId) => {
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: JSON.stringify({ post_id: postId, user_id: userId }),
            });
            const { data } = await res.json();
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    };

    /**
     * Perform the delete operation here (e.g., calling an API to delete the post)
     * After deleting the post, update the posts state to remove the deleted post
     */
    const handleDelete = (postId, userId) => {
        if (!callDelete(postId, userId)) return;

        const updatedPosts = posts.filter((post) => post.post_id !== postId);
        setPosts(updatedPosts);

        // Also, update the showDropdown state to hide the dropdown for the deleted post
        setShowDropdown((prev) => ({
            ...prev,
            [postId]: false,
        }));
    };

    if (!session) return <div>Loading...</div>;

    return (
        <>
            <div className="flex flex-row h-full overflow-y-auto">
                {/* Middle */}
                <div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
                    <div className="flex">
                        <div className="flex-1 m-2">
                            <h2 className="px-4 py-2 text-2xl font-bold text-white">
                                Home
                            </h2>
                        </div>
                    </div>
                    <hr className="border-gray-600" />

                    {/* Create posts */}
                    <hr className="border-4 border-indigo-800" />
                    <div></div>

                    <CreatePostForm />
                    <PostList />
                </div>

                {/* right menu */}
                {/* right menu */}
                <div className="w-fit">
                    <div className="relative w-full p-5 mr-16 text-gray-300"></div>
                </div>
            </div>

            {showReportModal && <ReportModal />}
        </>
    );
}
