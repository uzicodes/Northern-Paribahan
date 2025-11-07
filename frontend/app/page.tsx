"use client";
import React from 'react';
import HeroDatePicker from '../components/HeroDatePicker';

export default function Page() {
  const [dateOfJourney, setDateOfJourney] = React.useState<Date>(new Date());
  const [fromValue, setFromValue] = React.useState<string>('');
  const [toValue, setToValue] = React.useState<string>('');
  const [showFromDropdown, setShowFromDropdown] = React.useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = React.useState<boolean>(false);

  const locations = [
    'Dinajpur',
    'Bogura',
    'Dhaka',
    'Sylhet',
    'Khulna',
    'Barisal',
    'Rajshahi',
    'Chittagong',
    "Cox's Bazar"
  ];

  const filteredFromLocations = locations.filter(location =>
    location.toLowerCase().includes(fromValue.toLowerCase())
  );

  const filteredToLocations = locations.filter(location =>
    location.toLowerCase().includes(toValue.toLowerCase())
  );

  return (
    <section className="w-full flex flex-col items-center justify-end min-h-[340px] relative">
      {/* Lowest layer image */}
      <img
        src="/1.jpg"
        alt="Hero Layer"
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-80"
        style={{ pointerEvents: 'none', maxHeight: '340px' }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: ' center/cover no-repeat',
          opacity: 0.7,
          maxHeight: '340px'
        }}
      />
      
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-start px-4 pt-44 sm:pt-52 md:pt-60">
        <div className="w-full flex justify-center items-center -mb-8 mt-16">
          <div
            className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center w-full max-w-3xl gap-2 sm:gap-0"
            style={{ position: 'relative' }}
          >
            {/* From input */}
            <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 py-2 sm:py-0 relative">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/get-on-bus.png" alt="get-on-bus" className="mr-2" />
              <input
                type="text"
                placeholder="From"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                onFocus={() => setShowFromDropdown(true)}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                className="border-none outline-none text-base w-full bg-transparent"
                style={{ fontSize: 18 }}
              />
              {showFromDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {filteredFromLocations.map((location, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setFromValue(location);
                        setShowFromDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-green-100 cursor-pointer text-base"
                      style={{ fontSize: 16 }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* To input */}
            <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 pr-4 pl-4 py-2 sm:py-0 relative">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/get-off-bus.png" alt="get-off-bus" className="mr-2" />
              <input
                type="text"
                placeholder="To"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
                onFocus={() => setShowToDropdown(true)}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                className="border-none outline-none text-base w-full bg-transparent"
                style={{ fontSize: 18 }}
              />
              {showToDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {filteredToLocations.map((location, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setToValue(location);
                        setShowToDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-green-100 cursor-pointer text-base"
                      style={{ fontSize: 16 }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
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
        
        <div className="w-full flex justify-center mt-20 mb-12">
          <button
            className="bg-[#c44d4d] text-white font-semibold text-lg rounded-3xl px-12 py-3 shadow flex items-center gap-3"
            style={{ fontSize: 22 }}
          >
            <img width="28" height="28" src="https://img.icons8.com/sf-black/64/search.png" alt="search" className="mr-2" /> Search Buses
          </button>
        </div>
      </div>
    </section>
  );
}