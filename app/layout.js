"use client";

import "./globals.css";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
	return (
		<html className="relative w-full h-screen">
			<body className="flex items-center justify-center h-full">
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
