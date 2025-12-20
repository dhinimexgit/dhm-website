// Types for Room and Car Booking System

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[]; // ["Projector", "VC Kit", "Whiteboard", etc.]
  photos: string[]; // URLs to room photos
  isAvailable: boolean;
  isUnderMaintenance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userEmail: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6, Sunday to Saturday
    endDate: Date;
  };
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Car {
  id: string;
  model: string;
  licensePlate: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  currentLocation: string;
  capacity: number;
  isAvailable: boolean;
  isUnderMaintenance: boolean;
  photos: string[];
  currentMileage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarBooking {
  id: string;
  carId: string;
  carModel: string;
  licensePlate: string;
  userId: string;
  userEmail: string;
  userName: string;
  department: string;
  startTime: Date;
  endTime: Date;
  destination: string;
  purpose: string;
  driverType: 'self-drive' | 'company-driver';
  driverName?: string; // If company driver is requested
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  tripLog?: {
    startMileage: number;
    endMileage: number;
    startFuelLevel: number; // Percentage
    endFuelLevel: number; // Percentage
    completedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingNotification {
  id: string;
  userId: string;
  userEmail: string;
  type: 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'approval_request' | 'booking_approved' | 'booking_rejected';
  title: string;
  message: string;
  bookingId: string;
  bookingType: 'room' | 'car';
  isRead: boolean;
  createdAt: Date;
}

export type BookingFilter = {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  userId?: string;
  resourceType?: 'room' | 'car';
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  resourceName: string;
  type: 'room' | 'car';
  status: string;
  userEmail: string;
  color: string;
};

