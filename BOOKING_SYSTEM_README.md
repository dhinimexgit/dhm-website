# Room and Car Booking System - Documentation

## Overview

The Internal Tooling system provides a centralized platform for Dhinimex employees to book meeting rooms and company vehicles. This system includes approval workflows, real-time availability checking, calendar views, and comprehensive tracking.

## Features

### 1. **Dual Login System**
- **Toggle Selection**: Users can choose between "Admin" and "Internal Tooling" modes at login
- **Role-Based Access**: Different access levels for admin, marketing, and employee roles
- **Secure Authentication**: Cookie-based session management

### 2. **Room Booking Module**

#### Features:
- **Real-time Availability**: Prevents double-booking with instant validation
- **Calendar View**: Week and day views for easy visualization
- **Search & Filters**: Filter by capacity, equipment, and location
- **Recurring Bookings**: Book weekly team meetings (infrastructure ready)
- **Check-in Feature**: 10-minute window before/after start time
- **Auto-Release**: Rooms are automatically released if check-in doesn't occur

#### Room Profiles Include:
- Room name and location
- Seating capacity
- Available equipment (Projector, VC Kit, Whiteboard, etc.)
- Photos (infrastructure ready)
- Real-time availability status

### 3. **Car Booking Module**

#### Features:
- **Approval Workflow**: All car requests require admin/manager approval
- **Trip Logs**: Mandatory mileage and fuel tracking upon return
- **Driver Assignment**: Choose self-drive or request company driver
- **Real-time Status**: Track pending, approved, and in-progress bookings
- **Rejection Tracking**: View rejection reasons

#### Vehicle Profiles Include:
- Model and license plate
- Fuel type (petrol, diesel, electric, hybrid)
- Current location
- Passenger capacity
- Current mileage

### 4. **Unified Dashboard**

Features:
- Quick statistics overview
- Upcoming bookings at a glance
- Quick action buttons
- Color-coded status indicators
- Mobile-responsive design

### 5. **Admin Management Interface**

Admins can:
- **Approve/Reject** car booking requests
- **Add/Edit/Remove** rooms and cars
- **Manage Resource Availability**
- **View All Bookings**
- **Track Resource Utilization**

## User Roles

### Employee (`employee@dhinimex.com`)
- Access Internal Tooling only
- Book rooms and request cars
- View own bookings
- Submit trip logs
- Check in to room bookings

### Marketing (`marketing@dhinimex.com`)
- Access Admin dashboard only
- Approve/reject car bookings
- Manage resources
- View all bookings

### Admin (`admin@dhinimex.com`)
- Access both Admin and Internal Tooling
- Full system access
- Approve/reject bookings
- Manage all resources
- View analytics

## Login Credentials

### Default Users:
1. **Admin Account**
   - Email: `admin@dhinimex.com`
   - Password: `dhmnewadmin@2025`
   - Access: Both Admin and Internal Tooling

2. **Marketing Account**
   - Email: `marketing@dhinimex.com`
   - Password: `marketing123`
   - Access: Admin only

3. **Employee Account**
   - Email: `employee@dhinimex.com`
   - Password: `employee123`
   - Access: Internal Tooling only

## How to Use

### Booking a Room:

1. Login and select "Internal Tooling"
2. Navigate to "Rooms"
3. Use filters to find suitable room
4. Select a room to view its calendar
5. Click on a time slot to book
6. Fill in booking details:
   - Your name and email
   - Purpose of meeting
   - Number of attendees
   - Duration
7. Confirm booking
8. **Important**: Check in within 10 minutes of start time or booking will be released

### Requesting a Car:

1. Navigate to "Cars"
2. Use filters to find suitable vehicle
3. Click "Request This Car"
4. Fill in request form:
   - Your details and department
   - Destination and purpose
   - Start/end dates and times
   - Driver type (self-drive or company driver)
5. Submit request
6. Wait for approval notification
7. **After trip**: Submit trip log with mileage and fuel levels

### Approving Car Bookings (Admin/Marketing only):

