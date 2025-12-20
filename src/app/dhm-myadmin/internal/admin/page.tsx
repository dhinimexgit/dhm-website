import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { getRooms, getCars, getCarBookings } from "@/app/actions/bookings";
import { AdminResourceClient } from "./admin-resource-client";

// Ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default async function AdminResourcePage() {
  const user = await getCurrentUser();
  
  if (!user || user.role === 'employee') {
    redirect("/dhm-myadmin/internal");
  }

  const rooms = await getRooms();
  const cars = await getCars();
  const pendingCarBookings = await getCarBookings({ status: 'pending' });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
            Admin
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy">
            Resource Management
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Manage rooms, cars, and approve booking requests.
          </p>
        </div>
      </div>

      <AdminResourceClient 
        initialRooms={rooms}
        initialCars={cars}
        pendingCarBookings={pendingCarBookings}
        userEmail={user.email}
      />
    </div>
  );
}
