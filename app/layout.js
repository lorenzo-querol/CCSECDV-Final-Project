"use client";

import "./globals.css";

import { SessionProvider } from "next-auth/react";

export const metadata = {
    title: "Sling Academy",
    description:
        "This is a meta description. Welcome to slingacademy.com. Happy coding and have a nice day",
};

export default function RootLayout({ children }) {
    return (
        <html className="relative w-full h-screen">
            <body className="flex items-center justify-center h-full">
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
