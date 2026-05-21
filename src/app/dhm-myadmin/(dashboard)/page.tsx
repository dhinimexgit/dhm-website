import { getCurrentUser, canAccessFunction, type FunctionAccessKey } from "@/app/actions/auth";
import { SUPER_ADMIN_LOGIN_ID } from "@/lib/admin-auth-constants";
import Link from "next/link";
import { getTranslation } from "@/lib/i18n-server";

type Section = {
  href: string;
  id: "dashboard" | "prpo" | "userMgmt";
  requiredPerms: FunctionAccessKey[];
  icon: React.ReactNode;
  accent: string;
};

const SECTIONS: Section[] = [
  {
    href: "/dhm-myadmin/dashboard",
    id: "dashboard",
    requiredPerms: ["admin.products", "admin.posts", "admin.careers", "admin.inquiries", "admin.qrcode"],
    accent: "from-brand-navy to-[#3d4ba3]",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: "/dhm-myadmin/pr-po",
    id: "prpo",
    requiredPerms: [
      "admin.prpo",
      "admin.prpo.dashboard",
      "admin.prpo.submit",
      "admin.prpo.open",
      "admin.prpo.view",
    ],
    accent: "from-emerald-600 to-teal-600",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  /* Internal tooling hidden — restore this block to show the portal card again
  {
    href: "/dhm-myadmin/internal",
    id: "internal",
    requiredPerms: ["internal.rooms", "internal.cars", "internal.resource_management"],
    accent: "from-violet-600 to-purple-600",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m0 0l1.547-1.547a3.87 3.87 0 015.47 0l1.042 1.042m-7.06 6.546l1.547-1.547" />
      </svg>
    ),
  },
  */
  {
    href: "/dhm-myadmin/user-management",
    id: "userMgmt",
    requiredPerms: ["internal.user_management"],
    accent: "from-rose-600 to-brand-red",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const { t } = await getTranslation();
  const user = await getCurrentUser();
  const isSuperAdmin =
    user?.role === "super_admin" ||
    user?.username.toLowerCase() === SUPER_ADMIN_LOGIN_ID ||
    user?.email?.toLowerCase() === SUPER_ADMIN_LOGIN_ID;
  const permissions = user?.permissions ?? [];

  const canUserMgmt = await canAccessFunction("internal.user_management");

  const welcomeName = (() => {
    const label = user?.email ?? user?.username;
    if (!label) return "";
    return label.includes("@") ? label.split("@")[0]: label;
  })();

  const hasAccess = (section: Section) => {
    if (section.id === "userMgmt") return canUserMgmt;
    if (isSuperAdmin) return true;
    return section.requiredPerms.some((p) => permissions.includes(p));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red sm:text-sm">{t.admin.dashboard.portal}</p>
        <h1 className="text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl md:text-4xl">
          {t.admin.dashboard.welcomeBack}{welcomeName ? `, ${welcomeName}`: ""}
        </h1>
        <p className="text-base text-slate-500 sm:text-lg">{t.admin.dashboard.selectSection}</p>
      </div>

      {/* Section grid */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {SECTIONS.map((section) => {
          const accessible = hasAccess(section);
          const sectionTitle = t.admin[section.id]?.title || "";
          const sectionDesc = t.admin[section.id]?.desc || "";

          if (!accessible) {
            return (
              <div
                key={section.href}
                className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 opacity-50 select-none sm:p-6"
              >
                {/* Greyed gradient strip */}
                <div className="absolute inset-x-0 top-0 h-1 bg-slate-200 rounded-t-2xl" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  {section.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-400">{sectionTitle}</p>
                    <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{sectionDesc}</p>
                </div>
                <span className="mt-auto inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400">
                  {t.admin.dashboard.noAccess}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={section.href}
              href={section.href}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 sm:p-6"
            >
              {/* Coloured top strip */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${section.accent} rounded-t-2xl`} />
              {/* Icon */}
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${section.accent} text-white shadow-sm`}>
                {section.icon}
              </div>
              <div>
                <p className="text-base font-bold text-slate-800 group-hover:text-brand-navy transition-colors">{sectionTitle}</p>
                <p className="mt-1 text-sm text-slate-500">{sectionDesc}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-brand-navy">
                {t.admin.dashboard.open}
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
