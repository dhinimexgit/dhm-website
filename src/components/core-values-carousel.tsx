"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface CoreValue {
  title: string;
  description: string;
}

interface CoreValuesCarouselProps {
  values: CoreValue[];
}

export function CoreValuesCarousel({ values }: CoreValuesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? values.length - 1 : prevIndex - 1
    );
  }, [values.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === values.length - 1 ? 0 : prevIndex + 1
    );
  }, [values.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const currentValue = values[currentIndex];

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Main Card */}
      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl transition-all duration-300 md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ffffff]">
          <Image
            src="/core-value.png"
            alt="Core Value"
            width={65}
            height={65}
            className="h-[65px] w-[65px] object-contain"
          />
        </div>
        <h3 className="mb-6 text-3xl font-bold text-brand-navy md:text-4xl">
          Core Values
        </h3>
        <h3 className="mb-6 text-2xl font-bold text-brand md:text-2xl">
          {currentValue.title}
        </h3>
        <p className="min-h-[120px] text-lg leading-relaxed text-slate-600 md:min-h-[100px]">
          {currentValue.description}
        </p>

        {/* Navigation Arrows */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white shadow-lg transition hover:bg-[#252f6e] focus:outline-none focus:ring-2 focus:ring-[#2E388C] focus:ring-offset-2"
            aria-label="Previous value"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {values.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-[#2E388C]"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to value ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E388C] text-white shadow-lg transition hover:bg-[#252f6e] focus:outline-none focus:ring-2 focus:ring-[#2E388C] focus:ring-offset-2"
            aria-label="Next value"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      {/* <p className="mt-4 text-center text-sm text-slate-500">
        Use arrow keys to navigate
      </p> */}
    </div>
  );
}

