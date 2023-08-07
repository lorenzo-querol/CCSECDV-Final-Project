import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import CustomDate from './CustomDate';
import Image from 'next/image';

export default function Post({
    index,
    post,
    isLiked,
    isOwnPost,
    handleLike,
    handleDelete,
    handleShowReportModal,
    handlePostClicked,
}) {
    const { name, avatar, image, description, date_created, heart_count, user_id, post_id } = post;

    const [toggleDropdown, setToggleDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = event => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setToggleDropdown(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <li className="border-b-2 border-gray-600" key={index}>
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
                                        objectFit: 'cover',
                                    }}
                                    src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${avatar}`}
                                    alt={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${avatar}`}
                                />
                            </div>

                            {/* Details */}
                            <div className="ml-3">
                                <p className="text-base font-medium leading-6 text-white">
                                    {name}
                                    <span className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300">
                                        &nbsp;&nbsp; • &nbsp;&nbsp;
                                        <CustomDate dateString={date_created} />
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
                        <BiDotsVerticalRounded size={25} onClick={() => setToggleDropdown(!toggleDropdown)} />
                    </div>
                    {toggleDropdown && (
                        <div className="absolute right-0 w-32 mt-2 bg-white rounded shadow-md z-35" ref={dropdownRef}>
                            {isOwnPost ? (
                                <button
                                    onClick={() => {
                                        handleDelete(post_id);
                                        setToggleDropdown(false);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-indigo-500 hover:text-white"
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-indigo-500 hover:text-white"
                                    onClick={event => {
                                        handleShowReportModal(event);
                                        handlePostClicked(event, post);
                                    }}
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
                <p className="flex-shrink w-auto text-base font-medium text-white">{description}</p>

                {/* Check if there's an image otherwise, show nothing. */}
                <div className="relative mt-2 flex">
                    {image && (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${image}`}
                            alt="Image Preview"
                            className="max-w-40 max-h-64"
                            width="1920"
                            height="1080"
                            style={{ objectFit: 'contain' }}
                        />
                    )}
                </div>

                {/* Post: Footer */}
                <div className="flex">
                    <div className="w-full">
                        <div className="flex items-center">
                            <div className="flex flex-col items-center justify-center flex-1 py-2 m-2 text-center">
                                <button
                                    onClick={event => handleLike(event, post_id)}
                                    className="flex items-center w-12 px-3 py-1 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                >
                                    {isLiked ? (
                                        <AiFillHeart size={25} className="text-red-500" />
                                    ) : (
                                        <AiOutlineHeart size={25} />
                                    )}
                                </button>
                                <span className="text-sm text-gray-200">{heart_count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
