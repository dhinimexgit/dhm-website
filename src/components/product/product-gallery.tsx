'use client';

import Image from "next/image";
import { useState, useCallback, TouchEvent, useMemo, useEffect } from "react";

type Props = {
  images: string[] | null | undefined;
};

export function ProductGallery({ images }: Props) {
  // Filter out empty strings, null, and undefined values
  const validImages = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    return images.filter((img) => img && typeof img === 'string' && img.trim().length > 0);
  }, [images]);

  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset active index when valid images change
  useEffect(() => {
    if (validImages.length > 0 && active >= validImages.length) {
      setActive(0);
    }
  }, [validImages.length, active]);

  // Ensure active index is within bounds
  const safeActiveIndex = validImages.length > 0 ? Math.min(active, validImages.length - 1) : 0;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const nextImage = useCallback(() => {
    if (validImages.length === 0) return;
    setActive((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevImage = useCallback(() => {
    if (validImages.length === 0) return;
    setActive((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // Reset touch end on touch start
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  // Show placeholder if no valid images
  if (validImages.length === 0) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 w-full">
        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">No image available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = validImages[safeActiveIndex];

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 w-full">
      <div 
        className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {currentImage && (
          <Image
            src={currentImage}
            alt=""
            fill
            sizes="(max-width:1024px) 100vw, 30vw"
            className="object-contain p-4 transition-transform duration-300"
            draggable={false}
          />
        )}
        
        {/* Navigation Arrows - Only show if multiple images */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-brand-navy shadow-md transition hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-navy opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-brand-navy shadow-md transition hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-navy opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <button
              key={image}
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                safeActiveIndex === index
                  ? "ring-2 ring-[#2E388C] border-transparent"
                  : "border-slate-200 hover:border-brand-red/40"
              }`}
            >
              {image && (
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="100px"
                  className="object-contain p-1"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
