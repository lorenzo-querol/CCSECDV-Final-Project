import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react";

import { BiDotsVerticalRounded } from "react-icons/bi";
import CustomDate from "@/app/components/CustomDate";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function MyPostList() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch(
                `/api/users/${session.user.user_id}/my_posts`
            );
            const { data } = await res.json();
            setPosts(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleLikeClick = async (event, postId) => {
        event.preventDefault();
        setIsLiked((prevIsLiked) => ({
            ...prevIsLiked,
            [postId]: !prevIsLiked[postId],
        }));

        let heartCount = 0;
        if (isLiked[postId]) heartCount = -1;
        else heartCount = 1;

        try {
            const postPromise = fetch(`/api/posts/${postId}`, {
                method: "PUT",
                body: JSON.stringify({ heart_count: heartCount }),
            });

            const userPromise = fetch(
                `/api/users/${session.user.user_id}/liked_posts/${postId}`,
                {
                    method: heartCount === 1 ? "POST" : "DELETE",
                }
            );

            const [post, user] = Promise.all([postPromise, userPromise]);
            const { postRes } = await post.json();
            const { userRes } = await user.json();

            if (!postRes.ok && !userRes.ok)
                throw new Error("Error updating post");
        } catch (error) {
            console.log(error.message);
        }
    };

    const toggleDropdown = (postId) => {
        Object.keys(showDropdown).forEach((key) => {
            if (key !== postId) {
                setShowDropdown((prevShowDropdown) => ({
                    ...prevShowDropdown,
                    [key]: false,
                }));
            }
        });

        // this segment basically just hides the currently selected dropdown
        setShowDropdown((prevShowDropdown) => ({
            ...prevShowDropdown,
            [postId]: !prevShowDropdown[postId],
        }));
    };

    const callDelete = async (postId, userId) => {
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            });
            const { data } = await res.json();
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    };

    const handleDelete = (postId, userId) => {
        // Perform the delete operation here (e.g., calling an API to delete the post)
        // After deleting the post, update the posts state to remove the deleted post

        if (callDelete(postId, userId)) {
            const updatedPosts = posts.filter(
                (post) => post.post_id !== postId
            );
            setPosts(updatedPosts);

            // Also, update the showDropdown state to hide the dropdown for the deleted post
            setShowDropdown((prev) => ({
                ...prev,
                [postId]: false,
            }));
        }
    };

    useEffect(() => {
        if (session) fetchPosts();
    }, [session, isLiked]);

    if (!posts || !session)
        return (
            <div className="flex items-center justify-center w-full h-full text-white">
                <div className="w-12 h-12 rounded-full animate-spin border-2 border-solid border-indigo-900 border-t-transparent"></div>
            </div>
        );

    return (
        <ul className="list-none h-72">
            {posts.map((post, index) => (
                <li key={index} className="border-b-2 border-gray-600">
                    <div className="flex flex-shrink-0 p-4 ">
                        <div className="flex-grow">
                            {/* Post: header */}
                            <div className="flex items-center justify-between ">
                                <div className="flex items-center">
                                    {/* Image profile */}
                                    <div>
                                        <Image
                                            className="inline-block w-10 h-10 rounded-full"
                                            width={40}
                                            height={40}
                                            style={{
                                                objectFit: "cover",
                                            }}
                                            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${post.avatar}`}
                                            alt={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${post.avatar}`}
                                        />
                                    </div>
                                    {/* Details */}
                                    <div className="ml-3">
                                        <p className="text-base font-medium leading-6 text-white">
                                            {post.name}
                                            <span className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300">
                                                &nbsp;&nbsp; • &nbsp;&nbsp;
                                                <CustomDate
                                                    dateString={
                                                        post.date_created
                                                    }
                                                />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Only show if its the user's post */}
                        {/* Dropdown icon */}
                        <div className="relative">
                            <div className="flex items-center flex-shrink-0 ml-auto cursor-pointer">
                                <BiDotsVerticalRounded
                                    size={25}
                                    onClick={() => toggleDropdown(post.post_id)}
                                />
                            </div>
                            {showDropdown[post.post_id] && (
                                <div className="absolute right-0 w-32 mt-2 bg-white rounded shadow-md z-35">
                                    {post.user_id === session.user.user_id ? (
                                        <button
                                            onClick={() => {
                                                handleDelete(
                                                    post.post_id,
                                                    post.user_id
                                                );
                                            }}
                                            className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-indigo-500 hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-indigo-500 hover:text-white"
                                            onClick={() =>
                                                setShowReportModal(true)
                                            }
                                        >
                                            Report user
                                        </button>
                                    )}
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
                                            onClick={(event) =>
                                                handleLikeClick(
                                                    event,
                                                    post.post_id
                                                )
                                            }
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
                                        <span className="text-sm text-gray-200">
                                            {post.heart_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
