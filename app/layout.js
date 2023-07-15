import "./globals.css";
import Image from "next/image";
import BackgroundImage from "@/public/login.jpg";

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html className="relative w-full h-screen">
            <body className="flex items-center justify-center h-full">
                <Image src={BackgroundImage} alt="background image" fill />
                {children}
            </body>
        </html>
    );
}
