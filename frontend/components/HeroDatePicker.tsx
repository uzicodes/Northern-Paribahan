"use client";
import React, { useState } from 'react';

const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface HeroDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  children?: React.ReactNode;
}

const HeroDatePicker: React.FC<HeroDatePickerProps> = ({ selectedDate, onDateChange, children }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [open, setOpen] = useState(false);

  // Close calendar when clicking outside
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.datepicker-popover')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    onDateChange(date);
    setCurrentMonth(date);
    setOpen(false);
  };

  // Remove handleToday (no longer needed)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative inline-block w-full">
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {children ? children : (
          <button
            type="button"
            className="bg-[#C5E6CB] text-[#22543d] rounded-xl px-4 py-1 font-semibold text-sm flex items-center justify-center border-2 border-[#C5E6CB]"
          >
            <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/calendar--v1.png" alt="calendar" />
          </button>
        )}
      </div>
      {open && (
        <div className="datepicker-popover absolute left-0 mt-2 z-50 w-[240px]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-purple-600" />
                </button>
                <h3 className="text-lg font-bold text-gray-800">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-purple-600" />
                </button>
              </div>
              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((dayObj, index) => {
                  const isSelected = isSameDay(dayObj.date, selectedDate);
                  const isTodayDate = isToday(dayObj.date);
                  const isPastDate = dayObj.date < new Date(new Date().setHours(0,0,0,0));
                  return (
                    <button
                      key={index}
                      onClick={() => !isPastDate && handleDateClick(dayObj.date)}
                      disabled={isPastDate}
                      className={`
                        aspect-square rounded-xl text-sm font-medium transition-all duration-300
                        ${!dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                        ${isSelected 
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                          : 'hover:bg-purple-50 hover:scale-105'
                        }
                        ${isTodayDate && !isSelected ? 'ring-2 ring-purple-400' : ''}
                        ${isPastDate ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      {dayObj.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroDatePicker;