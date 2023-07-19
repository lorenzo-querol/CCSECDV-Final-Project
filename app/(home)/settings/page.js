"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import sanitizeHtml from "sanitize-html";
import styles from "@/app/Form.module.css";
import axios from "axios";

// Icons
import {
   HiAtSymbol,
   HiFingerPrint,
   HiOutlineUser,
   HiOutlinePhone,
} from "react-icons/hi";

import {
   AiOutlineClose
} from "react-icons/ai";

import {
   BsFillExclamationTriangleFill
} from "react-icons/bs";

import control from "@/public/control.png";


export default function Register() {
   const inputFileRef = useRef();
   const [show, setShow] = useState({
      password: false,
      confirmPassword: false,
   });
   const [showSaveModal, setSaveModal] = useState(false); // State variable for the save modal visibility
   const [showDeactivateModal, setDeactivateModal] = useState(false);

   const {
      register,
      formState: { errors },
      handleSubmit,
      watch,
   } = useForm();

   const onSubmit = async (data) => {
      const formData = new FormData();
      console.log('Submit');
      setSaveModal(true); // Show the modal when the form is submitted
   };

   const watchPassword = watch("password");
   const validatePasswordMatch = (value) => {
      if (value === watchPassword) {
         return true;
      }
      return "Password do not match";
   };

   return (
      <>
         <div className="flex items-center justify-center h-full ">
            <form
               className="relative z-10 mx-auto w-full max-w-[625px] space-y-3 rounded-md bg-white p-8 text-slate-900"
               onSubmit={handleSubmit(onSubmit)}
            >
               {/* Profile Image */}
               <div className="flex justify-center just">
                  <Image
                     className="overflow-hidden rounded-full"
                     src={control}
                     alt=""
                     width={95}
                     height={95}
                  />
               </div>
               {/* Full Name */}
               <div className="w-full my-2 text-center">
                  <h1 className="text-xl font-semibold">firstname lastname</h1>
               </div>

               <h1 className="text-lg">Profile Information</h1>
               {/* Full Name */}
               <div className="flex justify-between space-x-2">
                  {/* First Name */}
                  <div className="flex flex-col">
                     <div
                        className={styles.input_group}
                        style={{
                           border: errors.firstName
                              ? "1px solid red"
                              : "1px solid #ccc",
                        }}
                     >
                        <input
                           type="text"
                           name="firstName"
                           placeholder="First Name"
                           className={styles.input_text}
                           {...register("firstName", {
                              pattern: {
                                 value: /^[\w\s\u00C0-\u017F]{2,}$/, // Accepts alphanumeric characters, spaces, and special characters like "Ñ", "ñ", and letters with a tilde, with a minimum length of 2
                                 message: "Please enter a valid name",
                              },
                           })}
                        />
                        <span className="flex items-center px-4 ">
                           <HiOutlineUser size={20} />
                        </span>
                     </div>
                     {/* Error message */}
                     {errors.firstName && (
                        <p role="alert" className={styles.error_text}>
                           {errors.firstName?.message}
                        </p>
                     )}
                  </div>
                  {/* Last Name */}
                  <div className="flex flex-col">
                     <div
                        className={styles.input_group}
                        style={{
                           border: errors.lastName
                              ? "1px solid red"
                              : "1px solid #ccc",
                        }}
                     >
                        <input
                           type="text"
                           name="lastName"
                           placeholder="Last Name"
                           className={styles.input_text}
                           {...register("lastName", {
                              pattern: {
                                 value: /^[\w\s\u00C0-\u017F]{2,}$/, // Accepts alphanumeric characters, spaces, and special characters like "Ñ", "ñ", and letters with a tilde, with a minimum length of 2
                                 message: "Please enter a valid name",
                              },
                           })}
                        />
                        <span className="flex items-center px-4 ">
                           <HiOutlineUser size={20} />
                        </span>
                     </div>
                     {/* Error message */}
                     {errors.lastName && (
                        <p role="alert" className={styles.error_text}>
                           {errors.lastName?.message}
                        </p>
                     )}
                  </div>
               </div>
               <h1 className="text-lg">Account Information</h1>
               {/* Phone Number */}
               <div className="flex flex-col">
                  <div
                     className={styles.input_group}
                     style={{
                        border: errors.phoneNumber
                           ? "1px solid red"
                           : "1px solid #ccc",
                     }}
                  >
                     <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className={styles.input_text}
                        {...register("phoneNumber", {
                           pattern: {
                              value: /^[\w\s\u00C0-\u017F]{2,}$/, // Accepts alphanumeric characters, spaces, and special characters like "Ñ", "ñ", and letters with a tilde, with a minimum length of 2
                              message: "Please enter a valid name",
                           },
                        })}
                     />
                     <span className="flex items-center px-4 ">
                        <HiOutlinePhone size={20} />
                     </span>
                  </div>
                  {/* Error message */}
                  {errors.phoneNumber && (
                     <p role="alert" className={styles.error_text}>
                        {errors.phoneNumber?.message}
                     </p>
                  )}
               </div>
               {/* Email */}
               <div className="flex flex-col">
                  <div
                     className={styles.input_group}
                     style={{
                        border: errors.email
                           ? "1px solid red"
                           : "1px solid #ccc",
                     }}
                  >
                     <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.input_text}
                        {...register("email", {
                           pattern: {
                              value: /^[\w.\-]+[a-zA-Z0-9]*@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
                              message:
                                 "Please enter a valid email address",
                           },
                        })}
                     />
                     <span className="flex items-center px-4 ">
                        <HiAtSymbol size={20} />
                     </span>
                  </div>
                  {/* Error message */}
                  {errors.email && (
                     <p role="alert" className={styles.error_text}>
                        {errors.email?.message}
                     </p>
                  )}
               </div>
               {/* Password */}
               <div className="flex flex-col">
                  <div
                     className={styles.input_group}
                     style={{
                        border: errors.password
                           ? "1px solid red"
                           : "1px solid #ccc",
                     }}
                  >
                     <input
                        type={`${show.password ? "text" : "password"}`}
                        name="password"
                        placeholder="Password"
                        className={styles.input_text}
                        {...register("password", {
                           pattern: {
                              value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/,
                              message:
                                 "Password length must be at least 12 characters and 64 characters at most. It must also contain at least 1 upper case character, at least 1 lower case character, at least 1 digit, and at least 1 special character",
                           },
                        })}
                     />
                     <span
                        className="flex items-center px-4"
                        onClick={() =>
                           setShow({
                              ...show,
                              password: !show.password,
                           })
                        }
                     >
                        <HiFingerPrint size={20} />
                     </span>
                  </div>
                  {/* Error message */}
                  {errors.password && (
                     <p role="alert" className={styles.error_text}>
                        {errors.password?.message}
                     </p>
                  )}
               </div>
               {/* Confirm Password */}
               <div className="flex flex-col">
                  <div
                     className={styles.input_group}
                     style={{
                        border: errors.confirmPassword
                           ? "1px solid red"
                           : "1px solid #ccc",
                     }}
                  >
                     <input
                        type={`${show.confirmPassword ? "text" : "password"
                           }`}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={styles.input_text}
                     // {...register("confirmPassword", {
                     //    validate: validatePasswordMatch, // Add the validate function to check password match
                     // })}
                     />
                     <span
                        className="flex items-center px-4 "
                        onClick={() =>
                           setShow({
                              ...show,
                              confirmPassword: !show.confirmPassword,
                           })
                        }
                     >
                        <HiFingerPrint size={20} />
                     </span>
                  </div>
                  {/* Error message */}
                  {errors.confirmPassword && (
                     <p role="alert" className={styles.error_text}>
                        {errors.confirmPassword?.message}
                     </p>
                  )}
               </div>
               {/* Profile Photo */}
               <div className="flex flex-col">
                  <input
                     className="h-full relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-300  bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-indigo-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-indigo-100 file:px-3 file:py-[0.32rem] file:text-indigo-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-indigo-500 focus:border-primary focus:text-indigo-700 focus:shadow-te-primary focus:outline-none  dark:text-indigo-200 dark:file:bg-indigo-700 dark:file:text-indigo-100 dark:focus:border-primary"
                     type="file"
                     id="profile"
                     {...register("avatar", {
                     })}
                  />
               </div>
               {/* Error message */}
               {errors.avatar && (
                  <p role="alert" className={styles.error_text}>
                     {errors.avatar?.message}
                  </p>
               )}
               <div>
                  {/* Buttons */}
                  <div className="flex justify-between space-x-4">
                     {/* Deactivate button */}
                     <button
                        id="deactivate-account"
                        className="w-full px-5 py-3 mt-8 text-white bg-red-600 rounded hover:bg-red-500"
                        type="button"
                        onClick={() => setDeactivateModal(true)}
                     >
                        Deactivate
                     </button>
                     {/* Save button */}
                     <button
                        id="save-changes"
                        className="w-full px-5 py-3 mt-8 text-white bg-green-600 rounded hover:bg-green-500" type="submit">
                        Save Changes
                     </button>
                  </div>
               </div>
            </form>
         </div>

         {/* Modals */}
         {/* Save Changes */}
         {showSaveModal && (
            <div
               className="fixed inset-0 z-10 overflow-y-auto "
               aria-labelledby="modal-title"
               role="dialog"
               aria-modal="true"
               id="save-modal"
            >
               {/* <!-- Background --> */}
               <div
                  className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
               >
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

                  <div
                     className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  >
                     <div className="flex flex-row items-center justify-between p-4">
                        {/* <!--  Top  --> */}
                        <div className="flex flex-wrap">
                           <div
                              className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-400 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                           >
                              <span className="flex items-center px-4 ">
                                 <BsFillExclamationTriangleFill size={20} />
                              </span>
                           </div>
                           <h1
                              className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase"
                           >
                              Confirm Changes
                           </h1>
                        </div>
                        <button className="focus:outline-none"
                           onClick={() => setSaveModal(false)}>
                           <span className="flex items-center px-4 text-gray-500">
                              <AiOutlineClose size={20} />
                           </span>
                        </button>
                     </div>
                     {/* <!--  Content --> */}
                     <div className="flex flex-col mx-10 my-2 text-gray-500">
                        <p className="mb-2 text-sm text-gray-500 font-raleway">
                           Kindly confirm the changes by inputting your current password.
                        </p>
                        <div className="flex flex-col">
                           <div
                              className={styles.input_group}
                              style={{
                                 border: errors.password
                                    ? "1px solid red"
                                    : "1px solid #ccc",
                              }}
                           >
                              <input
                                 type={`${show.password ? "text" : "password"}`}
                                 name="password"
                                 placeholder="Password"
                                 className={styles.input_text}
                              />
                              <span
                                 className="flex items-center px-4"
                                 onClick={() =>
                                    setShow({
                                       ...show,
                                       password: !show.password,
                                    })
                                 }
                              >
                                 <HiFingerPrint size={20} />
                              </span>
                           </div>
                           {/* Error message */}
                           {errors.password && (
                              <p role="alert" className={styles.error_text}>
                                 {errors.password?.message}
                              </p>
                           )}
                        </div>
                     </div>
                     {/* <!--  Bottom --> */}
                     <div
                        className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse"
                     >
                        <button
                           id="save-confirm"
                           className="px-5 py-3 mt-8 text-white bg-green-600 rounded hover:bg-green-500" type="submit">
                           Save Changes
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Deactivate Account */}
         {showDeactivateModal && (
            <div
               className="fixed inset-0 z-10 overflow-y-auto "
               aria-labelledby="modal-title"
               role="dialog"
               aria-modal="true"
               id="deactivate-modal"
            >
               {/* <!-- Background --> */}
               <div
                  className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
               >
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

                  <div
                     className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  >
                     <div className="flex flex-row items-center justify-between p-4">
                        {/* <!--  Top  --> */}
                        <div className="flex flex-wrap">
                           <div
                              className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-400 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                           >
                              <span className="flex items-center px-4 ">
                                 <BsFillExclamationTriangleFill size={20} />
                              </span>
                           </div>
                           <h1
                              className="my-2 ml-4 text-xl font-bold leading-6 text-gray-900 uppercase"
                           >
                              Deactivate Account
                           </h1>
                        </div>
                        <button className="focus:outline-none"
                           onClick={() => setDeactivateModal(false)}>
                           <span className="flex items-center px-4 text-gray-500">
                              <AiOutlineClose size={20} />
                           </span>
                        </button>
                     </div>
                     {/* <!--  Content --> */}
                     <div className="flex flex-col mx-10 my-2 text-gray-500">
                        <p className="mb-2 text-sm text-gray-500 font-raleway">
                           Kindly confirm the changes by inputting your current password.
                        </p>
                        <div className="flex flex-col">
                           <div
                              className={styles.input_group}
                              style={{
                                 border: errors.password
                                    ? "1px solid red"
                                    : "1px solid #ccc",
                              }}
                           >
                              <input
                                 type={`${show.password ? "text" : "password"}`}
                                 name="password"
                                 placeholder="Password"
                                 className={styles.input_text}
                              />
                              <span
                                 className="flex items-center px-4"
                                 onClick={() =>
                                    setShow({
                                       ...show,
                                       password: !show.password,
                                    })
                                 }
                              >
                                 <HiFingerPrint size={20} />
                              </span>
                           </div>
                           {/* Error message */}
                           {errors.password && (
                              <p role="alert" className={styles.error_text}>
                                 {errors.password?.message}
                              </p>
                           )}
                        </div>
                     </div>
                     {/* <!--  Bottom --> */}
                     <div
                        className="flex flex-row-reverse justify-between p-2 sm:px-6 sm:flex sm:flex-row-reverse"
                     >
                        <button
                           id="save-confirm"
                           className="px-5 py-3 mt-8 text-white bg-green-600 rounded hover:bg-green-500" type="submit">
                           Confirm
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}