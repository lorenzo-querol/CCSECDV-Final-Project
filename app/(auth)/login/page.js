"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";

import styles from "@/app/Form.module.css";
import sanitizeHtml from "sanitize-html";
export default function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        const formData = new FormData();

        const cleanedData = {
            ...data,
            email: sanitizeHtml(data.email.trim())
        };

        console.log('Email: ', data.email, 'Password', data.password)

        // GO TO LANDING PAGE WITH SESSION
        router.push('/home')
    };

    return (
        <form
            className="relative z-10 mx-auto w-full max-w-[450px] space-y-3 rounded-md bg-white div-8 text-slate-900 p-8"
            onSubmit={handleSubmit}
        >
            <h2 className="py-3 mb-4 text-4xl font-bold text-center">
                Sign In
            </h2>
            <div>Enter your email and password to sign in</div>

            {/* Email */}
            <div className={styles.input_group}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={styles.input_text}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <span className="flex items-center px-4 icon">
                    <HiAtSymbol size={20} />
                </span>
            </div>

            {/* Password */}
            <div className={styles.input_group}>
                <input
                    type={`${show ? "text" : "password"}`}
                    name="password"
                    placeholder="Password"
                    className={styles.input_text}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span
                    className="flex items-center px-4 icon"
                    onClick={() => setShow(!show)}
                >
                    <HiFingerPrint size={20} />
                </span>
            </div>
            <div>
                {/* Error Message */}
                {/* <label className="flex justify-center text-red-500">
                    Login failed; Invalid email or password!
                </label> */}
                {/* Sign in button */}
                <button className={styles.button}>Sign In</button>
            </div>

            {/* Got to register */}
            <div className="mt-8 text-center">
                Don&apos;t have an account?
                <span className="ml-2 text-indigo-500">
                    <Link href="/register">Register</Link>
                </span>
            </div>
        </form>
    );
}
