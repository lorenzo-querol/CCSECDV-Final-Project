"use client";

import {
    AiFillCloseCircle,
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineMessage,
} from "react-icons/ai";
import {
    BiDotsVerticalRounded,
    BiImage,
    BiSearch,
    BiVideoPlus,
} from "react-icons/bi";
import React, { useEffect, useState } from "react";

import CustomDate from "@/app/components/CustomDate";
import Image from "next/image";
import LikedPostList from "@/app/components/LikedPostList";
import MyPostList from "@/app/components/MyPostList";
import control from "@/public/control.png";
import sanitize from "sanitize-html";
import sanitizeHtml from "sanitize-html";
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/login");
        },
    });
    const [isLiked, setIsLiked] = useState(false); // State to track heart fill
    const [showDropdown, setShowDropdown] = useState(false); // Dropdown
    const [selectedPostIndex, setSelectedPostIndex] = useState(null);
    const [userPosts, setPosts] = useState(null);
    const [likedPosts, setLikedPosts] = useState(null);
    const [currentTab, setCurrentTab] = useState("posts");

    const toggleDropdown = (postId) => {
        Object.keys(showDropdown).forEach((key) => {
            if (key !== postId) {
                setShowDropdown((prevShowDropdown) => ({
                    ...prevShowDropdown,
                    [key]: false,
                }));
            }
        });

        // This segment basically just hides the currently selected dropdown
        setShowDropdown((prevShowDropdown) => ({
            ...prevShowDropdown,
            [postId]: !prevShowDropdown[postId],
        }));
    };

    const fetchUserPosts = async () => {
        try {
            const likedRes = await fetch(
                `/api/users/${session.user.user_id}/liked_posts`
            );
            const { data: likedData } = await likedRes.json();
            const likedPosts = likedData.map((post) => post.post_id);

            const myPostsRes = await fetch(
                `/api/users/${session.user.user_id}/my_posts`
            );
            const { data: postData } = await myPostsRes.json();
            setPosts(postData);

            // filter liked posts match with user posts
            const filteredLikedPosts = postData.filter((post) =>
                likedPosts.includes(post.post_id)
            );

            const isLikedObj = {};
            filteredLikedPosts.forEach(
                (post) => (isLikedObj[post.post_id] = true)
            );
            setIsLiked(isLikedObj);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchLikedPosts = async () => {
        try {
            const res = await fetch(
                `/api/users/${session.user.user_id}/liked_posts`
            );
            const { data } = await res.json();
            setLikedPosts(data);

            const likedPosts = data.map((post) => post.post_id);
            const isLikedObj = {};
            likedPosts.forEach((postId) => (isLikedObj[postId] = true));
            setIsLiked(isLikedObj);
        } catch (error) {
            console.error(error.message);
        }
    };

    const callDelete = async (postId, userId) => {
        try {
            const res = await fetch(`/api/users/${userId}/posts/${postId}`, {
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

    // Function to handle heart icon click
    const handleLike = async (postId) => {
        setIsLiked((prevIsLiked) => ({
            ...prevIsLiked,
            [postId]: !prevIsLiked[postId],
        }));

        let heartCount = 0;
        if (isLiked[postId]) heartCount = -1;
        else heartCount = 1;

        try {
            const updatePostPromise = fetch(`/api/posts/${postId}`, {
                method: "PUT",
                body: JSON.stringify({ heart_count: heartCount }),
            });

            const likePostPromise = fetch(
                `/api/users/${session.user.user_id}/liked_posts/${postId}`,
                {
                    method: heartCount === 1 ? "POST" : "DELETE",
                }
            );

            const [postRes, likeRes] = await Promise.all([
                updatePostPromise,
                likePostPromise,
            ]);

            // Handle the responses as needed
            const postData = await postRes.json();
            const likeData = await likeRes.json();

            if (!postData.ok && !likeData.ok)
                throw new Error("Something went wrong.");

            await fetchUserPosts();
        } catch (error) {
            console.log(error.message);
        }
    };

    // useEffect(() => {
    //     if (session) {
    //         if (currentTab === "posts") fetchUserPosts();
    //         else fetchLikedPosts();
    //     }
    // }, [session, currentTab]);

    if (!session)
        return (
            <svg
                class="animate-spin h-5 w-5 mr-3 ..."
                viewBox="0 0 24 24"
            ></svg>
        );

    return (
        <div className="flex flex-row h-full overflow-y-auto">
            {/* Middle */}
            <div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
                <div className="flex">
                    <div className="flex-1 m-2">
                        <h2 className="px-4 py-2 text-2xl font-bold text-white">
                            Profile
                        </h2>
                    </div>
                </div>
                <hr className="border-gray-600" />

                {/* Profile info */}
                <div className="flex flex-1 w-full p-2">
                    {/* Image */}
                    <div>
                        <div className="relative rounded-full md avatar w-36 h-36">
                            <Image
                                className="relative border-4 border-gray-900 rounded-full w-36 h-36 md"
                                src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${session.user.avatar}`}
                                alt=""
                                priority={true}
                                placeholder="empty"
                                style={{ objectFit: "cover" }}
                                width={144}
                                height={144}
                            />
                            <div className="absolute"></div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex flex-col items-start justify-end w-full h-full ml-3 space-y-2">
                            <h2 className="text-2xl font-bold leading-6 text-white">
                                {session.user.name}
                            </h2>
                            <p className="text-base font-medium leading-5 text-gray-600">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full h-10">
                    <button
                        className="w-1/2 text-xl font-bold hover:bg-indigo-700"
                        onClick={() => setCurrentTab("posts")}
                    >
                        Posts
                    </button>
                    <button
                        className="w-1/2 text-xl font-bold hover:bg-indigo-700"
                        onClick={() => setCurrentTab("likes")}
                    >
                        Likes
                    </button>
                </div>

                <hr className="border-4 border-indigo-800" />

                {currentTab === "posts" ? <MyPostList /> : <LikedPostList />}
            </div>
            {/* right menu */}
            <div className="w-fit">
                <div className="relative w-full p-5 mr-16 text-gray-300"></div>
            </div>
        </div>
    );
}
