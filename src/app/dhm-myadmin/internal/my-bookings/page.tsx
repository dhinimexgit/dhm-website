import { getCurrentUser } from "@/app/actions/auth";
import { getRoomBookings, getCarBookings } from "@/app/actions/bookings";
import { MyBookingsClient } from "./my-bookings-client";
import { redirect } from "next/navigation";
import { getTranslation } from "@/lib/i18n-server";

export default async function MyBookingsPage() {
  const { t } = await getTranslation();
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/dhm-myadmin/login");
  }

  const roomBookings = await getRoomBookings({ userId: user.username });
  const carBookings = await getCarBookings({ userId: user.username });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t.admin.internal.myBookings}</h1>
        <p className="text-slate-500 mt-1">{t.admin.internal.viewAndManage}</p>
      </div>

      <MyBookingsClient 
        roomBookings={roomBookings} 
        carBookings={carBookings}
        userEmail={user.email ?? user.username}
      />
    </div>
  );
}

