import { React, useState } from 'react'
import CustomDate from "./CustomDate";

import { AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { BiSort } from "react-icons/bi";

export default function ReportProfile({ onClose }) {
   const [showUser, setShowUser] = useState(true);

   return (
      <div
         className="fixed inset-0 z-50 overflow-y-auto "
         aria-labelledby="modal-title"
         role="dialog"
         aria-modal="true"
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

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
               <div className="flex flex-row items-center justify-between p-4">
                  {/* <!--  Top  --> */}
                  <div className="flex flex-wrap">
                     <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-yellow-400 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        <span className="flex items-center px-4 ">
                           <AiOutlineUser size={20} />
                        </span>
                     </div>
                     <h1 className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase">
                        Name
                     </h1>
                  </div>
                  <button
                     className="focus:outline-none"
                     onClick={() => onClose()}
                  >
                     <span className="flex items-center px-4 text-gray-500">
                        <AiOutlineClose size={20} />
                     </span>
                  </button>
               </div>
               {/* <!--  Content --> */}
               <div className="mx-10 my-2 text-gray-500">
                  {/* Posts */}
                  <div className="flex">
                     <div className="w-full border-b-2 border-gray-600">
                        {/* Details */}
                        <li className="ml-3">
                           <span className="text-sm font-medium leading-5 text-gray-800 transition duration-150 ease-in-out group-hover:text-gray-300">
                              &nbsp;&nbsp; Date
                           </span>
                           <p className="flex-shrink w-auto text-base font-medium text-black">
                              description
                           </p>
                           <div className="relative flex mt-2">
                              image
                              {/* {image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${image}`}
              alt="Image Preview"
              className="max-w-40 max-h-64"
              width="1920"
              height="1080"
              style={{ objectFit: 'contain' }}
            />
          )} */}
                           </div>
                        </li>
                     </div>
                  </div>
               </div>
               {/* <!--  Bottom --> */}
               <div className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse">
               </div>
            </div>
         </div>
      </div >
   )
}
