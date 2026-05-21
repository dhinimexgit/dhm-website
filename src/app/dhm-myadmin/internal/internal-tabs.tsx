"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isAdmin: boolean;
  userEmail: string;
  permissions: string[];
};

export function InternalTabs({ isAdmin, userEmail, permissions }: Props) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dhm-myadmin/internal/rooms", label: "Room Booking", adminOnly: false, permission: "internal.rooms" },
    { href: "/dhm-myadmin/internal/cars", label: "Car Booking", adminOnly: false, permission: "internal.cars" },
    { href: "/dhm-myadmin/internal/admin", label: "Resource Management", adminOnly: true, permission: "internal.resource_management" },
  ];

  const isActive = (href: string) => {
    if (href === "/dhm-myadmin/internal") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex gap-8 border-b border-slate-200 overflow-x-auto mb-8">
      {tabs.map((tab) => {
        const hasPermission = permissions.includes(tab.permission);
        const accessible = (!tab.adminOnly || isAdmin) && hasPermission;
        const active = isActive(tab.href);

        if (!accessible) {
          return (
            <span
              key={tab.href}
              className="pb-4 text-sm font-medium text-slate-300 cursor-not-allowed flex items-center gap-2"
              title="Access restricted for your role"
            >
              {tab.label}
              <svg className="h-3.5 w-3.5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </span>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-4 text-sm font-medium transition relative whitespace-nowrap ${
              active
                ? "border-b-2 border-brand-red text-brand-navy"
               : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

