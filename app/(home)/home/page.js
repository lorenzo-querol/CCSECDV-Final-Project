"use client";

import React, { useState } from "react";
import Image from "next/image";
import Home from "../home/home";
import Users from "../home/users";
import Settings from "../home/settings";

import {
    AiFillHome,
    AiFillMessage,
    AiOutlineLogout
} from "react-icons/ai";

import {
    BsFillInboxFill,
    BsFillPersonFill,
    BsSearch,
    BsFillGearFill
} from "react-icons/bs";

import {
    FaUsers
} from "react-icons/fa";

import control from "@/public/control.png";
import logo from "@/public/vercel.svg";

export default function Sidebar({ }) {
    const [close, setClose] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("Home"); // Set initial active menu item by title

    const Menus = [
        { title: "Home", icon: <AiFillHome />, content: <Home /> },
        { title: "List of Users", icon: <FaUsers />, content: <Users /> },
        { title: "Settings", icon: <BsFillGearFill />, content: <Settings /> },
        { title: "Log Out", icon: <AiOutlineLogout /> }
    ];

    const handleMenuItemClick = (title) => {
        setActiveMenuItem(title);
    };

    const renderContent = () => {
        const activeMenu = Menus.find(menu => menu.title === activeMenuItem);
        return activeMenu ? activeMenu.content : null;
    };

    return (
        <div className="fixed left-0 flex w-full h-screen">
            <div
                className={`${close ? "w-20" : "w-72"
                    } relative h-screen bg-indigo-900 p-5 pt-8 duration-300 flex flex-col justify-start`}
            >
                <Image
                    src={control}
                    alt="Control Icon"
                    className={`absolute -right-3 top-9 w-7 cursor-pointer rounded-full border-2 border-indigo-900  ${!close && "rotate-180"
                        }`}
                    onClick={() => setClose(!close)}
                    width={24}
                    height={24}
                />
                <div className="flex items-center gap-x-4">
                    <h1
                        className={`origin-left text-3xl font-medium text-white duration-200 ${close && "scale-0"
                            }`}
                    >
                        BRAND.
                    </h1>
                </div>
                <ul className="flex-grow pt-6">
                    {Menus.map((Menu, index) => (
                        <li
                            key={index}
                            className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-xl text-white hover:bg-indigo-700 ${Menu.gap ? "mt-9" : "mt-2"
                                } ${Menu.title === activeMenuItem && "bg-indigo-700"}`} // Add condition to apply active class
                            onClick={() => handleMenuItemClick(Menu.title)} // Pass the title to the click event handler
                        >
                            {Menu.icon}
                            <span className={`${close && "hidden"} origin-left duration-200`}>
                                {Menu.title}
                            </span>
                        </li>
                    ))}
                </ul>
                {/* Account */}
                <div class="flex-shrink-0 flex hover:bg-blue-00 rounded-full mt-auto">
                    <a href="#" class="flex-shrink-0 group block">
                        <div class="flex items-center">
                            <div>
                                <Image
                                    className="inline-block w-10 h-10 rounded-full"
                                    src={control}
                                    alt=""
                                    width={40}
                                    height={40}
                                />
                            </div>
                            {!close && (
                                <div class="ml-3">
                                    <p class="text-xl leading-6 font-medium text-white">
                                        User
                                    </p>
                                </div>
                            )}
                        </div>
                    </a>
                </div>
            </div>
            <div className="flex-1">
                {renderContent()} {/* Render content based on activeMenuItem */}
            </div>
        </div>
    );
}
