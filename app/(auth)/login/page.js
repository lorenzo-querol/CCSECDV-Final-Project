"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useRouter } from 'next/navigation';


import styles from "@/app/Form.module.css";
import sanitizeHtml from "sanitize-html";
export default function Login() {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [objectID, setObjectID] = useState("");


    
    const handleSubmit = async (e) => {

        e.preventDefault();
        const params = {
            email : email,
            password : password
        }
        
        router.push('/register')
        // GO TO LANDING PAGE WITH SESSION
    };

        // GO TO LANDING PAGE WITH SESSION
        // *keeps redirecting to sign-up!!!
        
    //     if (response.ok) {
    //         const users = await response.json();
    //         const admin = users.find((admin) => admin.objectId === "64b15c514a0fdddbd5a67305");
        
    //         if (admin) {
    //           // Admin credentials matched, redirect to admin dashboard
    //           router.push("/admin");
    //         } else {
    //           // Credentials not found, redirect to the home page
    //           router.push("/");
    //         }
    //       } else {
    //         throw new Error("An error occurred during fetch");
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    // };

    return (
        <div className="flex justify-center items-center h-screen">
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
                <button className={styles.button} type="submit" onClick={handleSubmit}>
                    Sign In
                </button>
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

            {/* Got to register */}
            <div className="mt-8 text-center">
                Don&apos;t have an account?
                <span className="ml-2 text-indigo-500">
                    <Link href="/register">Register</Link>
                </span>
            </div>
        </form>
    </div>
    );
}
