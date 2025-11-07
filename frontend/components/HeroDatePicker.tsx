"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HeroDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-[#f7e3df] text-[#7a4c3b] rounded-xl px-4 py-1 font-semibold text-sm flex items-center gap-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/calendar--v1.png" alt="calendar" />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-50">
          <DatePicker
            selected={startDate}
            onChange={(date) => { setStartDate(date); setOpen(false); }}
            inline
          />
        </div>
      )}
    </div>
  );
}
