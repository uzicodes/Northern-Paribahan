"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { ComponentType } from "react";

const ReactDatePicker = DatePicker as unknown as ComponentType<any>;

export default function HeroDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  // Remove custom open state, use DatePicker's dropdown

  return (
    <div className="relative">
      <ReactDatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        popperPlacement="bottom-start"
        popperClassName="z-50"
        portalId="root-portal"
        customInput={
          <button
            type="button"
            className="bg-[#f7e3df] text-[#7a4c3b] rounded-xl px-4 py-1 font-semibold text-sm flex items-center gap-2"
          >
            <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/calendar--v1.png" alt="calendar" />
          </button>
        }
      />
    </div>
  );
}
