import { getCurrentUser } from "@/app/actions/auth";
import { getRoomBookings, getCarBookings } from "@/app/actions/bookings";
import { MyBookingsClient } from "./my-bookings-client";
import { redirect } from "next/navigation";

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/dhm-myadmin/login");
  }

  const roomBookings = await getRoomBookings({ userId: user.email });
  const carBookings = await getCarBookings({ userId: user.email });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-1">View and manage all your room and car bookings</p>
      </div>

      <MyBookingsClient 
        roomBookings={roomBookings} 
        carBookings={carBookings}
        userEmail={user.email}
      />
    </div>
  );
}

