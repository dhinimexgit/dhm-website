import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
        404
      </p>
      <h1 className="text-4xl font-semibold text-brand-navy">Page not found</h1>
      <p className="max-w-lg text-sm text-slate-600">
        The page you were looking for has moved or no longer exists. Please use
        the navigation to get back on track.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white"
      >
        Return home
      </Link>
    </div>
  );
}

