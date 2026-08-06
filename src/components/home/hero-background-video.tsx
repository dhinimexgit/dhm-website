"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster: string;
  className?: string;
};

/**
 * Hero background video that paints its poster immediately and only fetches the
 * MP4 once the page is idle.
 *
 * `autoPlay` overrides `preload`, so an autoplaying <video src> starts pulling
 * the full file straight away — on the home page that was 3 MB competing with
 * the JS and fonts needed for first paint. Holding `src` back until after
 * hydration keeps the poster as the LCP candidate and moves the video off the
 * critical path.
 */
export function HeroBackgroundVideo({ src, poster, className }: Props) {
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Respect users who have asked for less motion — leave the poster up.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setVideoSrc(src);
    };

    // requestIdleCallback is still unavailable on Safari < 17.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [src]);

  useEffect(() => {
    if (videoSrc && ref.current) {
      // Autoplay can be rejected (e.g. low-power mode); the poster stays up.
      void ref.current.play().catch(() => {});
    }
  }, [videoSrc]);

  return (
    <video
      ref={ref}
      src={videoSrc}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="none"
      className={className}
    />
  );
}
