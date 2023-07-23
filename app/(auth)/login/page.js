"use client";

import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import axios from "axios";
import sanitizeHtml from "sanitize-html";
import styles from "@/app/Form.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
	const { status } = useSession();
	const router = useRouter();
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState(false); // New state variable for login error

	const handleSubmit = async (event) => {
		try {
			event.preventDefault();

			const result = await signIn("credentials", {
				redirect: false,
				email: email,
				password: password,
			});

			if (result.error) {
				setLoginError(true);
				return;
			}

			router.push("/home");
			setLoginError(false);
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		if (status === "authenticated") router.replace("/home");
	}, [status, router]);

	return (
		<form
			className="relative z-10 mx-auto w-full max-w-[450px] space-y-3 rounded-md bg-white div-8 text-slate-900 p-8"
			onSubmit={handleSubmit}
		>
			<h2 className="py-3 mb-4 text-4xl font-bold text-center">Sign In</h2>
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
				{loginError && (
					<label className="flex justify-center text-red-500">
						Login failed; Invalid email or password!
					</label>
				)}
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
