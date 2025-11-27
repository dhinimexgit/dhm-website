"use client";

import { SiteHeader } from "./site-header";

export function ConditionalHeader() {
  // Always show header - it handles mobile/desktop display appropriately
  // SiteHeader will hide desktop nav on pages with embedded navbars
  return <SiteHeader />;
}

