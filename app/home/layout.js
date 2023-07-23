"use client";

import { AiFillHome, AiFillMessage, AiOutlineLogout } from "react-icons/ai";
import {
	BsFillGearFill,
	BsFillInboxFill,
	BsFillPersonFill,
	BsSearch,
} from "react-icons/bs";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, getSession, signOut } from "next-auth/react";

import { FaUsers } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import control from "@/public/control.png";
import logo from "@/public/vercel.svg";

export default function Sidebar({ children }) {
	const [close, setClose] = useState(false);
	const [activeMenuItem, setActiveMenuItem] = useState(""); // Set initial active menu item by title
	const [pathname, setPathname] = useState(""); // Initialize pathname state with an empty string
	const [user, setUser] = useState(null)
	const { data : session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/login");
        },
    });
	async function fetchUserData(userID){ // Data to display current user name and avatar
        const url = 'api/users/' + userID 
        const res = await fetch(url, { 
			method: 'GET'})
		const data = await res.json();
		console.log(data)
		setUser(data.data)
	  }
    async function getSesh() { // getSession
        const session = await getSession()
		fetchUserData(session.user.user_id);
      }

    useEffect(() => {
        if (session) { // SESSION IS CALLED RIGHT AFTER LOGGING IN
           fetchUserData(session.user.user_id);
        }
        
        else { // THIS PART IS CALLED SINCE SESSION BECOMES UNDEFINED ONCE PAGE IS REFRESHED / RELOADED
			
           getSesh();
		   
        }
        setPathname(window.location.pathname);
    }, []);
	const Menus = useMemo(
		() => [
			{ title: "Home", icon: <AiFillHome />, path: "/home" },
			{ title: "Profile", icon: <FaUsers />, path: "/profile" },
			{ title: "Settings", icon: <BsFillGearFill />, path: "/settings" },
		],
		[],
	);

	useEffect(() => {
		// Set the active menu item initially based on the pathname
		const cleanPathname = pathname.replace(/\/$/, "");

		const menu = Menus.find((menu) => menu.path === cleanPathname);
		// alert(menu.path)
		if (menu) {
			setActiveMenuItem(menu.title);
		}
	}, [pathname, Menus]);

	const handleMenuItemClick = (title, path) => {
		setActiveMenuItem(title);
	};
	if (!user) return <div>Loading...</div>;
	return (
		<div className="fixed left-0 flex w-full h-screen">
			<div
				className={`${
					close ? "w-20" : "w-72"
				} relative h-screen bg-indigo-900 p-5 pt-8 duration-300 flex flex-col justify-start`}
			>
				<Image
					src={control}
					alt="Control Icon"
					className={`absolute -right-3 top-9 w-7 cursor-pointer rounded-full border-2 border-indigo-900  ${
						!close && "rotate-180"
					}`}
					onClick={() => setClose(!close)}
					width={24}
					height={24}
				/>
				<div className="flex items-center gap-x-4">
					<h1
						className={`origin-left text-3xl font-medium text-white duration-200 ${
							close && "scale-0"
						}`}
					>
						THOUGHTS.
					</h1>
				</div>
				<ul className="flex-grow pt-6">
					{Menus.map((Menu, index) => (
						<li
							key={index}
							className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-xl text-white hover:bg-indigo-700 ${
								Menu.gap ? "mt-9" : "mt-2"
							} ${Menu.title === activeMenuItem && "bg-indigo-700"}`} // Add condition to apply active class
							onClick={() => handleMenuItemClick(Menu.title)} // Pass the title to the click event handler
						>
							<Link
								href={Menu.path}
								className="flex items-center space-x-2"
							>
								{Menu.icon}
								<span
									className={`${close && "hidden"} origin-left duration-200`}
								>
									{Menu.title}
								</span>
							</Link>
						</li>
					))}
					<li
						className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-xl text-white hover:bg-indigo-700 mt-2`}
						onClick={() =>
							signOut({
								callbackUrl: "/login",
							})
						}
					>
						<div className="flex items-center space-x-2">
							<AiOutlineLogout />
							<span className={`${close && "hidden"} origin-left duration-200`}>
								Log Out
							</span>
						</div>
					</li>
				</ul>

				{/* Account */}
				<div className="flex flex-shrink-0 mt-auto rounded-full hover:bg-blue-00">
					<a
						href="#"
						className="flex-shrink-0 block group"
					>

						<div className="flex items-center">
							<div>
								<Image
									className="inline-block w-10 h-10 rounded-full"
									src={`data:image/${user.avatar.ext.slice(1)};base64,${user.avatar.data}`}
									alt=""
									width={40}
									height={40}
								/>
							</div>
							{!close && (
								<div className="ml-3">
									<p className="text-xl font-medium leading-6 text-white">
										{user.name}
									</p>
								</div>
							)}
						</div>

					</a>
				</div>
			</div>
			<div className="flex-1">{children}</div>
		</div>
	);
}
