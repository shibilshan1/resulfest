"use client";

import { useState, useEffect, useRef } from "react";
import { SlideshowImage } from "@/types";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSlideshowProps {
  images: SlideshowImage[];
}

export function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [activeOffset, setActiveOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slides = images && images.length > 0 ? images : [];

  // Auto-slide every 2 seconds (2000ms) continuous transition
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveOffset((prev) => (prev + 1) % slides.length);
    }, 2000); // 2 seconds auto-slide

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  if (slides.length === 0) return null;

  // Duplicate slides array to create seamless looping carousel
  const displaySlides = [...slides, ...slides, ...slides];

  return (
    <section id="gallery" className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-8 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0062D2] fill-[#0062D2]/20" />
            Horizons Gallery
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Moments & Highlights • Kizil Elma 2K26
          </p>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveOffset((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => setActiveOffset((prev) => (prev + 1) % slides.length)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
            title="Next"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ── Reference Style Horizontal Multi-Card Slider ── */}
      {/* Cards touch each other with only tiny 8px gap (gap-2) & curved corners (rounded-3xl) */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950/5 p-2 border border-slate-200/60 shadow-inner">
        <div
          className="flex gap-2 sm:gap-2.5 transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${(activeOffset % slides.length) * 45}%)`,
          }}
        >
          {displaySlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="relative shrink-0 w-[42%] sm:w-[28%] md:w-[22%] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 group cursor-pointer"
              onClick={() => setActiveOffset(index % slides.length)}
            >
              {/* Image */}
              <img
                src={slide.image_url}
                alt={slide.title || "Gallery Item"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-2xl sm:rounded-3xl"
              />

              {/* Minimal Overlay Badge & Title (No wasted title space) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                {slide.category && (
                  <span className="self-start px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider mb-1 border border-white/20">
                    {slide.category}
                  </span>
                )}
                {slide.title && (
                  <p className="text-xs sm:text-sm font-black text-white leading-tight drop-shadow-md truncate">
                    {slide.title}
                  </p>
                )}
                {slide.subtitle && (
                  <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
