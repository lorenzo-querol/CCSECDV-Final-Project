"use client";
import React, { useState } from 'react';
import Image from 'next/image';

import control from "@/public/control.png";

// Icons
import {
   BiImage,
   BiVideoPlus,
   BiSearch
} from "react-icons/bi"

export default function home() {
   const [selectedImage, setSelectedImage] = useState(null);
   const [selectedVideo, setSelectedVideo] = useState(null);

   const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setSelectedImage(file);
   };

   const handleVideoUpload = (event) => {
      const file = event.target.files[0];
      setSelectedVideo(file);
   };

   return (
      <>
         <div className='flex flex-row'>
            {/* Middle */}
            <div className="flex-grow w-4/6 h-auto border border-t-0 border-gray-600">
               <div className="flex">
                  <div className="flex-1 m-2">
                     <h2 className="px-4 py-2 text-2xl font-bold text-white">Home</h2>
                  </div>
               </div>
               <hr className="border-gray-600" />

               {/* Creat tweet */}
               <div className="flex py-2">
                  <div className="w-10 py-1 m-2">
                     <Image className="inline-block w-10 h-10 rounded-full" src={control} alt="" />
                  </div>
                  <div className="flex-1 px-2 pt-2 mt-2">
                     <textarea
                        className="w-full text-lg font-medium text-gray-400 bg-transparent"
                        rows="2"
                        cols="50"
                        placeholder="What's happening?"
                     ></textarea>
                  </div>
               </div>
               {/* Create tweet icons */}
               <div className="flex">
                  <div className="w-10"></div>
                  <div className="w-64 px-2">
                     {/* Icons */}
                     <div className="flex items-center">
                        {/* Upload image */}
                        <div className="items-center flex-1 p-1 m-2">
                           <label htmlFor="upload-image" className="flex items-center p-2 mt-1 text-base font-medium leading-6 text-indigo-400 rounded-full group hover:bg-indigo-800 hover:text-indigo-300">
                              <BiImage size={25} className='flex items-center ' />
                           </label>
                           <input id="upload-image" type="file" accept="image/*" className="hidden" />
                        </div>
                        {/* Upload video */}
                        <div className="flex-1 p-1 m-2 text-center">
                           <label htmlFor="upload-video" className="flex items-center p-2 mt-1 text-base font-medium leading-6 text-indigo-400 rounded-full group hover:bg-indigo-800 hover:text-indigo-300">
                              <BiVideoPlus size={25} />
                           </label>
                           <input id="upload-video" type="file" accept="video/*" className="hidden" />
                        </div>
                        <div className="flex-1 py-2 m-2 text-center">
                        </div>
                        <div className="flex-1 py-2 m-2 text-center">
                        </div>
                     </div>
                  </div>

                  {/* Tweet Button */}
                  <div className="flex-1">
                     <button
                        className="float-right px-8 py-2 mt-5 mr-8 font-bold text-white bg-indigo-400 rounded-full hover:bg-indigo-600"
                     >
                        Tweet
                     </button>
                  </div>
               </div>
               <hr className="border-4 border-indigo-800" />
               <div></div>

               {/* Tweets */}
               <div className="flex flex-shrink-0 p-4 pb-0">
                  <a href="#" className="flex-shrink-0 block group">
                     <div className="flex items-center">
                        <div>
                           <Image
                              className="inline-block w-10 h-10 rounded-full"
                              src={control}
                              alt=""
                           />
                        </div>
                        <div className="ml-3">
                           <p className="text-base font-medium leading-6 text-white">
                              Sonali Hirave
                              <span
                                 className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300"
                              >
                                 @ShonaDesign . 16 April
                              </span>
                           </p>
                        </div>
                     </div>
                  </a>
               </div>
               <div className="pl-16">
                  <p className="flex-shrink text-base font-medium text-white width-auto">
                     Day 07 of the challenge
                     <span className="text-indigo-400">#100DaysOfCode</span> I was wondering
                     what I can do with
                     <span className="text-indigo-400">#tailwindcss</span>, so just started
                     building Twitter UI using Tailwind and so far it looks so
                     promising. I will post my code after completion. [07/100]
                     <span className="text-indigo-400"> #WomenWhoCode #CodeNewbie</span>
                  </p>
                  {/* Icons */}
                  <div className="flex">
                     <div className="w-full">
                        <div className="flex items-center">
                           <div className="flex-1 text-center">
                              <a
                                 href="#"
                                 className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                              >
                                 <svg
                                    className="w-6 h-6 text-center"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    ></path>
                                 </svg>
                              </a>
                           </div>
                           <div className="flex-1 py-2 m-2 text-center">
                              <a
                                 href="#"
                                 className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                              >
                                 <svg
                                    className="w-6 text-center h-7"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                    ></path>
                                 </svg>
                              </a>
                           </div>

                           <div className="flex-1 py-2 m-2 text-center">
                              <a
                                 href="#"
                                 className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                              >
                                 <svg
                                    className="w-6 text-center h-7"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    ></path>
                                 </svg>
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <hr className="border-gray-600" />
            </div>
            {/* right menu */}
            <div className="w-fit">
               <div className="relative w-full p-5 mr-16 text-gray-300">
                  <button type="submit" className="absolute mt-3 ml-4 mr-4">
                     <BiSearch size={20} />
                  </button>
                  <input
                     type="search"
                     name="search"
                     placeholder="Search Twitter"
                     className="w-full h-10 px-10 pr-5 text-sm bg-indigo-800 border-0 rounded-full shadow focus:outline-none bg-purple-white"
                  />
               </div>
            </div>
         </div>
      </>
   )
}
