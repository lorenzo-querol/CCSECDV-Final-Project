import React, { useState } from "react";
// Icons
import {
  BsFillChatFill,
  BsFillInboxFill,
  BsFillPersonFill,
  BsCalendar,
  BsSearch,
  BsFillFolderFill,
  BsGearFill,
} from "react-icons/bs";
// Images
import control from "../assets/control.png";

export default function Sidebar({ children }) {
  const [open, setOpen] = useState(false);
  const Menus = [
    { title: "Dashboard", icon: <BsFillChatFill /> },
    { title: "Inbox", icon: <BsFillInboxFill /> },
    { title: "Accounts", icon: <BsFillPersonFill />, gap: true },
    { title: "Schedule", icon: <BsCalendar /> },
    { title: "Search", icon: <BsSearch /> },
    { title: "Analytics", icon: <BsFillChatFill /> },
    { title: "Files", icon: <BsFillFolderFill />, gap: true },
    { title: "Setting", icon: <BsGearFill /> },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } relative h-screen bg-purple-900  p-5 pt-8 duration-300`}
      >
        <img
          src={control}
          alt="Control Icon"
          className={`absolute -right-3 top-9 w-7 cursor-pointer rounded-full border-2 border-purple-900  ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex items-center gap-x-4">
          {/* Logo */}
          <img
            src={control}
            alt="Logo"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`origin-left text-xl font-medium text-white duration-200 ${
              !open && "scale-0"
            }`}
          >
            BRAND.
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm text-white hover:bg-purple-700 ${
                Menu.gap ? "mt-9" : "mt-2"
              } ${index === 0 && "bg-purple-700"}`}
            >
              {Menu.icon}
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-screen flex-1 p-7 text-2xl font-semibold">
        {children}
      </div>
    </div>
  );
}
