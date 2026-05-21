import { getCars, getCarBookings } from "@/app/actions/bookings";
import { canAccessFunction } from "@/app/actions/auth";
import { CarBookingClient } from "./car-booking-client";
import { redirect } from "next/navigation";
import { getTranslation } from "@/lib/i18n-server";

// Ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default async function CarsPage() {
  const { t } = await getTranslation();
  const allowed = await canAccessFunction("internal.cars");
  if (!allowed) {
    redirect("/dhm-myadmin/internal");
  }

  const cars = await getCars();
  const bookings = await getCarBookings();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
            Booking
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy">
            {t.admin.internal.cars}
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            {t.admin.internal.requestVehicles}
          </p>
        </div>
      </div>

      <CarBookingClient initialCars={cars} initialBookings={bookings} />
    </div>
  );
}
