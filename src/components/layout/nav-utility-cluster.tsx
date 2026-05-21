import type { ReactNode } from "react";

/** Touch-friendly icon control inside `NavUtilityCluster` (search, language, sign-in). */
export const NAV_UTILITY_ICON_CLASS =
  "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/35";

type ClusterProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Groups compact header actions (search, language, login) in one soft “glass” pill
 * so the primary CTA (Contact) reads clearly beside it.
 */
export function NavUtilityCluster({ children, className = "" }: ClusterProps) {
  return (
    <div
      className={`inline-flex items-center rounded-xl bg-white/[0.07] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md ${className}`.trim()}
      role="group"
      aria-label="Site tools"
    >
      {children}
    </div>
  );
}

export function NavUtilityDivider() {
  return <span className="mx-0.5 h-6 w-px shrink-0 self-center bg-white/22" aria-hidden />;
}
