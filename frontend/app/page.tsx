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
    location.toLowerCase().includes(fromValue.toLowerCase()) && location !== toValue
  );

  const filteredToLocations = locations.filter(location =>
    location.toLowerCase().includes(toValue.toLowerCase()) && location !== fromValue
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
            className="rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center w-full max-w-3xl gap-2 sm:gap-0"
            style={{ position: 'relative', backgroundColor: '#EDF5F0' }}
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
                className="border-2 border-[#c44d4d] outline-none text-base w-full bg-transparent rounded-lg px-3 py-2"
                style={{ fontSize: 18 }}
              />
              {showFromDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {filteredFromLocations.map((location, index) => (
                    <div
                      key={index}
                      onMouseDown={() => {
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
                className="border-2 border-[#c44d4d] outline-none text-base w-full bg-transparent rounded-lg px-3 py-2"
                style={{ fontSize: 18 }}
              />
              {showToDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {filteredToLocations.map((location, index) => (
                    <div
                      key={index}
                      onMouseDown={() => {
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

      {/* Promo & What's New Section */}
      <div className="w-full flex flex-col items-center px-2 sm:px-0">


        {/* Promo Cards */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1 */}
          <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl" style={{backgroundColor:'#B4EDD0'}}>
            <div className="font-bold text-lg mt-2 mb-1">Save up to Tk 500 on bkash payments</div>
            <div className="text-sm text-gray-700 mb-2">Valid till 31 Dec</div>
            <div className="flex items-center mt-auto">
              <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow">
                <img width="20" height="20" src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" />BK500
              </span>
            </div>
            <img src="/bkash.png" alt="bKash logo" className="absolute bottom-0 right-4 w-20 h-20 object-contain" />
          </div>
          {/* Card 2 */}
          <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl" style={{backgroundColor:'#B4EDD0'}}>
            <div className="font-bold text-lg mt-2 mb-1">Get upto 10% off on Return tickets</div>
            <div className="text-sm text-gray-700 mb-2">Valid till 30 Nov</div>
            <div className="flex items-center mt-auto">
              <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow">
                <img width="20" height="20" src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" />RETURN10
              </span>
            </div>
            <img src="/return.jpg" alt="return" className="absolute bottom-0 right-4 w-20 h-20 object-contain" />
          </div> 
          {/* Card 3 */}
          <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl" style={{backgroundColor:'#B4EDD0'}}>
            <div className="font-bold text-lg mt-2 mb-1">Save up to Tk 300 on selected hotels in Cox's Bazar</div>
            <div className="text-sm text-gray-700 mb-2">Valid till 30 Nov</div>
            <div className="flex items-center mt-auto">
              <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow">
                <img width="20" height="20" src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" />HOTEL300
              </span>
            </div>
              <img src="/hotels.jpg" alt="hotels" className="absolute bottom-0 right-4 w-28 h-28 object-contain" />
          </div>
          {/* Card 4 */}
          <div className="p-6 flex flex-col justify-between min-h-[110px] shadow-md relative rounded-2xl" style={{backgroundColor:'#B4EDD0'}}>
            <div className="font-bold text-lg mt-2 mb-1">Save upto Tk 500 with BRAC Bank Cards</div>
            <div className="text-sm text-gray-700 mb-2">Valid till 15 Dec</div>
            <div className="flex items-center mt-auto">
              <span className="bg-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm shadow">
                <img width="20" height="20" src="https://img.icons8.com/color-glass/48/discount--v1.png" alt="discount" className="inline-block" />BB500
              </span>
            </div>
            <img src="/brac_bank.png" alt="brac bank logo" className="absolute bottom-0 right-4 w-20 h-20 object-contain" />
          </div>
        </div>

        {/* What's New Section */}
        <div className="w-full max-w-7xl mt-8">
          <h2 className="text-2xl font-bold mb-4">What's new</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl bg-[#2B2D42] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-white relative">
              <div className="flex items-center gap-2 mb-2">
                
              </div>
              <div className="font-bold text-base mb-1">Maximum savings on car insurance. Cashless claims everywhere.</div>

            </div>
            {/* Card 2 */}
            <div className="rounded-2xl bg-[#8B1E3F] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-white relative">
              <div className="font-bold text-base mb-1">Free Cancellation</div>
              <div className="text-sm mb-2">Get 100% refund on cancellation</div>

              {/* Removed image from last row card */}
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl bg-[#F8E7E7] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-black relative">
              <div className="font-bold text-base mb-1">Introducing Bus timetable</div>
              <div className="text-sm mb-2">Get local bus timings between cities in your state</div>

            </div>
            {/* Card 4 */}
            <div className="rounded-2xl bg-[#F1F6FB] p-6 flex flex-col justify-between min-h-[90px] shadow-md text-[#2B2D42] relative">
              <div className="font-bold text-base mb-1">Flexible Ticketing</div>
              <div className="text-sm mb-2">Get amazing benefits on Date Change & Cancellation</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Extra spacing under last row */}
      <div className="pb-16"></div>
    </section>
  );
}

