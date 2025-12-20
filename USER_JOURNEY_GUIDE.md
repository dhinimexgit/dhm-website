# 🗺️ User Journey Guide - Internal Tooling Booking System

## Visual Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN PAGE                                │
│  /dhm-myadmin/login                                         │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │   [Internal Tooling]  [Admin]  ← Toggle          │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  Email: ___________________                                 │
│  Password: _______________                                  │
│                                                              │
│  [Sign in]                                                  │
└─────────────────────────────────────────────────────────────┘
                      │
                      │ (based on mode selection)
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│  INTERNAL TOOLING  │    │   ADMIN DASHBOARD  │
│  /internal         │    │   /dhm-myadmin     │
└────────────────────┘    └────────────────────┘
```

---

## 🎯 Employee Journey

### Path 1: Booking a Meeting Room

```
Login (Internal Tooling)
  │
  ├─→ Dashboard
  │     │
  │     └─→ Quick Stats
  │         • Total Bookings
  │         • Upcoming Meetings
  │
  ├─→ Click "Rooms"
  │     │
  │     ├─→ Search/Filter
  │     │     • By capacity
  │     │     • By equipment
  │     │     • By location
  │     │
  │     ├─→ Select Room
  │     │     │
  │     │     └─→ View Calendar
  │     │           │
  │     │           ├─→ Week View
  │     │           └─→ Day View
  │     │
  │     └─→ Click Time Slot
  │           │
  │           └─→ Booking Form
  │                 • Name
  │                 • Email
  │                 • Purpose
  │                 • Attendees
  │                 • Duration
  │                 │
  │                 └─→ [Confirm Booking]
  │                       │
  │                       └─→ ✅ Success!
  │
  └─→ At Meeting Time
        │
        └─→ My Bookings
              │
              └─→ [Check In] (10-min window)
                    │
                    └─→ ✅ Checked In!
```

### Path 2: Requesting a Company Car

```
Login (Internal Tooling)
  │
  ├─→ Dashboard
  │
  ├─→ Click "Cars"
  │     │
  │     ├─→ Search/Filter
  │     │     • By fuel type
  │     │     • By model
  │     │
  │     ├─→ Select Car
  │     │     │
  │     │     └─→ View Details
  │     │           • License plate
  │     │           • Location
  │     │           • Capacity
  │     │           • Mileage
  │     │
  │     └─→ Click "Request This Car"
  │           │
  │           └─→ Request Form
  │                 • Name & Email
  │                 • Department
  │                 • Destination
  │                 • Purpose
  │                 • Dates & Times
  │                 • Driver Type
  │                 │   ├─→ Self Drive
  │                 │   └─→ Company Driver
  │                 │
  │                 └─→ [Submit Request]
  │                       │
  │                       └─→ ⏳ Pending Approval
  │
  ├─→ Wait for Approval
  │     │
  │     └─→ Notification
  │           ├─→ ✅ Approved
  │           └─→ ❌ Rejected (+ reason)
  │
  └─→ After Trip
        │
        └─→ My Bookings
              │
              └─→ [Submit Trip Log]
                    • Start Mileage
                    • End Mileage
                    • Start Fuel %
                    • End Fuel %
                    │
                    └─→ ✅ Trip Completed!
```

---

## 👔 Admin/Manager Journey

### Path 3: Approving Car Requests

```
Login (Internal Tooling)
  │
  ├─→ Dashboard
  │     │
  │     └─→ See "Pending Approvals" count
  │
  ├─→ Click "Admin" (⚙️ icon)
  │     │
  │     └─→ Pending Approvals Tab
  │           │
  │           ├─→ View Request Details
  │           │     • Requester info
  │           │     • Department
  │           │     • Destination
  │           │     • Purpose
  │           │     • Dates
  │           │     • Driver preference
  │           │
  │           └─→ Make Decision
  │                 ├─→ [Approve]
  │                 │     │
  │                 │     └─→ ✅ Approved!
  │                 │         • User notified
  │                 │         • Booking confirmed
  │                 │
  │                 └─→ [Reject]
  │                       │
  │                       ├─→ Enter Reason
  │                       │
  │                       └─→ ❌ Rejected!
  │                           • User notified
  │                           • Reason provided
