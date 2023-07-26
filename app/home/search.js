"use client";
import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";
import { BiSearch } from "react-icons/bi"

export default function Search() {
   const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

   const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent form submission
      alert("Searching for: " + sanitizeHtml(searchQuery.trim()));
   };

   return (
      <form className="w-fit" onSubmit={handleSubmit}>
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
               value={searchQuery} // Use the searchQuery value as input value
               onChange={(e) => setSearchQuery(e.target.value)} // Update the searchQuery state on input change
            />
         </div>
      </form>
   )
}
