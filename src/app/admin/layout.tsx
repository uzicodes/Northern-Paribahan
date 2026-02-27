"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard,
    Ticket,
    Bus,
    MapPinned,
    Users,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    Sun,
    Moon,
} from "lucide-react";

const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: Ticket },
    { label: "Buses", href: "/admin/buses", icon: Bus },
    { label: "Routes", href: "/admin/routes", icon: MapPinned },
    { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [theme, setTheme] = React.useState<"light" | "dark">("light");

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // Don't render the admin layout on the login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <div className={`${theme === "dark" ? "dark" : ""}`}>
            <div className={`fixed inset-0 z-[100] flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
                {/* Mobile overlay */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-[110] bg-black/50 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                    fixed top-0 left-0 bottom-0 z-[120] flex flex-col bg-indigo-950 dark:bg-slate-950 text-white
                    transition-all duration-300 ease-in-out
                    ${collapsed ? "w-[72px]" : "w-64"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static
                `}
                >
                    {/* Sidebar Header */}
                    <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
                        <img src="/logo.png" alt="Logo" className="h-8 w-8 shrink-0" />
                        {!collapsed && (
                            <span className="text-lg font-bold tracking-tight" style={{ color: "#FCA311" }}>
                                Admin Panel
                            </span>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                    transition-all duration-200 group
                                    ${active
                                            ? "bg-white/10 text-[#FCA311] shadow-md"
                                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                                        }
                                    ${collapsed ? "justify-center px-2" : ""}
                                `}
                                    title={collapsed ? link.label : undefined}
                                >
                                    <Icon size={20} className={`shrink-0 ${active ? "text-[#FCA311]" : "text-gray-400 group-hover:text-white"}`} />
                                    {!collapsed && <span>{link.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapse Toggle (desktop only) */}
                    <div className="hidden lg:block px-3 pb-2">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
                        >
                            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                            {!collapsed && <span>Collapse</span>}
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="px-3 pb-5 border-t border-white/10 pt-3">
                        <button
                            onClick={handleLogout}
                            className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full
                            ${collapsed ? "justify-center px-2" : ""}
                        `}
                            title={collapsed ? "Log Out" : undefined}
                        >
                            <LogOut size={20} className="shrink-0" />
                            {!collapsed && <span>Log Out</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen overflow-auto relative">
                    {/* Theme Toggle Button */}
                    <div className="absolute top-4 right-6 z-[101]">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
