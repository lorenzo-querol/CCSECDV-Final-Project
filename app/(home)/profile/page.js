"use client";
import React, { useState } from "react";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

import control from "@/public/control.png";
//import pic from "@/posts/Zoom Background 2.png";   // temp

// Icons
import {
   BiImage,
   BiVideoPlus,
   BiSearch,
   BiDotsVerticalRounded
} from "react-icons/bi"

import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiFillCloseCircle } from "react-icons/ai"
import sanitize from "sanitize-html";

export default function Home() {
   const [isLiked, setIsLiked] = useState(false); // State to track heart fill
   const [showDropdown, setShowDropdown] = useState(false); // Dropdown
   const [selectedPostIndex, setSelectedPostIndex] = useState(null); // New state variable


   // Function to handle heart icon click
   const handleLike = () => {
      setIsLiked((prevIsLiked) => !prevIsLiked);
   };

   const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
   };

   return (
      <>
         <div className='flex flex-row h-full overflow-y-auto'>
            {/* Middle */}
            <div className="w-4/6 h-full border-t-0 border-gray-600 border-x-2">
               <div className="flex">
                  <div className="flex-1 m-2">
                     <h2 className="px-4 py-2 text-2xl font-bold text-white">Profile</h2>
                  </div>
               </div>
               <hr className="border-gray-600" />

               {/* Profile info */}
               <div className="flex flex-1 w-full p-2">
                  {/* Image */}
                  <div>
                     <div className="relative rounded-full md avatar w-36 h-36">
                        <img className="relative border-4 border-gray-900 rounded-full w-36 h-36 md" src="https://pbs.twimg.com/profile_images/1254779846615420930/7I4kP65u_400x400.jpg" alt="" />
                        <div className="absolute"></div>
                     </div>
                  </div>
                  {/* Details */}
                  <div>
                     <div className="flex flex-col items-start justify-end w-full h-full ml-3 space-y-2">
                        <h2 className="text-2xl font-bold leading-6 text-white">Name</h2>
                        <p className="text-base font-medium leading-5 text-gray-600">@email</p>
                     </div>
                  </div>
               </div>

               <div className="flex justify-between w-full h-10">
                  <button className="w-1/2 text-xl font-bold hover:bg-indigo-700">
                     Posts
                  </button>
                  <button className="w-1/2 text-xl font-bold hover:bg-indigo-700">
                     Likes
                  </button>
               </div>

               <hr className="border-4 border-indigo-800" />
               <div></div>

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
                                       FirstName LastName
                                       <span className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300">
                                          . 16 April
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
                              <BiDotsVerticalRounded size={25} onClick={toggleDropdown} />
                           </div>
                           {showDropdown && (
                              <div className="absolute right-0 mt-2 bg-white rounded shadow-md">
                                 <button
                                    onClick={() => {
                                       console.log('Delete clicked!');
                                    }}
                                    className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-red-500 hover:text-white"
                                 >
                                    Delete
                                 </button>
                              </div>
                           )}
                        </div>

                     </div>
                     {/* Post: content */}
                     <div className="pl-16">
                        <p className="flex-shrink w-auto text-base font-medium text-white">
                           Day 07 of the challenge
                           <span className="text-indigo-400">#100DaysOfCode</span> I was wondering
                           what I can do with
                           <span className="text-indigo-400">#tailwindcss</span>, so just started
                           building Twitter UI using Tailwind and so far it looks so
                           promising. I will post my code after completion. [07/100]
                           <span className="text-indigo-400"> #WomenWhoCode #CodeNewbie</span>
                        </p>

                        {/* Check if there's an image otherwise, show nothing. */}
                        <div className="relative mt-2">
                           <Image src={pic} alt="Image Preview" className="w-full max-w-80 max-h-64" />
                        </div>

                        {/* Post: Footer */}
                        {/* Icons */}
                        <div className="flex">
                           <div className="w-full">
                              <div className="flex items-center">
                                 {/* <div className="flex-1 ">
                                    <div className="flex items-center justify-center flex-1 py-2 m-2 text-center">
                                       <a
                                          href="#"
                                          className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                       >
                                          <AiOutlineMessage size={25} />
                                       </a>
                                    </div>
                                 </div> */}
                                 <div className="flex flex-col items-center justify-center flex-1 py-2 m-2 space-x-2 text-center">
                                    <button
                                       onClick={handleLike}
                                       className="flex items-center w-12 px-3 py-1 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                    >
                                       {isLiked ? (
                                          <AiFillHeart size={25} className="text-red-500" />
                                       ) : (

                                          <AiOutlineHeart size={25} />
                                       )}
                                    </button>
                                    {/* Only show if there's at least 2 likes */}
                                    <span className="text-sm text-gray-200">
                                       Number of likes
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* <hr className="border-gray-600" /> */}
                  </li>
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
                                       FirstName LastName
                                       <span className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300">
                                          . 16 April
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
                              <BiDotsVerticalRounded size={25} onClick={toggleDropdown} />
                           </div>
                           {showDropdown && (
                              <div className="absolute right-0 mt-2 bg-white rounded shadow-md">
                                 <button
                                    onClick={() => {
                                       console.log('Delete clicked!');
                                    }}
                                    className="block w-full px-4 py-2 text-left text-gray-800 rounded hover:bg-red-500 hover:text-white"
                                 >
                                    Delete
                                 </button>
                              </div>
                           )}
                        </div>

                     </div>
                     {/* Post: content */}
                     <div className="pl-16">
                        <p className="flex-shrink w-auto text-base font-medium text-white">
                           Day 07 of the challenge
                           <span className="text-indigo-400">#100DaysOfCode</span> I was wondering
                           what I can do with
                           <span className="text-indigo-400">#tailwindcss</span>, so just started
                           building Twitter UI using Tailwind and so far it looks so
                           promising. I will post my code after completion. [07/100]
                           <span className="text-indigo-400"> #WomenWhoCode #CodeNewbie</span>
                        </p>

                        {/* Check if there's an image otherwise, show nothing. */}
                        <div className="relative mt-2">
                           <Image src={pic} alt="Image Preview" className="w-full max-w-80 max-h-64" />
                        </div>

                        {/* Post: Footer */}
                        {/* Icons */}
                        <div className="flex">
                           <div className="w-full">
                              <div className="flex items-center">
                                 {/* <div className="flex-1 ">
                                    <div className="flex items-center justify-center flex-1 py-2 m-2 text-center">
                                       <a
                                          href="#"
                                          className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                       >
                                          <AiOutlineMessage size={25} />
                                       </a>
                                    </div>
                                 </div> */}
                                 <div className="flex flex-col items-center justify-center flex-1 py-2 m-2 space-x-2 text-center">
                                    <button
                                       onClick={handleLike}
                                       className="flex items-center w-12 px-3 py-1 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                    >
                                       {isLiked ? (
                                          <AiFillHeart size={25} className="text-red-500" />
                                       ) : (

                                          <AiOutlineHeart size={25} />
                                       )}
                                    </button>
                                    {/* Only show if there's at least 2 likes */}
                                    <span className="text-sm text-gray-200">
                                       Number of likes
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* <hr className="border-gray-600" /> */}
                  </li>
               </ul>
            </div>
            {/* right menu */}
            <div className="w-fit">
               <div className="relative w-full p-5 mr-16 text-gray-300">

               </div>
            </div>
         </div>
      </>
   )
}
