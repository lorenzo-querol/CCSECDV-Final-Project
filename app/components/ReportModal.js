import React, { useState } from "react";

import { AiOutlineClose } from "react-icons/ai";
import { BsFillExclamationTriangleFill } from "react-icons/bs";

export default function ReportModal({
    reportReason,
    showReportModal,
    handleShowReport,
}) {
    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto "
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            id="reportUser-modal"
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

                <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="flex flex-row items-center justify-between p-4">
                        {/* <!--  Top  --> */}
                        <div className="flex flex-wrap">
                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-400 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <span className="flex items-center px-4 ">
                                    <BsFillExclamationTriangleFill size={20} />
                                </span>
                            </div>
                            <h1 className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase">
                                Report User
                            </h1>
                        </div>
                        <button
                            className="focus:outline-none"
                            onClick={() => setShowReportModal(false)}
                        >
                            <span className="flex items-center px-4 text-gray-500">
                                <AiOutlineClose size={20} />
                            </span>
                        </button>
                    </div>
                    {/* <!--  Content --> */}
                    <div className="flex flex-col mx-10 my-2 text-gray-500">
                        <p className="mb-2 text-lg text-gray-500 font-raleway">
                            Reason for reporting
                        </p>
                        {/* Option */}
                        <div className="flex flex-col pl-4">
                            <ul className="list-none">
                                {/* Offensive language or content */}
                                <li>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Offensive language or content"
                                            checked={
                                                reportReason ===
                                                "Offensive language or content"
                                            }
                                            onChange={handleReportChange}
                                            className="w-5 h-5 text-indigo-600 form-radio"
                                        />
                                        <span className="ml-2">
                                            Offensive language or content
                                        </span>
                                    </label>
                                </li>
                                {/* Harassment or bullying */}
                                <li>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Harassment or bullying"
                                            checked={
                                                reportReason ===
                                                "Harassment or bullying"
                                            }
                                            onChange={handleReportChange}
                                            className="w-5 h-5 text-indigo-600 form-radio"
                                        />
                                        <span className="ml-2">
                                            Harassment or bullying
                                        </span>
                                    </label>
                                </li>
                                {/* Spam or misleading information */}
                                <li>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Spam or misleading information"
                                            checked={
                                                reportReason ===
                                                "Spam or misleading information"
                                            }
                                            onChange={handleReportChange}
                                            className="w-5 h-5 text-indigo-600 form-radio"
                                        />
                                        <span className="ml-2">
                                            Spam or misleading information
                                        </span>
                                    </label>
                                </li>
                                {/* Violent or harmful content */}
                                <li>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Violent or harmful content"
                                            checked={
                                                reportReason ===
                                                "Violent or harmful content"
                                            }
                                            onChange={handleReportChange}
                                            className="w-5 h-5 text-indigo-600 form-radio"
                                        />
                                        <span className="ml-2">
                                            Violent or harmful content
                                        </span>
                                    </label>
                                </li>
                                {/* Impersonation or fake account */}
                                <li>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Impersonation or fake account"
                                            checked={
                                                reportReason ===
                                                "Impersonation or fake account"
                                            }
                                            onChange={handleReportChange}
                                            className="w-5 h-5 text-indigo-600 form-radio"
                                        />
                                        <span className="ml-2">
                                            Impersonation or fake account
                                        </span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* <!--  Bottom --> */}
                    <div className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            className={`px-5 py-3 mt-8 text-white rounded  ${
                                reportReason
                                    ? "bg-green-600 cursor-pointer hover:bg-green-500"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                            type="submit"
                            disabled={!reportReason} // Disable the button if reportReason is empty
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
