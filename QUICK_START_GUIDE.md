# Quick Start Guide - Internal Tooling Booking System

## 🚀 Getting Started in 5 Minutes

### Step 1: Access the Login Page

Navigate to: `http://localhost:3000/dhm-myadmin/login` (or your deployment URL)

### Step 2: Choose Your Mode

You'll see a beautiful toggle switch with two options:
- **Internal Tooling** (Purple) - For booking rooms and cars
- **Admin** (Purple) - For content management

### Step 3: Login

Use one of these credentials:

**For Full Access (Admin):**
```
Email: admin@dhinimex.com
Password: dhmnewadmin@2025
```

**For Employees:**
```
Email: employee@dhinimex.com
Password: employee123
```

### Step 4: First Time Setup (Admin Only)

1. After logging in as admin, click **"🌱 Seed Data"** in the navigation
2. Review the sample data that will be created
3. Click **"Seed Database with Sample Data"**
4. Wait for confirmation
5. You're ready to go!

## 📋 Common Tasks

### To Book a Room:

1. Click **"Rooms"** in navigation
2. Use search/filters if needed
3. Click on a room card to select it
4. View the calendar below
5. Click on an available time slot
6. Fill in the booking form
7. Click **"Confirm Booking"**
8. ✅ Done! Remember to check in within 10 minutes of your meeting start time

### To Request a Car:

1. Click **"Cars"** in navigation
2. Browse or filter available vehicles
3. Click on a car card to select it
4. Click **"Request This Car"**
5. Fill in the detailed request form
6. Click **"Submit Request"**
7. ⏳ Wait for approval from your manager

### To Approve Car Bookings (Admin/Manager):

1. Click **"Admin"** in navigation
2. View **"Pending Approvals"** tab (shows count badge)
3. Review request details
4. Click **"Approve"** or **"Reject"**
5. If rejecting, provide a reason
6. ✅ User is notified automatically

### To Manage Resources (Admin):

1. Click **"Admin"** in navigation
2. Switch to **"Manage Rooms"** or **"Manage Cars"** tab
3. Click **"+ Add New"** to create
4. Click **"Edit"** on cards to update
5. Toggle availability as needed

## 🎨 Understanding the Interface

### Color Coding:

- **Green** 🟢 = Available / Approved / Completed
- **Yellow** 🟡 = Pending Approval / Warning
- **Red** 🔴 = Booked / Rejected / Unavailable
- **Blue** 🔵 = Checked In / In Progress
- **Purple** 🟣 = Room-related features
- **Green** 🟢 = Car-related features

### Status Badges:

**Room Bookings:**
- `pending` - Waiting for time
- `confirmed` - Ready for check-in
- `checked-in` - Currently active
- `completed` - Finished
- `cancelled` - Cancelled by user
- `no-show` - Didn't check in

**Car Bookings:**
- `pending` - Awaiting approval
- `approved` - Ready to use
- `rejected` - Not approved
- `in-progress` - Currently in use
- `completed` - Returned with trip log
- `cancelled` - Cancelled

## 📱 Mobile Usage

The entire system is mobile-responsive! Access it from:
- 📱 Your smartphone
- 💻 Tablet
- 🖥️ Desktop

All features work seamlessly across devices.

## ⚡ Pro Tips

### For All Users:

1. **Check the calendar** before booking to see what's available
2. **Use filters** to quickly find what you need
3. **Submit trip logs immediately** after car trips
4. **Check in on time** to avoid losing your room booking
5. **View "My Bookings"** to track all your reservations

### For Admins:

1. **Seed data first** for testing
2. **Approve car bookings promptly** to avoid delays
3. **Update mileage regularly** after trips are completed
4. **Mark resources under maintenance** when needed
5. **Monitor the dashboard** for usage statistics

## 🆘 Troubleshooting

**Q: I can't check in to my room booking**
- A: Check-in is only available 10 minutes before/after start time

**Q: My car booking is still pending**
- A: Wait for admin approval. They'll be notified automatically

**Q: I see "No resources available"**
- A: Run the seed script from Admin > Seed Data

**Q: Calendar is empty**
- A: No bookings exist yet, or adjust your date/filters

**Q: Can't access Admin features**
- A: Only admin/marketing roles can access admin pages

## 🎯 Next Steps

1. ✅ Seed sample data
2. ✅ Create your first room booking
3. ✅ Request a car
4. ✅ Approve a booking (if admin)
5. ✅ Explore the dashboard

## 📞 Need Help?

- 📖 Read the full documentation: `BOOKING_SYSTEM_README.md`
- 👨‍💼 Contact admin: `admin@dhinimex.com`
- 🐛 Report issues to IT team

---

**Enjoy your new booking system!** 🎉

The system is designed to be intuitive and user-friendly. Most users find they can complete their first booking within 2 minutes of logging in!

