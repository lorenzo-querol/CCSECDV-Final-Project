"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import sanitizeHtml from "sanitize-html";
import styles from "@/app/Form.module.css";


export default function Home({ isLoggedIn }) {
  const router = useRouter();

  /** TODO: CHECK IF USER IS LOGGED IN WHEN IN HOME PAGE, ELSE REDIRECT TO LOGIN SCREEN */
  // if (!isLoggedIn) {
  //   // Redirect to the login page if the user is not logged in
  //   router.push('/login');
  //   return null; // Return null or a loading indicator while redirecting
  // }

  return (
    <div>
      <div style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "end",
            maxWidth: "900px",
            margin: "0 auto",
            color: "black"
          }}
        >
          <div>
            <ul
              style={{
                display: "end",
                listStyle: "none",
                gap: "1rem",
                marginRight: "20px"
              }}
            >
              <li>
                <Link href="/">Home </Link>
              </li>
            </ul> 
          </div> 
          <div>
            <ul
              style={{
                display: "end",
                listStyle: "none",
                gap: "1rem",
                marginRight: "20px"
              }}
            >
              <li>
                <Link href="/">Profile </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul
              style={{
                display: "end",
                listStyle: "none",
                gap: "1rem",
                marginRight: "20px"
              }}
            >
              <li>
                <button onClick={'/login'}>Sign Out </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <br></br>
        <br></br>
        <br></br>
        <h1>Welcome to the Home Page! </h1>
        <br></br>
        <br></br>
        <br></br>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>
    </div>
  );
}
//   export async function getServerSideProps({ req }) {
//     // Check if the user is logged in based on authentication logic

  
//     const isLoggedIn = req.session?.isLoggedIn || false;
  
//     return {
//       props: {
//         isLoggedIn,
//       },
//     };
//   }
 
  
  
  
  
  