1. Login and select "Internal Tooling"
2. Navigate to "Admin" in the menu
3. View "Pending Approvals" tab
4. Review booking details:
   - Requester information
   - Destination and purpose
   - Dates and driver requirements
5. Click "Approve" or "Reject"
6. If rejecting, provide a reason
7. User will be notified automatically

### Managing Resources (Admin only):

1. Navigate to Admin section
2. Select "Manage Rooms" or "Manage Cars"
3. Click "+ Add New" to create resources
4. Click "Edit" on existing resources to update
5. Toggle availability status
6. Update maintenance status

## Technical Implementation

### Database Collections (Firebase Firestore):

1. **rooms** - Room information
2. **room_bookings** - Room reservation records
3. **cars** - Vehicle information
4. **car_bookings** - Car booking requests and records
5. **booking_notifications** - System notifications

### Key Technologies:

- **Next.js 16** - React framework
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage (for photos)
- **TailwindCSS** - Styling
- **TypeScript** - Type safety

### Security Features:

- Cookie-based session management
- Role-based access control
- Server-side authentication checks
- Input validation
- Conflict prevention

## API Endpoints (Server Actions)

### Room Operations:
- `createRoom()` - Create new room
- `getRooms()` - Fetch all rooms
- `getRoom(id)` - Get single room
- `updateRoom(id, data)` - Update room
- `deleteRoom(id)` - Remove room

### Room Booking Operations:
- `createRoomBooking(data)` - Create booking
- `getRoomBookings(filters)` - Fetch bookings
- `checkRoomAvailability(roomId, start, end)` - Check conflicts
- `checkInRoomBooking(id)` - Check in to booking
- `updateRoomBooking(id, data)` - Update booking

### Car Operations:
- `createCar()` - Create new car
- `getCars()` - Fetch all cars
- `getCar(id)` - Get single car
- `updateCar(id, data)` - Update car
- `deleteCar(id)` - Remove car

### Car Booking Operations:
- `createCarBooking(data)` - Create booking request
- `getCarBookings(filters)` - Fetch bookings
- `checkCarAvailability(carId, start, end)` - Check conflicts
- `approveCarBooking(id, approver)` - Approve request
- `rejectCarBooking(id, reason)` - Reject request
- `updateCarBookingTripLog(id, log)` - Submit trip log

### Notification Operations:
- `getNotifications(email)` - Fetch user notifications
- `markNotificationAsRead(id)` - Mark as read

## Mobile Responsiveness

All pages are fully responsive with:
- Responsive grid layouts
- Touch-friendly buttons
- Mobile-optimized navigation
- Collapsible menus
- Swipe-friendly calendar

## Future Enhancements

Potential improvements:
1. Email notifications
2. SMS alerts
3. Recurring room bookings UI
4. Advanced analytics dashboard
5. Resource utilization reports
6. Photo uploads for rooms and cars
7. QR code check-in
8. Integration with calendar apps (Google Calendar, Outlook)
9. Push notifications
10. Automated reminders

## Troubleshooting

### Common Issues:

**Cannot check in to room booking:**
- Check-in is only available 10 minutes before to 10 minutes after start time
- Booking must be in "confirmed" status

**Car booking not appearing:**
- Ensure you're viewing the correct date range
- Check booking status (pending bookings may not show in calendar)

**Cannot access Admin page:**
- Only admin and marketing roles can access admin features
- Ensure you're logged in with correct credentials

**Booking conflicts:**
- System prevents double-booking automatically
- Try different time slots or resources

## Support

For issues or questions:
- Contact system administrator: `admin@dhinimex.com`
- Check this documentation
- Review booking history in "My Bookings"

## Updates and Maintenance

Regular maintenance tasks:
1. Review and archive old bookings
2. Update car mileage periodically
3. Mark rooms under maintenance when needed
4. Review and optimize resource utilization
5. Clean up cancelled bookings

---

**Version**: 1.0.0
**Last Updated**: December 2025
**Developed by**: Dhinimex IT Team

