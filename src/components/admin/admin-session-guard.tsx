"use client";

import { useCallback, useEffect, useRef } from "react";
import { touchAdminSession, checkAdminSession } from "@/app/actions/auth";

const ACTIVITY_DEBOUNCE_MS = 30_000;
const SESSION_CHECK_INTERVAL_MS = 60_000;

/**
 * Keeps the admin session alive while the user is active and signs out after 1 hour of inactivity
 * even when the user stays on the same page without full navigations.
 */
export function AdminSessionGuard() {
  const lastTouchRef = useRef(0);
  const touchingRef = useRef(false);

  const refreshActivity = useCallback(async () => {
    const now = Date.now();
    if (touchingRef.current || now - lastTouchRef.current < ACTIVITY_DEBOUNCE_MS) {
      return;
    }
    touchingRef.current = true;
    lastTouchRef.current = now;
    try {
      const result = await touchAdminSession();
      if (!result.valid) {
        window.location.href = "/dhm-myadmin/login?expired=1";
      }
    } finally {
      touchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const onActivity = () => {
      void refreshActivity();
    };

    for (const event of events) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    const intervalId = window.setInterval(async () => {
      const result = await checkAdminSession();
      if (!result.valid) {
        window.location.href = "/dhm-myadmin/login?expired=1";
      }
    }, SESSION_CHECK_INTERVAL_MS);

    void refreshActivity();

    return () => {
      for (const event of events) {
        window.removeEventListener(event, onActivity);
      }
      window.clearInterval(intervalId);
    };
  }, [refreshActivity]);

  return null;
}