```

### Path 4: Managing Resources

```
Login (Internal Tooling)
  │
  ├─→ Click "Admin"
  │     │
  │     ├─→ Manage Rooms Tab
  │     │     │
  │     │     ├─→ View All Rooms
  │     │     │     └─→ [Edit] any room
  │     │     │           • Update details
  │     │     │           • Toggle availability
  │     │     │           • Mark maintenance
  │     │     │
  │     │     └─→ [+ Add New Room]
  │     │           • Name
  │     │           • Location
  │     │           • Capacity
  │     │           • Equipment
  │     │           │
  │     │           └─→ ✅ Room Added!
  │     │
  │     └─→ Manage Cars Tab
  │           │
  │           ├─→ View All Cars
  │           │     └─→ [Edit] any car
  │           │           • Update details
  │           │           • Update mileage
  │           │           • Toggle availability
  │           │
  │           └─→ [+ Add New Car]
  │                 • Model
  │                 • License Plate
  │                 • Fuel Type
  │                 • Location
  │                 • Capacity
  │                 • Mileage
  │                 │
  │                 └─→ ✅ Car Added!
```

---

## 🔑 Admin-Only Journey

### Path 5: Initial Setup (First Time)

```
Login as Admin (Internal Tooling)
  │
  ├─→ Notice "🌱 Seed Data" in navigation
  │
  ├─→ Click "Seed Data"
  │     │
  │     └─→ Review Sample Data
  │           • 5 Sample Rooms
  │           • 5 Sample Cars
  │           │
  │           └─→ [Seed Database]
  │                 │
  │                 ├─→ Creating rooms... (1/5)
  │                 ├─→ Creating rooms... (2/5)
  │                 ├─→ ...
  │                 ├─→ Creating cars... (1/5)
  │                 ├─→ ...
  │                 │
  │                 └─→ ✅ Success!
  │                     • Redirected to Dashboard
  │                     • Ready to use
```

---

## 📊 Dashboard Overview

```
┌────────────────────────────────────────────────────────┐
│  INTERNAL TOOLING DASHBOARD                            │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome back, [User]! 👋                              │
│  Manage your room and car bookings all in one place   │
│                                                         │
├─────────────────┬─────────────────┬────────────────────┤
│ Room Bookings   │ Car Bookings    │ Pending Approvals  │
│      12         │       8         │         3          │
│   🏢 Blue       │   🚗 Green      │   ⏳ Yellow        │
└─────────────────┴─────────────────┴────────────────────┘
│                                                         │
│  Quick Actions                                         │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │  🏢 Book a Room  │  │  🚗 Book a Car   │          │
│  │  Find and reserve│  │  Request a       │          │
│  │  meeting rooms   │  │  company vehicle │          │
│  │  [→]             │  │  [→]             │          │
│  └──────────────────┘  └──────────────────┘          │
│                                                         │
│  Upcoming Bookings                                     │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 📅 Conference Room A                             │ │
│  │    Dec 20, 2025 at 2:00 PM                       │ │
│  │    Status: Confirmed                             │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ 🚗 Toyota Camry                                  │ │
│  │    Dec 21, 2025 - Downtown                       │ │
│  │    Status: Pending                               │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Calendar View

```
┌────────────────────────────────────────────────────────┐
│  Conference Room A - Week View                         │
├────────────────────────────────────────────────────────┤
│  Dec 16-22, 2025     [Today] [Day][Week]  [< >]       │
├────────┬────────┬────────┬────────┬────────┬──────────┤
│ Time   │  Mon   │  Tue   │  Wed   │  Thu   │  Fri     │
│        │   16   │   17   │   18   │   19   │   20     │
├────────┼────────┼────────┼────────┼────────┼──────────┤
│ 7 AM   │        │        │        │        │          │
│ 8 AM   │ ████   │        │        │ ████   │          │
│        │ John   │        │        │ Sarah  │          │
│ 9 AM   │        │        │ ████   │        │          │
│        │        │        │ Team   │        │          │
│ 10 AM  │        │        │        │        │ ████     │
│        │        │        │        │        │ All Hands│
│ 11 AM  │        │        │        │        │          │
│ ...    │        │        │        │        │          │
└────────┴────────┴────────┴────────┴────────┴──────────┘

Legend: 🟢 Available  🔴 Booked  🟡 Pending
```

