"use client";
import React from 'react';
import HeroDatePicker from '../components/HeroDatePicker';
export default function Page() {
  const [dateOfJourney, setDateOfJourney] = React.useState<Date>(new Date());

  return (
    <section
      className="w-full flex flex-col items-center justify-end min-h-[340px] rounded-b-[40px] relative"
      style={{
        background: 'linear-gradient(90deg, #3a4660 0%, #b6b6e5 100%)',
        padding: 0,
        margin: 0,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
      }}
    >
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'url(/bus-hero-bg.svg) center/cover no-repeat',
          opacity: 0.7,
        }}
      />
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-start px-4 pt-12 sm:pt-16 md:pt-20">
        <h1
          className="text-white font-bold leading-tight mb-8 drop-shadow-lg"
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginLeft: 0 }}
        >
          No. 1 online<br />bus ticket booking site
        </h1>
        <div className="w-full flex justify-center items-center -mb-16">
          <div
            className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center w-full max-w-3xl gap-2 sm:gap-0"
            style={{ position: 'relative' }}
          >
            {/* From input */}
            <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 py-2 sm:py-0">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/get-on-bus.png" alt="get-on-bus" className="mr-2" />
              <input
                type="text"
                placeholder="From"
                className="border-none outline-none text-base w-full bg-transparent"
                style={{ fontSize: 18 }}
              />
            </div>
            {/* To input */}
            <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 pl-4 py-2 sm:py-0">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/get-off-bus.png" alt="get-off-bus" className="mr-2" />
              <input
                type="text"
                placeholder="To"
                className="border-none outline-none text-base w-full bg-transparent"
                style={{ fontSize: 18 }}
              />
            </div>
            {/* Date of Journey */}
            <div className="flex items-center border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 pl-4 py-2 sm:py-0">
              <div className="text-xs text-gray-500 mr-2">Date of Journey</div>
              <div className="font-semibold text-base">
                {dateOfJourney.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="ml-2">
                <HeroDatePicker selectedDate={dateOfJourney} onDateChange={setDateOfJourney} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-16 mb-12">
          <button
            className="bg-[#c44d4d] text-white font-semibold text-lg rounded-3xl px-12 py-3 shadow flex items-center gap-3 mt-6"
            style={{ fontSize: 22 }}
          >
            <img width="28" height="28" src="https://img.icons8.com/sf-black/64/search.png" alt="search" className="mr-2" /> Search buses
          </button>
        </div>
      </div>
    </section>
  );
}

