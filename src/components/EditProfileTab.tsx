'use client';

import React from 'react';
import { Pencil, Check, User, Phone, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function EditProfileTab({
    user,
    editName,
    editPhone,
    saving,
    saveSuccess,
    onNameChange,
    onPhoneChange,
    onSave,
    onCancel,
}: {
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
    // Name keydown handler: only alphabets and spaces
    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
            e.ctrlKey ||
            e.metaKey
        ) {
            return;
        }
        if (!/^[a-zA-Z\s]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Phone keydown handler: digits only, starts with 0
    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
            e.ctrlKey ||
            e.metaKey
        ) {
            return;
        }
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            return;
        }
        const target = e.currentTarget;
        if ((target.selectionStart === 0 || target.value.length === 0) && e.key !== '0') {
            e.preventDefault();
        }
    };

    return (
        <div className="p-5 sm:p-7 max-w-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Pencil size={18} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        Modify Passenger Profile
                    </h3>
                    <p className="text-xs text-slate-500">
                        Update your contact details for ticket SMS alerts and digital invoices
                    </p>
                </div>
            </div>

            {saveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>Profile information updated successfully!</span>
                </div>
            )}

            <div className="space-y-4">
                {/* Full Name */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="profile-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Full Name *
                        </label>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                            {editName.length}/50
                        </span>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User size={16} />
                        </div>
                        <input
                            id="profile-name"
                            type="text"
                            maxLength={50}
                            value={editName}
                            onKeyDown={handleNameKeyDown}
                            onChange={(e) => {
                                const clean = e.target.value.replace(/[^A-Za-z\s]/g, '').slice(0, 50);
                                onNameChange(clean);
                            }}
                            placeholder="e.g. MD. Tariqul Islam"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172144] focus:border-transparent transition-all shadow-2xs focus:bg-white"
                        />
                    </div>
                    <span className="text-[10.5px] text-slate-400 mt-1 block">
                        Alphabets and spaces only (max 50 characters).
                    </span>
                </div>

                {/* Email Address */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="profile-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Email Address
                        </label>
                        <span className="text-[10.5px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Verified Auth Email
                        </span>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail size={16} />
                        </div>
                        <input
                            id="profile-email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            readOnly
                            className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed select-none"
                        />
                    </div>
                    <span className="text-[10.5px] text-slate-400 mt-1 block">
                        Account email is locked for ticket security.
                    </span>
                </div>

                {/* Phone Number */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="profile-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Mobile Number (BD) *
                        </label>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                            {editPhone.length}/11 digits
                        </span>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Phone size={16} />
                        </div>
                        <input
                            id="profile-phone"
                            type="tel"
                            maxLength={11}
                            value={editPhone}
                            onKeyDown={handlePhoneKeyDown}
                            onChange={(e) => {
                                let digits = e.target.value.replace(/\D/g, '');
                                if (digits.length > 0 && !digits.startsWith('0')) {
                                    digits = '0' + digits.replace(/^[^0]+/, '');
                                }
                                onPhoneChange(digits.slice(0, 11));
                            }}
                            placeholder="017XXXXXXXX"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172144] focus:border-transparent transition-all shadow-2xs focus:bg-white"
                        />
                    </div>
                    <span className="text-[10.5px] text-slate-400 mt-1 block">
                        11 digits starting with 0 (e.g. 017XXXXXXXX) for journey SMS dispatch.
                    </span>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving || !editName.trim()}
                        className="flex-1 bg-[#172144] hover:bg-[#101730] text-white py-3.5 px-5 rounded-xl font-bold text-sm shadow-md shadow-[#172144]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
                    >
                        {saving ? (
                            <span>Saving Changes...</span>
                        ) : (
                            <>
                                <Check size={16} className="text-[#FCA311]" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="px-6 py-3.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm transition-all cursor-pointer text-center"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
