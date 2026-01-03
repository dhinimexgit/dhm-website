"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  // On homepage, hide the global header since HomeHero has its own header
  // On mobile, the SiteHeader will still show for homepage
  if (isHomePage) {
    return (
      <div className="lg:hidden">
        <SiteHeader />
      </div>
    );
  }

  // For other pages, show header normally
  // SiteHeader handles mobile/desktop display appropriately
  return <SiteHeader />;
}
