'use server';

import { requireFirebaseDb } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where,
  orderBy,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import type { 
  Room, 
  RoomBooking, 
  Car, 
  CarBooking, 
  BookingNotification 
} from '@/types/booking';
import { canAccessFunction, getCurrentUser } from './auth';

// Helper function to convert Firestore timestamps
function convertTimestamp(data: any): any {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    } else if (converted[key] && typeof converted[key] === 'object') {
      converted[key] = convertTimestamp(converted[key]);
    }
  });
  return converted;
}

// ============ ROOM OPERATIONS ============

export async function createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await addDoc(collection(requireFirebaseDb(), 'rooms'), {
      ...roomData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating room:', error);
    return { success: false, error: error.message };
  }
}

export async function getRooms(): Promise<Room[]> {
  try {
    const querySnapshot = await getDocs(collection(requireFirebaseDb(), 'rooms'));
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamp(doc.data());
      return {
        id: doc.id,
        ...data,
      } as Room;
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

export async function getRoom(roomId: string): Promise<Room | null> {
  try {
    const docSnap = await getDoc(doc(requireFirebaseDb(), 'rooms', roomId));
    if (docSnap.exists()) {
      const data = convertTimestamp(docSnap.data());
      return { id: docSnap.id, ...data } as Room;
    }
    return null;
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function updateRoom(roomId: string, updates: Partial<Room>): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await updateDoc(doc(requireFirebaseDb(), 'rooms', roomId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating room:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteRoom(roomId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await deleteDoc(doc(requireFirebaseDb(), 'rooms', roomId));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting room:', error);
    return { success: false, error: error.message };
  }
}

// ============ ROOM BOOKING OPERATIONS ============

export async function createRoomBooking(bookingData: Omit<RoomBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check for conflicts
    const conflicts = await checkRoomAvailability(
      bookingData.roomId, 
      bookingData.startTime, 
      bookingData.endTime
    );

    if (conflicts.length > 0) {
      return { success: false, error: 'Room is already booked for this time slot' };
    }

    const docRef = await addDoc(collection(requireFirebaseDb(), 'room_bookings'), {
      ...bookingData,
      startTime: Timestamp.fromDate(new Date(bookingData.startTime)),
      endTime: Timestamp.fromDate(new Date(bookingData.endTime)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Create notification
    await createNotification({
      userId: bookingData.userId,
      userEmail: bookingData.userEmail,
      type: 'booking_confirmed',
      title: 'Room Booking Confirmed',
      message: `Your booking for ${bookingData.roomName} has been confirmed`,
      bookingId: docRef.id,
      bookingType: 'room',
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating room booking:', error);
    return { success: false, error: error.message };
  }
}

export async function checkRoomAvailability(roomId: string, startTime: Date, endTime: Date, excludeBookingId?: string): Promise<RoomBooking[]> {
  try {
    const q = query(
      collection(requireFirebaseDb(), 'room_bookings'),
      where('roomId', '==', roomId),
      where('status', 'in', ['pending', 'confirmed', 'checked-in'])
    );

    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs
      .map(doc => {
        const data = convertTimestamp(doc.data());
        return { id: doc.id, ...data } as RoomBooking;
      })
      .filter(booking => {
        if (excludeBookingId && booking.id === excludeBookingId) {
          return false;
        }
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);
        
        // Check for overlap
        return (newStart < bookingEnd && newEnd > bookingStart);
      });

    return bookings;
  } catch (error) {
    console.error('Error checking room availability:', error);
    return [];
  }
}

export async function getRoomBookings(filters?: { roomId?: string; userId?: string; startDate?: Date; endDate?: Date }): Promise<RoomBooking[]> {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters?.roomId) {
      constraints.push(where('roomId', '==', filters.roomId));
    }
    
    if (filters?.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }

    constraints.push(orderBy('startTime', 'desc'));

    const q = query(collection(requireFirebaseDb(), 'room_bookings'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    let bookings = querySnapshot.docs.map(doc => {
      const data = convertTimestamp(doc.data());
      return { id: doc.id, ...data } as RoomBooking;
    });

    // Apply date filters in memory (since Firestore has limitations on range queries)
    if (filters?.startDate) {
      bookings = bookings.filter(b => new Date(b.startTime) >= new Date(filters.startDate!));
    }
    if (filters?.endDate) {
      bookings = bookings.filter(b => new Date(b.endTime) <= new Date(filters.endDate!));
    }

    return bookings;
  } catch (error) {
    console.error('Error fetching room bookings:', error);
    return [];
  }
}

export async function updateRoomBooking(bookingId: string, updates: Partial<RoomBooking>): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { ...updates };
    
    if (updates.startTime) {
      updateData.startTime = Timestamp.fromDate(new Date(updates.startTime));
    }
    if (updates.endTime) {
      updateData.endTime = Timestamp.fromDate(new Date(updates.endTime));
    }
    if (updates.checkedInAt) {
      updateData.checkedInAt = Timestamp.fromDate(new Date(updates.checkedInAt));
    }

    await updateDoc(doc(requireFirebaseDb(), 'room_bookings', bookingId), {
      ...updateData,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating room booking:', error);
    return { success: false, error: error.message };
  }
}

export async function checkInRoomBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await getDoc(doc(requireFirebaseDb(), 'room_bookings', bookingId));
    if (!booking.exists()) {
      return { success: false, error: 'Booking not found' };
    }

    const bookingData = convertTimestamp(booking.data()) as RoomBooking;
    const now = new Date();
    const startTime = new Date(bookingData.startTime);
    const tenMinutesBeforeStart = new Date(startTime.getTime() - 10 * 60 * 1000);
    const tenMinutesAfterStart = new Date(startTime.getTime() + 10 * 60 * 1000);

    if (now < tenMinutesBeforeStart || now > tenMinutesAfterStart) {
      return { success: false, error: 'Check-in is only available 10 minutes before to 10 minutes after start time' };
    }

    await updateDoc(doc(requireFirebaseDb(), 'room_bookings', bookingId), {
      status: 'checked-in',
      checkedInAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error checking in room booking:', error);
    return { success: false, error: error.message };
  }
}

// ============ CAR OPERATIONS ============

export async function createCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const docRef = await addDoc(collection(requireFirebaseDb(), 'cars'), {
      ...carData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating car:', error);
    return { success: false, error: error.message };
  }
}

export async function getCars(): Promise<Car[]> {
  try {
    const querySnapshot = await getDocs(collection(requireFirebaseDb(), 'cars'));
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamp(doc.data());
      return { id: doc.id, ...data } as Car;
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export async function getCar(carId: string): Promise<Car | null> {
  try {
    const docSnap = await getDoc(doc(requireFirebaseDb(), 'cars', carId));
    if (docSnap.exists()) {
      const data = convertTimestamp(docSnap.data());
      return { id: docSnap.id, ...data } as Car;
    }
    return null;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

export async function updateCar(carId: string, updates: Partial<Car>): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await updateDoc(doc(requireFirebaseDb(), 'cars', carId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating car:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCar(carId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await deleteDoc(doc(requireFirebaseDb(), 'cars', carId));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting car:', error);
    return { success: false, error: error.message };
  }
}

// ============ CAR BOOKING OPERATIONS ============

export async function createCarBooking(bookingData: Omit<CarBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check for conflicts
    const conflicts = await checkCarAvailability(
      bookingData.carId, 
      bookingData.startTime, 
      bookingData.endTime
    );

    if (conflicts.length > 0) {
      return { success: false, error: 'Car is already booked for this time slot' };
    }

    const docRef = await addDoc(collection(requireFirebaseDb(), 'car_bookings'), {
      ...bookingData,
      startTime: Timestamp.fromDate(new Date(bookingData.startTime)),
      endTime: Timestamp.fromDate(new Date(bookingData.endTime)),
      status: 'pending', // Car bookings start as pending
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Notify approvers
    await createNotification({
      userId: 'admin',
      userEmail: 'admin@dhinimex.com',
      type: 'approval_request',
      title: 'Car Booking Approval Required',
      message: `${bookingData.userName} has requested a car booking`,
      bookingId: docRef.id,
      bookingType: 'car',
    });

    // Revalidate pages to show new booking
    revalidatePath('/dhm-myadmin/internal/cars');
    revalidatePath('/dhm-myadmin/internal/admin');

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating car booking:', error);
    return { success: false, error: error.message };
  }
}

export async function checkCarAvailability(carId: string, startTime: Date, endTime: Date, excludeBookingId?: string): Promise<CarBooking[]> {
  try {
    const q = query(
      collection(requireFirebaseDb(), 'car_bookings'),
      where('carId', '==', carId),
      where('status', 'in', ['pending', 'approved', 'in-progress'])
    );

    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs
      .map(doc => {
        const data = convertTimestamp(doc.data());
        return { id: doc.id, ...data } as CarBooking;
      })
      .filter(booking => {
        if (excludeBookingId && booking.id === excludeBookingId) {
          return false;
        }
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);
        
        return (newStart < bookingEnd && newEnd > bookingStart);
      });

    return bookings;
  } catch (error) {
    console.error('Error checking car availability:', error);
    return [];
  }
}

export async function getCarBookings(filters?: { carId?: string; userId?: string; status?: string }): Promise<CarBooking[]> {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters?.carId) {
      constraints.push(where('carId', '==', filters.carId));
    }
    
    if (filters?.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }
    
    // Note: Only add orderBy if no other filters to avoid needing composite indexes
    if (!filters?.carId && !filters?.userId && !filters?.status) {
      constraints.push(orderBy('startTime', 'desc'));
    }

    const q = query(collection(requireFirebaseDb(), 'car_bookings'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    let bookings = querySnapshot.docs.map(doc => {
      const data = convertTimestamp(doc.data());
      return { id: doc.id, ...data } as CarBooking;
    });

    // Filter by status in JavaScript if needed (avoids composite index requirement)
    if (filters?.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }

    // Sort by startTime descending
    bookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return bookings;
  } catch (error) {
    console.error('Error fetching car bookings:', error);
    return [];
  }
}

export async function updateCarBooking(bookingId: string, updates: Partial<CarBooking>): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { ...updates };
    
    if (updates.startTime) {
      updateData.startTime = Timestamp.fromDate(new Date(updates.startTime));
    }
    if (updates.endTime) {
      updateData.endTime = Timestamp.fromDate(new Date(updates.endTime));
    }

    await updateDoc(doc(requireFirebaseDb(), 'car_bookings', bookingId), {
      ...updateData,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating car booking:', error);
    return { success: false, error: error.message };
  }
}

export async function approveCarBooking(bookingId: string, approverEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    const canApprove = await canAccessFunction('internal.resource_management');
    if (!canApprove) {
      return { success: false, error: 'Unauthorized' };
    }

    const bookingRef = doc(requireFirebaseDb(), 'car_bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return { success: false, error: 'Booking not found' };
    }

    const bookingData = convertTimestamp(bookingSnap.data()) as CarBooking;

    await updateDoc(bookingRef, {
      status: 'approved',
      approvedBy: approverEmail,
      approvedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Notify user
    await createNotification({
      userId: bookingData.userId,
      userEmail: bookingData.userEmail,
      type: 'booking_approved',
      title: 'Car Booking Approved',
      message: `Your car booking for ${bookingData.carModel} has been approved`,
      bookingId: bookingId,
      bookingType: 'car',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error approving car booking:', error);
    return { success: false, error: error.message };
  }
}

export async function rejectCarBooking(bookingId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }
    const canReject = await canAccessFunction('internal.resource_management');
    if (!canReject) {
      return { success: false, error: 'Unauthorized' };
    }

    const bookingRef = doc(requireFirebaseDb(), 'car_bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return { success: false, error: 'Booking not found' };
    }

    const bookingData = convertTimestamp(bookingSnap.data()) as CarBooking;

    await updateDoc(bookingRef, {
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: Timestamp.now(),
    });

    // Notify user
    await createNotification({
      userId: bookingData.userId,
      userEmail: bookingData.userEmail,
      type: 'booking_rejected',
      title: 'Car Booking Rejected',
      message: `Your car booking has been rejected. Reason: ${reason}`,
      bookingId: bookingId,
      bookingType: 'car',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting car booking:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCarBookingTripLog(
  bookingId: string, 
  tripLog: { startMileage: number; endMileage: number; startFuelLevel: number; endFuelLevel: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(requireFirebaseDb(), 'car_bookings', bookingId), {
      status: 'completed',
      tripLog: {
        ...tripLog,
        completedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating trip log:', error);
    return { success: false, error: error.message };
  }
}

// ============ NOTIFICATION OPERATIONS ============

async function createNotification(notificationData: Omit<BookingNotification, 'id' | 'isRead' | 'createdAt'>): Promise<void> {
  try {
    await addDoc(collection(requireFirebaseDb(), 'booking_notifications'), {
      ...notificationData,
      isRead: false,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function getNotifications(userEmail: string): Promise<BookingNotification[]> {
  try {
    const q = query(
      collection(requireFirebaseDb(), 'booking_notifications'),
      where('userEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamp(doc.data());
      return { id: doc.id, ...data } as BookingNotification;
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(requireFirebaseDb(), 'booking_notifications', notificationId), {
      isRead: true,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }
}
