'use client';

import { useState } from 'react';
import type { RoomBooking, CarBooking } from '@/types/booking';
import { checkInRoomBooking, updateRoomBooking, updateCarBookingTripLog } from '@/app/actions/bookings';

type Props = {
  roomBookings: RoomBooking[];
  carBookings: CarBooking[];
  userEmail: string;
};

export function MyBookingsClient({ roomBookings, carBookings, userEmail }: Props) {
  const [activeTab, setActiveTab] = useState<'rooms' | 'cars'>('rooms');
  const [showTripLogModal, setShowTripLogModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CarBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckIn = async (bookingId: string) => {
    if (!confirm('Are you sure you want to check in?')) return;

    const result = await checkInRoomBooking(bookingId);
    if (result.success) {
      alert('Checked in successfully!');
      window.location.reload();
    } else {
      alert(`Check-in failed: ${result.error}`);
    }
  };

  const handleCancelRoom = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const result = await updateRoomBooking(bookingId, { status: 'cancelled' });
    if (result.success) {
      alert('Booking cancelled successfully!');
      window.location.reload();
    } else {
      alert(`Cancellation failed: ${result.error}`);
    }
  };

  const handleTripLogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const startMileage = parseInt(formData.get('startMileage') as string);
    const endMileage = parseInt(formData.get('endMileage') as string);
    const startFuelLevel = parseInt(formData.get('startFuelLevel') as string);
    const endFuelLevel = parseInt(formData.get('endFuelLevel') as string);

    const result = await updateCarBookingTripLog(selectedBooking.id, {
      startMileage,
      endMileage,
      startFuelLevel,
      endFuelLevel,
    });

    setIsSubmitting(false);

    if (result.success) {
      alert('Trip log submitted successfully!');
      setShowTripLogModal(false);
      window.location.reload();
    } else {
      alert(`Trip log submission failed: ${result.error}`);
    }
  };

  const upcomingRoomBookings = roomBookings.filter(
    b => new Date(b.startTime) > new Date() && !['cancelled', 'no-show', 'completed'].includes(b.status)
  );
  const pastRoomBookings = roomBookings.filter(
    b => new Date(b.endTime) <= new Date() || ['cancelled', 'no-show', 'completed'].includes(b.status)
  );

  const upcomingCarBookings = carBookings.filter(
    b => new Date(b.startTime) > new Date() && !['cancelled', 'rejected', 'completed'].includes(b.status)
  );
  const pastCarBookings = carBookings.filter(
    b => new Date(b.endTime) <= new Date() || ['cancelled', 'rejected', 'completed'].includes(b.status)
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'rooms'
                ? 'bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white shadow-md'
               : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Room Bookings ({roomBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'cars'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
               : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Car Bookings ({carBookings.length})
          </button>
        </div>
      </div>

      {/* Room Bookings */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Room Bookings</h2>
            </div>
            <div className="p-6">
              {upcomingRoomBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingRoomBookings.map((booking) => {
                    const canCheckIn = () => {
                      const now = new Date();
                      const startTime = new Date(booking.startTime);
                      const tenMinsBefore = new Date(startTime.getTime() - 10 * 60 * 1000);
                      const tenMinsAfter = new Date(startTime.getTime() + 10 * 60 * 1000);
                      return now >= tenMinsBefore && now <= tenMinsAfter && booking.status === 'confirmed';
                    };

                    return (
                      <div key={booking.id} className="border border-slate-200 rounded-lg p-4 hover:border-[#2E388C]/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{booking.roomName}</h3>
                            <p className="text-sm text-slate-600 mt-1">{booking.purpose}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                  {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                  {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{booking.attendees} attendees</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700':
                              booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700':
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status}
                            </span>
                            <div className="flex gap-2">
                              {canCheckIn() && (
                                <button
                                  onClick={() => handleCheckIn(booking.id)}
                                  className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                  Check In
                                </button>
                              )}
                              {booking.status !== 'checked-in' && (
                                <button
                                  onClick={() => handleCancelRoom(booking.id)}
                                  className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ): (
                <p className="text-center text-slate-500 py-8">No upcoming room bookings</p>
              )}
            </div>
          </div>

          {/* Past */}
          {pastRoomBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Past Room Bookings</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pastRoomBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="border border-slate-200 rounded-lg p-4 opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{booking.roomName}</h3>
                          <p className="text-sm text-slate-600 mt-1">{booking.purpose}</p>
                          <p className="text-sm text-slate-500 mt-2">
                            {new Date(booking.startTime).toLocaleDateString()} at{' '}
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-700':
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700':
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Car Bookings */}
      {activeTab === 'cars' && (
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Car Bookings</h2>
            </div>
            <div className="p-6">
              {upcomingCarBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingCarBookings.map((booking) => (
                    <div key={booking.id} className="border border-slate-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{booking.carModel}</h3>
                          <p className="text-sm text-slate-600 mt-1">{booking.destination}</p>
                          <p className="text-sm text-slate-500 mt-1">{booking.purpose}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>
                                {new Date(booking.startTime).toLocaleDateString()} - {new Date(booking.endTime).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              {booking.driverType === 'self-drive' ? 'Self Drive': `Driver: ${booking.driverName}`}
                            </div>
                          </div>
                          {booking.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {booking.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-700':
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700':
                            booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700':
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                          {booking.status === 'approved' && new Date(booking.endTime) <= new Date() && !booking.tripLog && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowTripLogModal(true);
                              }}
                              className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              Submit Trip Log
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ): (
                <p className="text-center text-slate-500 py-8">No upcoming car bookings</p>
              )}
            </div>
          </div>

          {/* Past */}
          {pastCarBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Past Car Bookings</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {pastCarBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="border border-slate-200 rounded-lg p-4 opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{booking.carModel}</h3>
                          <p className="text-sm text-slate-600 mt-1">{booking.destination}</p>
                          <p className="text-sm text-slate-500 mt-2">
                            {new Date(booking.startTime).toLocaleDateString()} - {new Date(booking.endTime).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-700':
                          booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-100 text-red-700':
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trip Log Modal */}
      {showTripLogModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Submit Trip Log</h3>
                <button
                  onClick={() => setShowTripLogModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleTripLogSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  Please provide the starting and ending mileage and fuel levels for your trip with {selectedBooking.carModel}.   {selectedBooking.carModel}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Mileage (km)
                  </label>
                  <input
                    type="number"
                    name="startMileage"
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Mileage (km)
                  </label>
                  <input
                    type="number"
                    name="endMileage"
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Fuel Level (%)
                  </label>
                  <input
                    type="number"
                    name="startFuelLevel"
                    required
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Fuel Level (%)
                  </label>
                  <input
                    type="number"
                    name="endFuelLevel"
                    required
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTripLogModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting......': 'Submit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

