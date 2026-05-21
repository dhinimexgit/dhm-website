'use client';

import { useState, useMemo } from 'react';
import type { Car, CarBooking, CalendarEvent } from '@/types/booking';
import { CalendarView } from '@/components/booking/calendar-view';
import { CustomModal, useModal } from '@/components/booking/custom-modal';
import { createCarBooking } from '@/app/actions/bookings';

type Props = {
  initialCars: Car[];
  initialBookings: CarBooking[];
};

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

// Consistent date formatting to avoid hydration errors
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function CarBookingClient({ initialCars, initialBookings }: Props) {
  const [cars] = useState(initialCars);
  const [bookings] = useState(initialBookings);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Custom modal hook
  const { modalState, hideModal, showSuccess, showError, showInfo, showWarning } = useModal();

  // Convert bookings to calendar events
  const calendarEvents = useMemo((): CalendarEvent[] => {
    return bookings
      .filter(b => ['pending', 'approved', 'in-progress'].includes(b.status))
      .map(booking => ({
        id: booking.id,
        title: `${booking.carModel} - ${booking.userName}`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        resourceId: booking.carId,
        resourceName: booking.carModel !== 'To be assigned' ? booking.carModel: booking.destination,
        type: 'car' as const,
        status: booking.status,
        userEmail: booking.userEmail,
        color: booking.status === 'approved' ? '#10b981': 
               booking.status === 'in-progress' ? '#3b82f6': '#D4A03C' // Yellow for pending
      }));
  }, [bookings]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const openBookingModal = () => {
    setPhoneNumber('');
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    const department = formData.get('department') as string;
    const destination = formData.get('destination') as string;
    const purpose = formData.get('purpose') as string;
    
    const startDate = new Date(formData.get('startDate') as string);
    const startTime = formData.get('startTime') as string;
    const [startHour, startMinute] = startTime.split(':');
    startDate.setHours(parseInt(startHour), parseInt(startMinute));

    const endDate = new Date(formData.get('endDate') as string);
    const endTime = formData.get('endTime') as string;
    const [endHour, endMinute] = endTime.split(':');
    endDate.setHours(parseInt(endHour), parseInt(endMinute));

    const fullPhoneNumber = `+855 ${phoneNumber}`;

    const result = await createCarBooking({
      carId: 'pending',
      carModel: 'To be assigned',
      licensePlate: 'TBA',
      userId: fullPhoneNumber,
      userEmail: fullPhoneNumber, // Using phone instead of email
      userName: `${requesterName} (for ${bookingFor})`,
      department,
      startTime: startDate,
      endTime: endDate,
      destination,
      purpose,
      driverType: 'company-driver',
      status: 'pending',
    });

    setIsSubmitting(false);

    if (result.success) {
      setShowBookingModal(false);
      showSuccess('Request Submitted!', 'Your car booking request has been submitted. The driver manager will assign a driver and car.', () => {
        window.location.reload();
      });
    } else {
      showError('Request Failed', result.error || 'An error occurred while submitting your request.');
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    const booking = bookings.find(b => b.id === event.id);
    if (booking) {
      const startDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      
      const details = [
        { label: 'Requested by', value: booking.userName },
        { label: 'Destination', value: booking.destination },
        { label: 'Purpose', value: booking.purpose },
        { label: 'From', value: startDate.toLocaleString() },
        { label: 'To', value: endDate.toLocaleString() },
        { label: 'Status', value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) },
      ];

      if (booking.carId !== 'pending') {
        details.push({ label: 'Car', value: booking.carModel });
        details.push({ label: 'Plate', value: booking.licensePlate });
        if (booking.driverName) {
          details.push({ label: 'Driver', value: booking.driverName });
        }
      } else {
        details.push({ label: 'Car', value: 'To be assigned by driver manager' });
      }

      showInfo('Booking Details', `Car request for ${booking.destination}`, details);
    }
  };

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
      <div className="flex items-center justify-end">
        <button
          onClick={openBookingModal}
          className="px-6 py-3 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all shadow-md"
        >
          + Request a Car
        </button>
      </div>

      {/* Calendar View - 5AM to 8PM */}
      <CalendarView
        events={calendarEvents}
        onEventClick={handleEventClick}
        onTimeSlotClick={openBookingModal}
        startHour={5}
        endHour={20}
      />

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Car Requests</h2>
        </div>
        <div className="p-6">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div 
                  key={booking.id} 
                  className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-[#2E388C]/30 hover:shadow-sm transition-all"
                  onClick={() => handleEventClick({
                    id: booking.id,
                    title: '',
                    start: new Date(booking.startTime),
                    end: new Date(booking.endTime),
                    resourceId: booking.carId,
                    resourceName: booking.carModel,
                    type: 'car',
                    status: booking.status,
                    userEmail: booking.userEmail,
                    color: booking.status === 'approved' ? '#10b981': 
                           booking.status === 'in-progress' ? '#3b82f6': '#D4A03C',
                  })}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{booking.destination}</h3>
                      <p className="text-sm text-slate-600 mt-1">{booking.userName}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        {formatDate(new Date(booking.startTime))} - {formatDate(new Date(booking.endTime))}
                      </p>
                      {booking.carId !== 'pending' && (
                        <div className="mt-3 p-3 bg-[#2E388C]/5 rounded-lg">
                          <p className="text-sm font-medium text-[#2E388C]">Assigned Car</p>
                          <p className="text-sm text-slate-700">Model: {booking.carModel}</p>
                          <p className="text-sm text-slate-700">Plate: {booking.licensePlate}</p>
                          {booking.driverName && (
                            <p className="text-sm text-slate-700">Driver: {booking.driverName}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-700':
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700':
                      booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700':
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ): (
            <p className="text-center text-slate-500 py-8">No car requests yet</p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Request a Car</h3>
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
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  placeholder="e.g., Technical"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  required
                  placeholder="Where are you going?"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Purpose *
                </label>
                <textarea
                  name="purpose"
                  required
                  rows={2}
                  placeholder="Brief description"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    From Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    From Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    To Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    To Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-[#D4A03C]/10 rounded-lg p-3 border border-[#D4A03C]/30">
                <p className="text-sm text-[#8B6914]">
                  <strong>Note:</strong> Driver manager will assign a driver and car to your request. 
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                <p><strong>Request Date:</strong> {formatDate(new Date())}</p>
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
                  {isSubmitting ? 'Submitting......': 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
