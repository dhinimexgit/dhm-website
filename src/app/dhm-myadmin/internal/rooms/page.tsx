import { getRooms, getRoomBookings } from "@/app/actions/bookings";
import { canAccessFunction } from "@/app/actions/auth";
import { RoomBookingClient } from "./room-booking-client";
import { redirect } from "next/navigation";
import { getTranslation } from "@/lib/i18n-server";

// Ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default async function RoomsPage() {
  const { t } = await getTranslation();
  const allowed = await canAccessFunction("internal.rooms");
  if (!allowed) {
    redirect("/dhm-myadmin/internal");
  }

  const rooms = await getRooms();
  const bookings = await getRoomBookings();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
            Booking
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy">
            {t.admin.internal.rooms}
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            {t.admin.internal.findAndBook}
          </p>
        </div>
      </div>

      <RoomBookingClient initialRooms={rooms} initialBookings={bookings} />
    </div>
  );
}
