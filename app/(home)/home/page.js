"use client";
import React, { useState } from "react";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

import control from "@/public/control.png";
import pic from "@/posts/Zoom Background 2.png";   // temp

// Icons
import {
   BiImage,
   BiVideoPlus,
   BiSearch
} from "react-icons/bi"

import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiFillCloseCircle } from "react-icons/ai"
import sanitize from "sanitize-html";

export default function Home() {
   const [imageFile, setImageFile] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const [isLiked, setIsLiked] = useState(false); // State to track heart fill

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
   const handleLike = () => {
      setIsLiked((prevIsLiked) => !prevIsLiked);
   };

   // Function to handle form submission
   const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      const postText = sanitizeHtml(e.target.elements["post-textarea"].value); // Extract post text from the form

      console.log("Posted Text:", postText);
      console.log("Posted Image:", imagePreview);
   };

   return (
      <>
         <div className='flex flex-row h-full overflow-y-auto'>
            {/* Middle */}
            <div className="flex-grow w-4/6 h-auto border border-t-0 border-gray-600">
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
                        <Image className="inline-block w-10 h-10 rounded-full" src={control} alt="" />
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
                              <button onClick={handleRemoveImage} className="absolute top-0 right-0 p-2 text-red-500">
                                 <AiFillCloseCircle size={25} />
                              </button>
                              <img src={imagePreview} alt="Image Preview" className="w-full max-h-64" />
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
                                 <BiImage size={25} className="flex items-center" />
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

               {/* List of postss */}
               <div className="">
                  {/* posts */}
                  <div>
                     <div className="flex flex-shrink-0 p-4 pb-0 b">
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
                                    FirstName LastName
                                    <span
                                       className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300"
                                    >
                                       . 16 April
                                    </span>
                                 </p>
                              </div>
                           </div>
                        </a>
                     </div>
                     <div className="pl-16 ">
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
                        <div className="mt-2 bg-blue-500">
                           <Image src={pic} alt="Image Preview" className="max-w-80 max-h-64" />
                        </div>

                        {/* Icons */}
                        <div className="flex">
                           <div className="w-full">
                              <div className="flex items-center">
                                 <div className="flex-1 ">
                                    <div className="flex items-center justify-center flex-1 py-2 m-2 text-center">
                                       <a
                                          href="#"
                                          className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                       >
                                          <AiOutlineMessage size={25} />
                                       </a>
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-center flex-1 py-2 m-2 text-center">
                                    <button
                                       onClick={handleLike}
                                       className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-indigo-800 hover:text-indigo-300"
                                    >
                                       {isLiked ? (
                                          <AiOutlineHeart size={25} />
                                       ) : (
                                          <AiFillHeart size={25} className="text-red-500" />
                                       )}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <hr className="border-gray-600" />
                  </div>
               </div>


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
