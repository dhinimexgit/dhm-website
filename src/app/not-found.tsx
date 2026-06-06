import Link from "next/link";
import { cookies } from "next/headers";

export default async function NotFound() {
  const cookieStore = await cookies();
  const isKh = cookieStore.get("NEXT_LOCALE")?.value === "kh";

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">
        404
      </p>
      <h1 className="text-4xl font-semibold text-brand-navy">{isKh ? "រកមិនឃើញទំព័រទេ" : "Page not found"}</h1>
      <p className="max-w-lg text-sm text-slate-600">
        {isKh ? "ទំព័រដែលអ្នកកំពុងស្វែងរកត្រូវបានផ្លាស់ប្តូរ ឬមិនមានទៀតទេ។ សូមប្រើប្រាស់ម៉ឺនុយដើម្បីត្រលប់ទៅវិញ។" : "The page you were looking for has moved or no longer exists. Please use the navigation to get back on track."}
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white"
      >
        {isKh ? "ត្រលប់ទៅទំព័រដើម" : "Return home"}
      </Link>
    </div>
  );
}

