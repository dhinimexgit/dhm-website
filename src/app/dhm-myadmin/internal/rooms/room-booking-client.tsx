'use client';

import { useState, useMemo } from 'react';
import type { Room, RoomBooking, CalendarEvent } from '@/types/booking';
import { CalendarView } from '@/components/booking/calendar-view';
import { CustomModal, useModal } from '@/components/booking/custom-modal';
import { createRoomBooking } from '@/app/actions/bookings';

type Props = {
  initialRooms: Room[];
  initialBookings: RoomBooking[];
};

// Brand colors
const GROUND_FLOOR_COLOR = '#2E388C'; // Brand Navy
const FIRST_FLOOR_COLOR = '#D4A03C'; // Stanley Yellow

// Phone number formatting helper
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, '');
  
  // Remove leading 0 if present
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  // Limit to 9 digits (Cambodian phone format: 8 or 9 digits)
  digits = digits.substring(0, 9);
  
  // Format as XX XXX-XXXX or X XXX-XXXX
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 5) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  } else {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
};

const getPhoneDigits = (formatted: string): string => {
  return formatted.replace(/\D/g, '');
};

export function RoomBookingClient({ initialRooms, initialBookings }: Props) {
  const [rooms] = useState(initialRooms);
  const [bookings] = useState(initialBookings);
  const [selectedFloor, setSelectedFloor] = useState<'all' | 'ground' | 'first'>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Custom modal hook
  const { modalState, hideModal, showSuccess, showError, showInfo, showWarning } = useModal();

  // Filter rooms by floor
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (selectedFloor === 'all') return true;
      return room.location.toLowerCase().includes(selectedFloor);
    });
  }, [rooms, selectedFloor]);

  // Convert bookings to calendar events with floor-based colors
  const calendarEvents = useMemo((): CalendarEvent[] => {
    const filtered = selectedFloor === 'all' 
      ? bookings 
     : bookings.filter(b => {
          const room = rooms.find(r => r.id === b.roomId);
          return room && room.location.toLowerCase().includes(selectedFloor);
        });

    return filtered
      .filter(b => b.status !== 'cancelled')
      .map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        const isGroundFloor = room?.location.toLowerCase().includes('ground');
        
        return {
          id: booking.id,
          title: `${booking.roomName} - ${booking.userName}`,
          start: new Date(booking.startTime),
          end: new Date(booking.endTime),
          resourceId: booking.roomId,
          resourceName: booking.roomName,
          type: 'room' as const,
          status: booking.status,
          userEmail: booking.userEmail,
          color: isGroundFloor ? GROUND_FLOOR_COLOR: FIRST_FLOOR_COLOR
        };
      });
  }, [bookings, rooms, selectedFloor]);

  const handleTimeSlotClick = (date: Date, hour: number) => {
    if (filteredRooms.length === 0) {
      showWarning('No Rooms Available', 'Please select a floor with available rooms');
      return;
    }
    setSelectedDate(date);
    setSelectedHour(hour);
    setSelectedRoom(filteredRooms[0]);
    setPhoneNumber('');
    setShowBookingModal(true);
  };

  const openBookingModal = () => {
    if (filteredRooms.length === 0) {
      showWarning('No Rooms Available', 'No rooms available. Please add rooms first.');
      return;
    }
    setSelectedDate(new Date());
    setSelectedHour(9);
    setSelectedRoom(filteredRooms[0]);
    setPhoneNumber('');
    setShowBookingModal(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRoom || !selectedDate || selectedHour === null) return;

    // Validate phone number (should be 8 or 9 digits)
    const phoneDigits = getPhoneDigits(phoneNumber);
    if (phoneDigits.length < 8 || phoneDigits.length > 9) {
      showWarning('Invalid Phone Number', 'Please enter a valid phone number (8 or 9 digits)');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const requesterName = formData.get('requesterName') as string;
    const bookingFor = formData.get('bookingFor') as string;
    const purpose = formData.get('purpose') as string;
    const bookingDate = formData.get('bookingDate') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    const startDateTime = new Date(bookingDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    
    const endDateTime = new Date(bookingDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    // Validate end time is after start time
    if (endDateTime <= startDateTime) {
      showWarning('Invalid Time', 'End time must be after start time');
      setIsSubmitting(false);
      return;
    }

    const fullPhoneNumber = `+855 ${phoneNumber}`;

    const result = await createRoomBooking({
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      userId: fullPhoneNumber,
      userEmail: fullPhoneNumber, // Using phone instead of email
      userName: `${requesterName} (for ${bookingFor})`,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose,
      attendees: 1,
      status: 'confirmed',
      isRecurring: false,
    });

    setIsSubmitting(false);

    if (result.success) {
      setShowBookingModal(false);
      showSuccess('Booking Confirmed!', 'Your meeting room has been successfully booked.', () => {
        window.location.reload();
      });
    } else {
      showError('Booking Failed', result.error || 'An error occurred while booking the room.');
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    const booking = bookings.find(b => b.id === event.id);
    if (booking) {
      const startDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      
      showInfo('Booking Details', `Room booked by ${booking.userName}`, [
        { label: 'Room', value: booking.roomName },
        { label: 'Purpose', value: booking.purpose },
        { label: 'Date', value: startDate.toLocaleDateString() },
        { label: 'Time', value: `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` },
        { label: 'Status', value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) },
      ]);
    }
  };

  // Generate time options from 7 AM to 7 PM
  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    const hourStr = hour.toString().padStart(2, '0');
    const label = hour === 0 ? '12 AM': hour < 12 ? `${hour} AM`: hour === 12 ? '12 PM': `${hour - 12} PM`;
    return { value: `${hourStr}:00`, label };
  });

  return (
    <div className="space-y-6">
      {/* Custom Modal */}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        details={modalState.details}
        onAction={modalState.onAction}
      />

      {/* Header with Book Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Floor Filter Buttons */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedFloor === 'all'
                  ? 'bg-[#2E388C] text-white shadow-sm'
                 : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Floors
            </button>
            <button
              onClick={() => setSelectedFloor('ground')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                selectedFloor === 'ground'
                  ? 'bg-[#2E388C] text-white shadow-sm'
                 : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GROUND_FLOOR_COLOR }}></div>
              Ground Floor
            </button>
            <button
              onClick={() => setSelectedFloor('first')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                selectedFloor === 'first'
                  ? 'bg-[#D4A03C] text-white shadow-sm'
                 : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: FIRST_FLOOR_COLOR }}></div>
              First Floor
            </button>
          </div>
        </div>

        <button
          onClick={openBookingModal}
          className="px-6 py-3 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all shadow-md"
        >
          + Book A Meeting Room
        </button>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isGroundFloor = room.location.toLowerCase().includes('ground');
          const floorColor = isGroundFloor ? GROUND_FLOOR_COLOR: FIRST_FLOOR_COLOR;
          return (
            <div
              key={room.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedRoom?.id === room.id
                  ? 'border-[#2E388C] bg-[#2E388C]/5'
                 : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: floorColor }}></div>
                <h4 className="font-semibold text-slate-900">{room.name}</h4>
              </div>
              <p className="text-sm text-slate-500">{room.location}</p>
            </div>
          );
        })}
        {filteredRooms.length === 0 && (
          <p className="col-span-full text-center text-slate-500 py-8">No rooms available for selected floor</p>
        )}
      </div>

      {/* Calendar View - 7AM to 7PM */}
      <CalendarView
        events={calendarEvents}
        onTimeSlotClick={handleTimeSlotClick}
        onEventClick={handleEventClick}
        startHour={7}
        endHour={19}
      />

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Book A Meeting Room</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Requester Name *
                  </label>
                  <input
                    type="text"
                    name="requesterName"
                    required
                    placeholder="Your name"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Booking For *
                  </label>
                  <input
                    type="text"
                    name="bookingFor"
                    required
                    placeholder="Who is this for?"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg">
                    +855
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    placeholder="XX XXX-XXXX"
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Format: XX XXX-XXXX (8-9 digits, e.g., 12 345-678)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Purpose *
                </label>
                <input
                  type="text"
                  name="purpose"
                  required
                  placeholder="e.g., Team Meeting"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Room *
                </label>
                <select
                  value={selectedRoom.id}
                  onChange={(e) => {
                    const room = rooms.find(r => r.id === e.target.value);
                    if (room) setSelectedRoom(room);
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                >
                  {filteredRooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name} - {room.location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="bookingDate"
                  required
                  defaultValue={selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Time *
                  </label>
                  <select
                    name="startTime"
                    required
                    defaultValue={selectedHour !== null ? `${selectedHour.toString().padStart(2, '0')}:00`: '09:00'}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  >
                    {timeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Time *
                  </label>
                  <select
                    name="endTime"
                    required
                    defaultValue={selectedHour !== null ? `${(selectedHour + 1).toString().padStart(2, '0')}:00`: '10:00'}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  >
                    {timeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                <p><strong>Request Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Booking......': 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
