"use client";

import React, { useState } from "react";
import {
    Settings,
    Building2,
    Bell,
    Shield,
    Palette,
    Globe,
    Save,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const tabs = [
    { label: "General", icon: Building2 },
    { label: "Notifications", icon: Bell },
    { label: "Security", icon: Shield },
    { label: "Appearance", icon: Palette },
];

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("General");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your application preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs Sidebar */}
                <div className="lg:w-56 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex lg:flex-col gap-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.label
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === "General" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Company Information</h2>
                                <p className="text-sm text-gray-500">Update your business details</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                                    <div className="relative">
                                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" defaultValue="Northern Paribahan" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" defaultValue="northernparibahan.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="email" defaultValue="info@northernparibahan.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="tel" defaultValue="+880 1700-000000" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <textarea defaultValue="Banani, Dhaka, Bangladesh" rows={2} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                    <Save size={16} />
                                    Save Changes
                                </button>
                                {saved && <span className="text-sm text-emerald-600 font-medium animate-pulse">✓ Saved successfully</span>}
                            </div>
                        </div>
                    )}

                    {activeTab === "Notifications" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Notification Preferences</h2>
                                <p className="text-sm text-gray-500">Configure how you receive alerts</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: "New Booking Alert", desc: "Get notified when a new booking is made", enabled: true },
                                    { title: "Cancellation Alert", desc: "Get notified when a booking is cancelled", enabled: true },
                                    { title: "Payment Alert", desc: "Get notified on successful payments", enabled: false },
                                    { title: "Daily Summary", desc: "Receive a daily summary email of all activity", enabled: true },
                                    { title: "Weekly Report", desc: "Receive weekly analytics report", enabled: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === "Security" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Security Settings</h2>
                                <p className="text-sm text-gray-500">Manage your admin credentials</p>
                            </div>

                            <div className="space-y-5 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Passcode</label>
                                    <input type="password" placeholder="Enter current passcode" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Passcode</label>
                                    <input type="password" placeholder="Enter new passcode" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Passcode</label>
                                    <input type="password" placeholder="Confirm new passcode" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                    <Shield size={16} />
                                    Update Passcode
                                </button>
                                {saved && <span className="text-sm text-emerald-600 font-medium animate-pulse">✓ Updated successfully</span>}
                            </div>
                        </div>
                    )}

                    {activeTab === "Appearance" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Appearance</h2>
                                <p className="text-sm text-gray-500">Customize how the admin panel looks</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                                    <div className="flex gap-3">
                                        {["Light", "Dark", "System"].map((theme) => (
                                            <button
                                                key={theme}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${theme === "Light"
                                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
                                    <div className="flex gap-3">
                                        {[
                                            { name: "Indigo", color: "bg-indigo-600", ring: "ring-indigo-300" },
                                            { name: "Blue", color: "bg-blue-600", ring: "ring-blue-300" },
                                            { name: "Emerald", color: "bg-emerald-600", ring: "ring-emerald-300" },
                                            { name: "Amber", color: "bg-amber-500", ring: "ring-amber-300" },
                                            { name: "Rose", color: "bg-rose-600", ring: "ring-rose-300" },
                                        ].map((c) => (
                                            <button
                                                key={c.name}
                                                className={`h-9 w-9 rounded-full ${c.color} ${c.name === "Indigo" ? `ring-2 ${c.ring} ring-offset-2` : ""} hover:scale-110 transition-transform`}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Sidebar Density</label>
                                    <div className="flex gap-3">
                                        {["Compact", "Default", "Comfortable"].map((d) => (
                                            <button
                                                key={d}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${d === "Default"
                                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                <Save size={16} />
                                Save Preferences
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
