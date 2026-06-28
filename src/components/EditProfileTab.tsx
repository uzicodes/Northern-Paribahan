'use client';
import React from 'react';
import { Pencil, Check } from 'lucide-react';

export function EditProfileTab({ user, editName, editPhone, saving, saveSuccess, onNameChange, onPhoneChange, onSave, onCancel }: {
    user: any;
    editName: string;
    editPhone: string;
    saving: boolean;
    saveSuccess: boolean;
    onNameChange: (val: string) => void;
    onPhoneChange: (val: string) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="p-6 md:p-8 max-w-lg">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                <Pencil size={20} className="text-indigo-500" />
                Update Your Information
            </h3>

            {saveSuccess && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2 animate-in">
                    <Check size={18} />
                    Profile updated successfully!
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                        id="profile-name"
                        type="text"
                        value={editName}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>

                <div>
                    <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                        id="profile-email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        readOnly
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                </div>

                <div>
                    <label htmlFor="profile-phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-sm font-medium">+880</span>
                        <input
                            id="profile-phone"
                            type="tel"
                            value={editPhone}
                            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            placeholder="17XXXXXXXXX"
                            className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
