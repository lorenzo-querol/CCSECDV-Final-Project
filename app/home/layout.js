"use client";

import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import React, { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { BsFillGearFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import control from "@/public/control.png";

const menus = [
    { title: "Home", icon: <AiFillHome />, path: "/home" },
    { title: "Profile", icon: <FaUsers />, path: "/home/profile" },
    {
        title: "Settings",
        icon: <BsFillGearFill />,
        path: "/home/settings",
    },
];

export async function generateMetadata() {
    return {
        title: "Sling Academy",
        description:
            "This is a meta description. Welcome to slingacademy.com. Happy coding and have a nice day",
    };
}

export default function Sidebar({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const [close, setClose] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState(""); // Set initial active menu item by title
    const [user, setUser] = useState(null);
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/login");
        },
    });

    const handleMenuItemClick = (title) => {
        setActiveMenuItem(title);
    };

    useEffect(() => {
        const menu = menus.find((menu) => menu.path === pathname);
        if (menu) setActiveMenuItem(menu.title);
    }, [pathname]);

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
                    {menus.map((Menu, index) => (
                        <Link
                            key={index}
                            href={Menu.path}
                            className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-xl text-white hover:bg-indigo-700 ${
                                Menu.gap ? "mt-9" : "mt-2"
                            } ${
                                Menu.title === activeMenuItem && "bg-indigo-700"
                            }`} // Add condition to apply active class
                        >
                            <li
                                className="flex items-center space-x-2"
                                onClick={() => handleMenuItemClick(Menu.title)} // Pass the title to the click event handler
                            >
                                {Menu.icon}
                                <span
                                    className={`${
                                        close && "hidden"
                                    } origin-left duration-200`}
                                >
                                    {Menu.title}
                                </span>
                            </li>
                        </Link>
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
                            <span
                                className={`${
                                    close && "hidden"
                                } origin-left duration-200`}
                            >
                                Log Out
                            </span>
                        </div>
                    </li>
                </ul>

                {/* Account */}
                {!session ? (
                    <div>Loading...</div>
                ) : (
                    <div className="flex flex-shrink-0 mt-auto rounded-full hover:bg-blue-00">
                        <div className="flex-shrink-0 block group">
                            <div className="flex items-center">
                                <div>
                                    <Image
                                        className="inline-block w-10 h-10 rounded-full"
                                        src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${session.user.avatar}`}
                                        alt=""
                                        style={{
                                            objectFit: "cover",
                                        }}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                {!close && (
                                    <div className="ml-3">
                                        <p className="text-xl font-medium leading-6 text-white">
                                            {session.user.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}
