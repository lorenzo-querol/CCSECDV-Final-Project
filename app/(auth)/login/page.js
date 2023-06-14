"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";

import styles from "@/app/Form.module.css";

export default function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO If email and password did not match.
        console.log("Username: ", email, "Password: ", password);
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
                <label className="flex justify-center text-red-500">
                    Login failed; Invalid email or password!
                </label>
                {/* Sign in button */}
                <button className={styles.button}>Sign In</button>
                <div className="flex justify-end">
                    <div className="flex items-center mt-2">
                        Forgot Password?
                    </div>
                    {/* <div className="flex items-center mt-2">
                        <input className="mr-2 rounded" type="checkbox" />
                        Remember Me
                    </div> */}
                </div>
            </div>
            {/* <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <div className="mx-4 mb-0 font-semibold text-center ">or</div>
            </div> */}
            {/* Sign in with Google */}
            {/* <button className={styles.button_custom}>
                <FcGoogle className="mr-2" size={20} />
                <span>Sign in with Google</span>
            </button> */}

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
