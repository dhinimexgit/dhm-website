'use client';

import { useState, useMemo } from 'react';
import type { CalendarEvent } from '@/types/booking';

type CalendarViewProps = {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
  startHour?: number;
  endHour?: number;
};

// Consistent time formatting to avoid hydration errors
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

export function CalendarView({ 
  events, 
  onEventClick, 
  onTimeSlotClick,
  startHour = 7,
  endHour = 19 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  const HOUR_HEIGHT = 60; // Height of each hour row in pixels

  // Get start of week (Monday)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Get start of month
  const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
  
  const days = useMemo(() => {
    if (view === 'day') {
      return [currentDate];
    } else if (view === 'week') {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });
    } else {
      // Month view - get all days in the month
      const start = getStartOfMonth(currentDate);
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(start);
        date.setDate(i + 1);
        return date;
      });
    }
  }, [currentDate, view, startOfWeek]);

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Get events for a specific day (for positioning)
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart.toDateString() === date.toDateString();
    });
  };

  // Calculate event position and height (relative to its starting hour cell)
  const getEventStyle = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Minutes within the starting hour (0-59)
    const startMinuteOffset = eventStart.getMinutes();
    
    // Total duration in minutes
    const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    
    // Top offset within the cell (based on minutes past the hour)
    const top = (startMinuteOffset / 60) * HOUR_HEIGHT;
    
    // Height based on duration
    const height = (durationMinutes / 60) * HOUR_HEIGHT;
    
    return {
      top: `${top}px`,
      height: `${Math.max(height, 24)}px`, // Minimum height for visibility
    };
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatDay = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const formatMonth = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatHour = (hour: number) => {
    return hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {view === 'month' 
                ? formatMonth(currentDate)
                : view === 'week' 
                  ? `${formatDate(days[0])} - ${formatDate(days[6])}`
                  : formatDate(currentDate)
              }
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'day' ? 'bg-white text-[#2E388C]' : 'text-white hover:bg-white/20'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'week' ? 'bg-white text-[#2E388C]' : 'text-white hover:bg-white/20'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  view === 'month' ? 'bg-white text-[#2E388C]' : 'text-white hover:bg-white/20'
                }`}
              >
                Month
              </button>
            </div>

            <div className="flex gap-1">
              <button
                onClick={goToPrevious}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid - Day/Week View */}
      {(view === 'day' || view === 'week') && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="max-h-[560px] overflow-y-auto">
              <table className="w-full border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: '80px' }} />
                  {days.map((_, idx) => (
                    <col key={idx} />
                  ))}
                </colgroup>
                <thead className="sticky top-0 z-20 bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="p-3 text-sm font-medium text-slate-500 text-left">Time</th>
                    {days.map((day, idx) => (
                      <th key={idx} className="p-3 text-center border-l border-slate-200">
                        <div className="text-sm font-semibold text-slate-900">{formatDay(day)}</div>
                        <div className={`text-lg font-bold mt-1 ${
                          day.toDateString() === new Date().toDateString() 
                            ? 'text-[#2E388C]' 
                            : 'text-slate-700'
                        }`}>
                          {day.getDate()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hour) => (
                    <tr key={hour}>
                      {/* Time Label */}
                      <td 
                        className="border-b border-slate-200 px-2 text-xs font-medium text-slate-500 align-top pt-1"
                        style={{ height: `${HOUR_HEIGHT}px` }}
                      >
                        {formatHour(hour)}
                      </td>
                      
                      {/* Day Cells */}
                      {days.map((day, dayIdx) => {
                        const dayEvents = getEventsForDay(day);
                        // Only show events that start in this hour
                        const hourEvents = dayEvents.filter(event => {
                          const eventStart = new Date(event.start);
                          return eventStart.getHours() === hour;
                        });
                        
                        return (
                          <td
                            key={dayIdx}
                            className="border-l border-b border-slate-200 cursor-pointer hover:bg-[#2E388C]/5 transition-colors relative p-0"
                            style={{ height: `${HOUR_HEIGHT}px` }}
                            onClick={() => onTimeSlotClick?.(day, hour)}
                          >
                            {hourEvents.map((event, eventIdx) => {
                              const style = getEventStyle(event);
                              return (
                                <div
                                  key={event.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick?.(event);
                                  }}
                                  className="absolute left-1 right-1 rounded-md px-2 py-1 text-xs font-medium shadow-sm border cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                                  style={{
                                    top: style.top,
                                    height: style.height,
                                    backgroundColor: event.color + '20',
                                    borderColor: event.color,
                                    color: event.color,
                                    zIndex: 10 + eventIdx
                                  }}
                                >
                                  <div className="font-semibold truncate text-[11px]">{event.resourceName}</div>
                                  <div className="text-[10px] opacity-75 truncate">
                                    {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                                  </div>
                                </div>
                              );
                            })}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid - Month View */}
      {view === 'month' && (
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-slate-700 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the month starts */}
            {Array.from({ length: (getStartOfMonth(currentDate).getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 p-1 bg-slate-50 rounded-lg"></div>
            ))}
            {days.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={idx}
                  className={`h-24 p-1 rounded-lg border cursor-pointer hover:border-[#2E388C] transition-colors overflow-hidden ${
                    isToday ? 'bg-[#2E388C]/5 border-[#2E388C]' : 'bg-white border-slate-200'
                  }`}
                  onClick={() => onTimeSlotClick?.(day, startHour)}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#2E388C]' : 'text-slate-700'}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        className="text-[9px] font-medium px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                        style={{
                          backgroundColor: event.color + '20',
                          color: event.color,
                        }}
                      >
                        {event.resourceName}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-slate-500 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
