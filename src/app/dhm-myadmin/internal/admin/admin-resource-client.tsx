'use client';

import { useState } from 'react';
import type { Room, Car, CarBooking } from '@/types/booking';
import { createRoom, updateRoom, createCar, updateCar, approveCarBooking, rejectCarBooking } from '@/app/actions/bookings';
import { useLanguage } from '@/lib/i18n';

// Consistent date formatting to avoid hydration errors
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

type Props = {
  initialRooms: Room[];
  initialCars: Car[];
  pendingCarBookings: CarBooking[];
  userEmail: string;
};

export function AdminResourceClient({ initialRooms, initialCars, pendingCarBookings, userEmail }: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rooms' | 'cars' | 'approvals'>('approvals');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CarBooking | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const roomData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      capacity: parseInt(formData.get('capacity') as string),
      equipment: [],
      photos: [],
      isAvailable: formData.get('isAvailable') === 'true',
      isUnderMaintenance: false,
    };

    const result = editingRoom 
      ? await updateRoom(editingRoom.id, roomData)
     : await createRoom(roomData);

    setIsSubmitting(false);

    if (result.success) {
      alert(editingRoom ? 'Room updated successfully!': 'Room created successfully!');
      setShowRoomModal(false);
      setEditingRoom(null);
      window.location.reload();
    } else {
      alert(`Operation failed: ${result.error}`);
    }
  };

  const handleCarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const carData = {
      model: formData.get('model') as string,
      licensePlate: formData.get('licensePlate') as string,
      fuelType: formData.get('fuelType') as 'petrol' | 'diesel' | 'electric' | 'hybrid',
      currentLocation: 'Company Parking',
      capacity: 5,
      currentMileage: 0,
      photos: [],
      isAvailable: formData.get('isAvailable') === 'true',
      isUnderMaintenance: false,
    };

    const result = editingCar 
      ? await updateCar(editingCar.id, carData)
     : await createCar(carData);

    setIsSubmitting(false);

    if (result.success) {
      alert(editingCar ? 'Car updated successfully!': 'Car created successfully!');
      setShowCarModal(false);
      setEditingCar(null);
      window.location.reload();
    } else {
      alert(`Operation failed: ${result.error}`);
    }
  };

  const handleApprove = (booking: CarBooking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const carId = formData.get('carId') as string;
    const driverName = formData.get('driverName') as string;
    
    const selectedCar = initialCars.find(c => c.id === carId);
    
    if (!selectedCar) {
      alert('Please select a car');
      setIsSubmitting(false);
      return;
    }

    // Update the booking with car and driver info
    const { updateCarBooking } = await import('@/app/actions/bookings');
    const updateResult = await updateCarBooking(selectedBooking.id, {
      carId: selectedCar.id,
      carModel: selectedCar.model,
      licensePlate: selectedCar.licensePlate,
      driverName,
    });

    if (!updateResult.success) {
      alert(`Failed to assign car: ${updateResult.error}`);
      setIsSubmitting(false);
      return;
    }

    // Now approve it
    const result = await approveCarBooking(selectedBooking.id, userEmail);
    
    setIsSubmitting(false);

    if (result.success) {
      alert('Car and driver assigned! Booking approved.');
      setShowAssignModal(false);
      setSelectedBooking(null);
      window.location.reload();
    } else {
      alert(`Approval failed: ${result.error}`);
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    const result = await rejectCarBooking(bookingId, reason);
    if (result.success) {
      alert('Booking rejected successfully!');
      window.location.reload();
    } else {
      alert(`Rejection failed: ${result.error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-2">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'approvals'
                ? 'bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white shadow-md'
               : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending Approvals ({pendingCarBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'rooms'
                ? 'bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white shadow-md'
               : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Manage Rooms ({initialRooms.length})
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'cars'
                ? 'bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white shadow-md'
               : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Manage Cars ({initialCars.length})
          </button>
        </div>
      </div>

      {/* Pending Approvals */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Pending Car Booking Approvals</h2>
          </div>
          <div className="p-6">
            {pendingCarBookings.length > 0 ? (
              <div className="space-y-4">
                {pendingCarBookings.map((booking) => (
                  <div key={booking.id} className="border border-[#2E388C]/20 rounded-lg p-4 bg-[#2E388C]/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{booking.carModel} - {booking.licensePlate}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          <strong>Requested by:</strong> {booking.userName} ({booking.userEmail})
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Department:</strong> {booking.department}
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                          <strong>Destination:</strong> {booking.destination}
                        </p>
                        <p className="text-sm text-slate-600">
                          <strong>Purpose:</strong> {booking.purpose}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {formatDate(new Date(booking.startTime))} - {formatDate(new Date(booking.endTime))}
                            </span>
                          </div>
                          <div>
                            {booking.driverType === 'self-drive' ? '🚗 Self Drive': `👤 Driver: ${booking.driverName || 'Any'}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(booking)}
                          className="px-4 py-2 bg-[#2E388C] text-white font-medium rounded-lg hover:bg-[#3d4ba3] transition-colors"
                        >
                          Assign & Approve 
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="px-4 py-2 bg-slate-500 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ): (
              <p className="text-center text-slate-500 py-8">No pending approvals</p>
            )}
          </div>
        </div>
      )}

      {/* Room Management */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingRoom(null);
                setShowRoomModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all shadow-md"
            >
              + Add New Room
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{room.name}</h3>
                    <p className="text-sm text-slate-500">{room.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    room.isAvailable ? 'bg-[#2E388C]/10 text-[#2E388C]': 'bg-slate-100 text-slate-600'
                  }`}>
                    {room.isAvailable ? t.admin.common.available : t.admin.common.unavailable}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">Capacity: {room.capacity} people</p>
                <button
                  onClick={() => {
                    setEditingRoom(room);
                    setShowRoomModal(true);
                  }}
                  className="w-full py-2 text-sm font-medium text-[#2E388C] border border-[#2E388C]/30 rounded-lg hover:bg-[#2E388C]/5 transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Car Management */}
      {activeTab === 'cars' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingCar(null);
                setShowCarModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all shadow-md"
            >
              + Add New Car
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{car.model}</h3>
                    <p className="text-sm text-slate-500">{car.licensePlate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    car.isAvailable ? 'bg-[#2E388C]/10 text-[#2E388C]': 'bg-slate-100 text-slate-600'
                  }`}>
                    {car.isAvailable ? t.admin.common.available : t.admin.common.unavailable}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-600 mb-3">
                  <p className="capitalize">⚡ {car.fuelType}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCar(car);
                    setShowCarModal(true);
                  }}
                  className="w-full py-2 text-sm font-medium text-[#2E388C] border border-[#2E388C]/30 rounded-lg hover:bg-[#2E388C]/5 transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingRoom ? 'Edit Room': 'Add New Room'}
                </h3>
                <button
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleRoomSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingRoom?.name}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  defaultValue={editingRoom?.location}
                  placeholder="e.g., 3rd Floor, Building A"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  required
                  min="1"
                  defaultValue={editingRoom?.capacity}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="isAvailable"
                  defaultValue={editingRoom?.isAvailable ? 'true': 'false'}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...': editingRoom ? 'Update': 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Car Modal */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full my-8">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingCar ? 'Edit Car': 'Add New Car'}
                </h3>
                <button
                  onClick={() => {
                    setShowCarModal(false);
                    setEditingCar(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCarSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  defaultValue={editingCar?.model}
                  placeholder="e.g., Toyota Camry 2023"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  License Plate *
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  required
                  defaultValue={editingCar?.licensePlate}
                  placeholder="e.g., ABC-1234"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  name="fuelType"
                  defaultValue={editingCar?.fuelType}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                >
                  <option value="petrol">{t.admin.common.petrol}</option>
                  <option value="diesel">{t.admin.common.diesel}</option>
                  <option value="electric">{t.admin.common.electric}</option>
                  <option value="hybrid">{t.admin.common.hybrid}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="isAvailable"
                  defaultValue={editingCar?.isAvailable ? 'true': 'false'}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCarModal(false);
                    setEditingCar(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...': editingCar ? 'Update': 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Car & Driver Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Assign Car & Driver </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-900">Booking Details:</p>
                <p className="text-sm text-slate-600 mt-1">Requested by: {selectedBooking.userName}</p>
                <p className="text-sm text-slate-600">Destination: {selectedBooking.destination}</p>
                <p className="text-sm text-slate-600">
                  {formatDate(new Date(selectedBooking.startTime))} - {formatDate(new Date(selectedBooking.endTime))}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Car *
                </label>
                <select
                  name="carId"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                >
                  <option value="">Choose a car...</option>
                  {initialCars.filter(c => c.isAvailable).map(car => (
                    <option key={car.id} value={car.id}>
                      {car.model} - {car.licensePlate} ({car.fuelType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign Driver *
                </label>
                <input
                  type="text"
                  name="driverName"
                  required
                  placeholder="Driver's name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E388C] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...': 'Assign & Approve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

