
import { React, useState } from 'react'

import { AiOutlineClose } from "react-icons/ai";
import { BiSort } from "react-icons/bi";
import { FaListUl } from "react-icons/fa";

export default function UserLogs({ onClose }) {
   const [showLogs, setShowLogs] = useState(true);

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
                           <FaListUl size={20} />
                        </span>
                     </div>
                     <h1 className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase">
                        User Logs
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
               <div className="flex flex-col mx-10 my-2 text-gray-500">
                  <p className="mb-2 text-lg text-gray-500 font-raleway">
                     Name: <span className="font-bold"> Complete name</span>
                  </p>
                  {/* Option */}
                  <div className="flex mt-4">
                     <table className="table w-full mx-auto text-center">
                        <thead>
                           <tr>
                              <th className="w-1/2 px-4 py-2 border-b ">
                                 <div className="flex items-center justify-center">
                                    Log Description
                                    <button
                                       onClick={() => handleSortClick("description")}
                                       className="flex justify-center"
                                    >
                                       <BiSort size={20} />
                                    </button>
                                 </div>
                              </th>
                              <th className="w-1/2 px-4 py-2 border-b">
                                 <div className="flex items-center justify-center">
                                    Date
                                    <button
                                       onClick={() => handleSortClick("date")}
                                       className="flex justify-center"
                                    >
                                       <BiSort size={20} />
                                    </button>
                                 </div>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="items-center justify-center w-full mx-auto">
                           <tr>
                              <td className="px-4 py-2 border-b">log description</td>
                              <td className="px-4 py-2 border-b">log date & time</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
               {/* <!--  Bottom --> */}
               <div className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse">
               </div>
            </div>
         </div>
      </div>
   )
}
