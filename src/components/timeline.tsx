import type { TimelineEvent } from "@/data/site-content";

type Props = {
  events: TimelineEvent[];
};

export function Timeline({ events }: Props) {
  return (
    <ol className="space-y-6 border-l-2 border-brand-sky pl-6">
      {events.map((event) => (
        <li key={event.year} className="relative">
          <span className="absolute -left-9 mt-1 h-4 w-4 rounded-full border-4 border-white bg-brand-red shadow ring-2 ring-brand-sky" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
            {event.year}
          </p>
          <h3 className="text-xl font-semibold text-brand-navy">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{event.description}</p>
        </li>
      ))}
    </ol>
  );
}

