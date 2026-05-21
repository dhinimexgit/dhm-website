import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { SeedBookingDataButton } from "./seed-button";
import { getTranslation } from "@/lib/i18n-server";

export default async function SeedBookingDataPage() {
  const { t } = await getTranslation();
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    redirect("/dhm-myadmin/internal");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t.admin.seed.seedBookingData}</h1>
        <p className="text-slate-500 mt-1">
          {t.admin.seed.populateDatabase}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-900">{t.admin.seed.warning}</h3>
            <p className="text-sm text-yellow-800 mt-1">
              {t.admin.seed.warningDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">{t.admin.seed.sampleData}</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t.admin.seed.roomsSample}</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Ground Floor Meeting Room A - 12 people</li>
              <li>• Ground Floor Meeting Room B - 8 people</li>
              <li>• First Floor Meeting Room A - 20 people</li>
              <li>• First Floor Meeting Room B - 10 people</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t.admin.seed.carsSample}</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Toyota Camry 2023 - License: DHM-001 (Petrol, 5 passengers)</li>
              <li>• Honda Accord 2022 - License: DHM-002 (Hybrid, 5 passengers)</li>
              <li>• Toyota Hiace Van - License: DHM-003 (Diesel, 12 passengers)</li>
              <li>• Lexus ES 2024 - License: DHM-004 (Petrol, 5 passengers)</li>
              <li>• Tesla Model 3 - License: DHM-005 (Electric, 5 passengers)</li>
            </ul>
          </div>

          <div className="pt-4">
            <SeedBookingDataButton />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">{t.admin.seed.afterSeeding}</h3>
        <p className="text-sm text-blue-800">
          {t.admin.seed.onceSeeded}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>{t.admin.seed.viewBookRooms}</li>
          <li>{t.admin.seed.requestCars}</li>
          <li>{t.admin.seed.editResources}</li>
          <li>{t.admin.seed.addMore}</li>
        </ul>
      </div>
    </div>
  );
}