---

## 💡 Key Interactions

### Interactive Elements:

1. **Toggle Switch** (Login)
   - Smooth animation
   - Purple gradient active state
   - White background inactive

2. **Room/Car Cards**
   - Hover effect (border color change)
   - Click to select
   - Selected state (purple/green ring)
   - Status badges

3. **Calendar**
   - Click time slot → Booking modal
   - Click event → View details
   - Drag support (future)
   - Color-coded events

4. **Buttons**
   - Gradient backgrounds
   - Hover effects
   - Loading states
   - Disabled states

5. **Forms**
   - Real-time validation
   - Clear error messages
   - Submit confirmation
   - Loading indicators

---

## 📱 Mobile Experience

```
┌──────────────┐
│  ☰  Logo  👤 │  ← Hamburger menu
├──────────────┤
│              │
│  Dashboard   │
│              │
│ ┌──────────┐ │
│ │ Stats    │ │  ← Stacked vertically
│ └──────────┘ │
│ ┌──────────┐ │
│ │ Actions  │ │
│ └──────────┘ │
│              │
│ [Bookings]   │  ← Touch-friendly
│              │
└──────────────┘
```

### Mobile Features:
- ✅ Touch-optimized buttons
- ✅ Swipeable calendar
- ✅ Collapsible menus
- ✅ Bottom navigation
- ✅ Full-screen modals
- ✅ Responsive grids

---

## 🎯 Success Indicators

### Visual Feedback:

**After Booking:**
```
┌─────────────────────────────────┐
│  ✅ Room Booked Successfully!   │
│                                  │
│  Conference Room A               │
│  Dec 20, 2025 at 2:00 PM        │
│                                  │
│  [View My Bookings]  [OK]       │
└─────────────────────────────────┘
```

**After Approval:**
```
┌─────────────────────────────────┐
│  ✅ Booking Approved!            │
│                                  │
│  User will be notified          │
│                                  │
│  [OK]                           │
└─────────────────────────────────┘
```

**Error State:**
```
┌─────────────────────────────────┐
│  ❌ Booking Failed               │
│                                  │
│  Room is already booked for     │
│  this time slot                 │
│                                  │
│  [Try Another Time]             │
└─────────────────────────────────┘
```

---

## 🔄 Status Flow

### Room Booking Status:
```
[Create] → pending → confirmed → checked-in → completed
                        │            │
                        └────────────┴─→ cancelled
                        │
                        └─→ no-show (if no check-in)
```

### Car Booking Status:
```
[Create] → pending → approved → in-progress → completed
              │         │
              └─────────┴─→ rejected
              │
              └─→ cancelled
```

---

## 🎓 Learning Path

### For New Users:

1. **Day 1**: Login, browse resources
2. **Day 2**: Make first room booking
3. **Day 3**: Check-in to meeting
4. **Day 4**: Request a car
5. **Week 2**: Comfortable with system

### For Admins:

1. **Setup**: Seed data, review
2. **Day 1**: Approve first booking
3. **Day 2**: Add new resource
4. **Week 1**: Full system mastery

---

## 📞 Quick Help

### Common Questions:

**Q: Where do I start?**
→ Dashboard → Quick Actions

**Q: How do I find a specific room?**
→ Rooms → Use filters/search

**Q: When can I check in?**
→ 10 minutes before start time

**Q: How do I cancel?**
→ My Bookings → Find booking → Cancel

**Q: Where to see approvals?**
→ Admin → Pending Approvals tab

---

**Happy Booking! 🎉**

*This system is designed to make your work life easier. If you have any questions, refer to the documentation or contact your admin.*

