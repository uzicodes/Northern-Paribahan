import React from "react";

export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="h-8 w-44 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
                </div>
                <div className="h-11 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        </div>
                        <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                {/* Table Rows */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 border-b border-gray-50 dark:border-gray-700/50 flex items-center gap-4">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
