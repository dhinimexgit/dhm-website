import Link from "next/link";
import type { CareerRole } from "@/data/site-content";
import { getCareers } from "@/data/site-content";
import { useLanguage } from "@/lib/i18n";

type Props = {
  roles?: CareerRole[];
};

export function JobList({ roles: propRoles }: Props) {
  const { language } = useLanguage();
  const roles = propRoles || getCareers(language);

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <article
          key={role.title}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold text-brand-navy">
              {role.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {role.location} · Deadline {role.deadline}
            </p>
            <p className="mt-2 text-sm text-slate-500">{role.summary}</p>
          </div>
          <Link
            href={role.url}
            className="inline-flex items-center justify-center rounded-full border border-brand-red px-5 py-2 text-sm font-semibold text-brand-red transition hover:bg-brand-red hover:text-white"
          >
            Apply now
          </Link>
        </article>
      ))}
    </div>
  );
}

