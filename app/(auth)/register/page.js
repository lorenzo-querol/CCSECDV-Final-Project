"use client";

import React, { useEffect, useState, useRef } from "react";
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

export default function Register() {
    const inputFileRef = useRef();
    const [show, setShow] = useState({
        password: false,
        confirmPassword: false,
    });
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();

        const cleanedData = {
            ...data,
            firstName: sanitizeHtml(data.firstName.trim()),
            lastName: sanitizeHtml(data.lastName.trim()),
            phoneNumber: sanitizeHtml(data.phoneNumber.trim()),
            email: sanitizeHtml(data.email.trim()),
        };
        delete cleanedData.confirmPassword;

        formData.append("avatar", data.avatar[0]);
        formData.append("userInfo", JSON.stringify(cleanedData));

        try {
            await axios.post("/api/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const watchPassword = watch("password");
    const validatePasswordMatch = (value) => {
        if (value === watchPassword) {
            return true;
        }
        return "Password do not match";
    };

    return (
        <div>
            <form
                className="relative z-10 mx-auto w-full max-w-[625px] space-y-3 rounded-md bg-white p-8 text-slate-900"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="py-3 mb-4 text-4xl font-bold text-center">
                    Create an Account
                </h2>
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
                                    required: "First name is required",
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
                                    required: "Last name is required",
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
                                required: "First name is required",
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
                                required: "Email is required",
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
                                required: "Password is required",
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
                            {...register("confirmPassword", {
                                required: "Confirm password is required",
                                validate: validatePasswordMatch, // Add the validate function to check password match
                            })}
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
                            required: "Profile photo is required",
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
                    {/* Register button */}
                    <button className={styles.button} type="submit">
                        Register
                    </button>
                </div>
                {/* Got to sign in */}
                <p className="mt-8 text-center">
                    Already have an account?
                    <span className="ml-2 text-indigo-500">
                        <Link href="/login">Sign in</Link>
                    </span>
                </p>
            </form>
        </div>
    );
}
