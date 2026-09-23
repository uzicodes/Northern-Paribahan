"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { satisfy } from "@/lib/fonts";
import NavbarClient from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function PublicShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <div className="flex-1 w-full h-full flex flex-col">{children}</div>;
    }

    return (
        <>
            <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 flex justify-center pointer-events-none">
                <div className="pointer-events-auto w-full max-w-5xl bg-[#172144]/95 backdrop-blur-md border border-[#223062] rounded-full shadow-xl shadow-black/20 px-4 sm:px-6 h-[58px] flex items-center justify-between transition-all duration-300">
                    <Link href="/" className="font-semibold text-lg flex items-center gap-2.5">
                        <Image src="/logo.png" alt="Northern Paribahan Logo" width={32} height={32} style={{ display: "inline-block", verticalAlign: "middle" }} priority />
                        <span className={satisfy.className} style={{ color: "#FCA311", fontSize: "24px" }}>Northern Paribahan</span>
                    </Link>
                    <div style={{ color: "#F1F604" }}><NavbarClient /></div>
                </div>
            </header>
            <main className="flex-grow">
                <PageLoader>{children}</PageLoader>
            </main>
            <Footer />
        </>
    );
}

