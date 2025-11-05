import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {cookies} from "next/headers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Savora",
    description: "Your finance manager",
    icons: {
        icon: '/light.svg'
    }
};

export default async function RootLayout(
    {
        children,
    }: Readonly<{
        children: ReactNode;
    }>
) {
    const cookiesStore = await cookies();
    const theme = cookiesStore.get("theme")?.value ?? "light";
    return (
        <html lang="en" className={theme === "dark" ? "dark" : ""}>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <>
            {children}
        </>
        </body>
        </html>
    );
}
