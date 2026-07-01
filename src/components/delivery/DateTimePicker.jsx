import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  format,
  parse,
  addHours,
  isToday,
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  isSameDay
} from 'date-fns';
import { FaLock } from 'react-icons/fa';
import { API } from "../../utils/api";

export const TimeSlotPicker = ({ onTimeSlotSelect, PIN }) => {
  const token = import.meta.env.VITE_API_KEY;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timezone] = useState('IST');
  const [apiDate, setApiDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dateInputRef = useRef(null);

  // Fetch current India time from timeapi.io
  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        // const response = await axios.get('https://a4celebration.com/api/api/time',
        const response = await axios.get(`${API}/api/time`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );
        const { year, month, day, hour, minute } = response.data;

        // Create date object from API response (month is 1-12 in the API)
        const currentDate = new Date(year, month - 1, day, hour, minute);
        setApiDate(currentDate);

        // Set both min date and selected date to API date
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching time:', error);
        // Fallback - shouldn't normally happen
        const now = new Date();
        setApiDate(now);
        setSelectedDate(format(now, 'yyyy-MM-dd'));
        setIsLoading(false);
      }
    };

    fetchCurrentTime();
  }, []);

  const handleInputClick = () => {
    if (PIN !== false && dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Generate time slots based on selected date
  useEffect(() => {
    if (!selectedDate || PIN === false || !apiDate) {
      setTimeSlots([]);
      return;
    }

    const date = parse(selectedDate, 'yyyy-MM-dd', new Date());
    const isCurrentDay = isSameDay(date, apiDate);

    // Define operating hours (10 AM to 10 PM)
    const dayStart = setHours(setMinutes(date, 0), 10); // 10:00 AM
    const dayEnd = setHours(setMinutes(date, 0), 22);  // 10:00 PM

    const slots = [];
    let currentSlotStart = dayStart;

    // If today, skip the next available slot (add 3 hours to current time)
    if (isCurrentDay) {
      const nextAvailable = addHours(apiDate, 3); // Use apiDate instead of local time
      if (isBefore(nextAvailable, dayStart)) {
        currentSlotStart = dayStart;
      } else if (isAfter(nextAvailable, dayEnd)) {
        // No slots available today
        setTimeSlots([]);
        return;
      } else {
        // Round up to next 3-hour increment
        const hours = nextAvailable.getHours();
        const nextSlotHour = Math.ceil(hours / 3) * 3;
        currentSlotStart = setHours(nextAvailable, nextSlotHour);
        currentSlotStart = setMinutes(currentSlotStart, 0);
      }
    }

    // Generate 3-hour slots
    while (isBefore(currentSlotStart, dayEnd)) {
      const slotEnd = addHours(currentSlotStart, 3);

      // Don't create slots that would go past closing time
      if (isAfter(slotEnd, dayEnd)) {
        break;
      }

      slots.push({
        start: new Date(currentSlotStart),
        end: new Date(slotEnd),
        label: `${format(currentSlotStart, 'h:mm a')} - ${format(slotEnd, 'h:mm a')}`
      });

      currentSlotStart = slotEnd;
    }

    setTimeSlots(slots);
    setSelectedSlot(null);
  }, [selectedDate, PIN, apiDate]);

  const handleDateChange = (e) => {
    if (PIN === false) return;

    const chosenDate = new Date(e.target.value);
    const minDate = new Date(format(apiDate, 'yyyy-MM-dd'));

    if (chosenDate < minDate) {
      e.target.value = format(apiDate, 'yyyy-MM-dd');
      return;
    }

    setSelectedDate(e.target.value);
    onTimeSlotSelect(null);
  };


  const handleSlotSelect = (slot) => {
    if (PIN === false) return;
    setSelectedSlot(slot);
    onTimeSlotSelect({
      date: format(slot.start, 'yyyy-MM-dd'),
      startTime: format(slot.start, 'h:mm a'),
      endTime: format(slot.end, 'h:mm a'),
      timezone: timezone,
      isoStart: slot.start.toISOString(),
      isoEnd: slot.end.toISOString()
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading time information...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col relative">
        <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Select Date (IST)
        </label>

        <div className="relative">
          <input
            type="date"
            id="date"
            ref={dateInputRef}
            value={selectedDate}
            onChange={handleDateChange}
            onClick={handleInputClick}
            min={apiDate ? format(apiDate, 'yyyy-MM-dd') : ''}
            disabled={PIN === false}
            className={`px-4 py-1.5 border rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition shadow-sm w-full ${PIN === false
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed pr-8 sm:pr-20 md:pr-8'
              : 'border-amber-200 hover:border-amber-300 cursor-pointer pr-8 sm:pr-20 md:pr-8'
              }`}
          />
          {PIN === false && (
            <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
          )}
        </div>
      </div>

      {timeSlots.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Available Time Slots (3-hour intervals)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotSelect(slot)}
                disabled={PIN === false}
                className={`p-3 border rounded-lg text-center transition ${selectedSlot && selectedSlot.start.getTime() === slot.start.getTime()
                  ? 'bg-amber-500 text-white border-amber-500'
                  : PIN === false
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    : 'bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      ) : selectedDate ? (
        <p className="text-gray-500">
          {apiDate && isToday(parse(selectedDate, 'yyyy-MM-dd', apiDate))
            ? "No more available slots for today. Please select another date."
            : "No available slots for the selected date."}
        </p>
      ) : null}

      {selectedSlot && (
        <p className="text-green-600 text-sm mt-1">
          Selected: {format(selectedSlot.start, 'MMMM d, yyyy')} • {selectedSlot.label} ({timezone})
        </p>
      )}
    </div>
  );
};