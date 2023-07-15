"use client";

import React, { useState } from "react";
import Image from "next/image";
import Home from "../home/home";
import Users from "../home/users";

import {
    AiFillHome,
    AiFillMessage,
    AiOutlineLogout
} from "react-icons/ai";

import {
    BsFillInboxFill,
    BsFillPersonFill,
    BsSearch,
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
        <div className="fixed left-0 flex">
            <div
                className={`${close ? "w-20" : "w-72"
                    } relative h-screen bg-purple-900 p-5 pt-8 duration-300`}
            >
                <Image
                    src={control}
                    alt="Control Icon"
                    className={`absolute -right-3 top-9 w-7 cursor-pointer rounded-full border-2 border-purple-900  ${!close && "rotate-180"
                        }`}
                    onClick={() => setClose(!close)}
                    width={24}
                    height={24}
                />
                <div className="flex items-center gap-x-4">
                    <h1
                        className={`origin-left text-xl font-medium text-white duration-200 ${close && "scale-0"
                            }`}
                    >
                        BRAND.
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li
                            key={index}
                            className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-base text-white hover:bg-purple-700 ${Menu.gap ? "mt-9" : "mt-2"
                                } ${Menu.title === activeMenuItem && "bg-purple-700"}`} // Add condition to apply active class
                            onClick={() => handleMenuItemClick(Menu.title)} // Pass the title to the click event handler
                        >
                            {Menu.icon}
                            <span className={`${close && "hidden"} origin-left duration-200`}>
                                {Menu.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 h-screen text-2xl font-semibold p-7">
                {renderContent()} {/* Render content based on activeMenuItem */}
            </div>
        </div>
    );
}
