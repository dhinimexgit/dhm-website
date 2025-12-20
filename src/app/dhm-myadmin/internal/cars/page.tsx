import { getCars, getCarBookings } from "@/app/actions/bookings";
import { CarBookingClient } from "./car-booking-client";

// Ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default async function CarsPage() {
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
            Car Booking
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Request company vehicles for your trips.
          </p>
        </div>
      </div>

      <CarBookingClient initialCars={cars} initialBookings={bookings} />
    </div>
  );
}
