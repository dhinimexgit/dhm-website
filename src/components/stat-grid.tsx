import type { Stat } from "@/data/site-content";

type Props = {
  stats: Stat[];
};

export function StatGrid({ stats }: Props) {
  return (
    <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-100"
        >
          <dt className="text-sm font-medium text-slate-500">{stat.label}</dt>
          <dd className="mt-3 text-4xl font-semibold text-brand-navy">
            {stat.value}
          </dd>
          <p className="mt-2 text-sm text-slate-600">{stat.helper}</p>
        </div>
      ))}
    </dl>
  );
}

