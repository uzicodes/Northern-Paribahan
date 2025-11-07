"use client";
import { useRef } from "react";

export default function HeroDatePicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-[#f7e3df] text-[#7a4c3b] rounded-xl px-4 py-1 font-semibold text-sm flex items-center gap-2"
        onClick={() => {
          if (inputRef.current) {
            (inputRef.current as any).showPicker ? (inputRef.current as any).showPicker() : inputRef.current.focus();
          }
        }}
      >
        <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/calendar--v1.png" alt="calendar" />
      </button>
      <input
        type="date"
        ref={inputRef}
        className="absolute left-0 top-10 z-50 bg-white border rounded shadow px-2 py-1"
        style={{ minWidth: 120, display: 'none' }}
        onBlur={e => { e.target.style.display = 'none'; }}
        onFocus={e => { e.target.style.display = 'block'; }}
      />
    </div>
  );
}
