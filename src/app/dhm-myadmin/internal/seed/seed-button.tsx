'use client';

import { useState } from 'react';
import { createRoom, createCar } from '@/app/actions/bookings';

const sampleRooms = [
  {
    name: 'Ground Floor Meeting Room A',
    location: 'Ground Floor, Main Building',
    capacity: 12,
    equipment: [],
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    name: 'Ground Floor Meeting Room B',
    location: 'Ground Floor, Main Building',
    capacity: 8,
    equipment: [],
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    name: 'First Floor Meeting Room A',
    location: 'First Floor, Main Building',
    capacity: 20,
    equipment: [],
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    name: 'First Floor Meeting Room B',
    location: 'First Floor, Main Building',
    capacity: 10,
    equipment: [],
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
];

const sampleCars = [
  {
    model: 'Toyota Camry 2023',
    licensePlate: 'DHM-001',
    fuelType: 'petrol' as const,
    currentLocation: 'Main Parking Lot',
    capacity: 5,
    currentMileage: 15000,
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    model: 'Honda Accord 2022',
    licensePlate: 'DHM-002',
    fuelType: 'hybrid' as const,
    currentLocation: 'Main Parking Lot',
    capacity: 5,
    currentMileage: 22000,
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    model: 'Toyota Hiace Van',
    licensePlate: 'DHM-003',
    fuelType: 'diesel' as const,
    currentLocation: 'North Parking',
    capacity: 12,
    currentMileage: 45000,
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    model: 'Lexus ES 2024',
    licensePlate: 'DHM-004',
    fuelType: 'petrol' as const,
    currentLocation: 'Executive Parking',
    capacity: 5,
    currentMileage: 8000,
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
  {
    model: 'Tesla Model 3',
    licensePlate: 'DHM-005',
    fuelType: 'electric' as const,
    currentLocation: 'Main Parking Lot',
    capacity: 5,
    currentMileage: 12000,
    photos: [],
    isAvailable: true,
    isUnderMaintenance: false,
  },
];

export function SeedBookingDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed the database with sample data?')) {
      return;
    }

    setIsSeeding(true);
    setStatus('Starting seed process...');

    try {
      // Seed rooms
      setStatus('Creating rooms...');
      let roomCount = 0;
      for (const room of sampleRooms) {
        const result = await createRoom(room);
        if (result.success) {
          roomCount++;
          setStatus(`Created ${roomCount}/${sampleRooms.length} rooms...`);
        }
      }

      // Seed cars
      setStatus('Creating cars...');
      let carCount = 0;
      for (const car of sampleCars) {
        const result = await createCar(car);
        if (result.success) {
          carCount++;
          setStatus(`Created ${carCount}/${sampleCars.length} cars...`);
        }
      }

      setStatus(`✅ Success! Created ${roomCount} rooms and ${carCount} cars.`);
      
      setTimeout(() => {
        alert('Database seeded successfully! You can now start using the booking system.');
        window.location.href = '/dhm-myadmin/internal';
      }, 2000);

    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Seed error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSeed}
        disabled={isSeeding}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] text-white font-semibold rounded-lg hover:from-[#3d4ba3] hover:to-[#4a5ab5] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSeeding ? 'Seeding Database...' : '🌱 Seed Database with Sample Data'}
      </button>

      {status && (
        <div className={`p-4 rounded-lg ${
          status.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
          status.includes('❌') ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <p className="text-sm font-medium">{status}</p>
        </div>
      )}
    </div>
  );
}

