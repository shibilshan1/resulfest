"use client";

import { useState, useEffect, useRef } from "react";
import { SlideshowImage } from "@/types";
import { Sparkles, ChevronLeft, ChevronRight, Play, Pause, Layers } from "lucide-react";

interface ImageSlideshowProps {
  images: SlideshowImage[];
}

export function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [activeOffset, setActiveOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedShape, setSelectedShape] = useState<string>("All");

  const slides = images && images.length > 0 ? images : [];

  // Filter slides by selected shape if filter is active
  const filteredSlides = slides.filter((slide) => {
    if (selectedShape === "All") return true;
    return (slide.aspect_ratio || "portrait") === selectedShape;
  });

  const displayList = filteredSlides.length > 0 ? filteredSlides : slides;

  // Auto-slide every 2 seconds (2000ms) as requested
  useEffect(() => {
    if (!isPlaying || displayList.length <= 1) return;

    const timer = setInterval(() => {
      setActiveOffset((prev) => (prev + 1) % displayList.length);
    }, 2000); // 2-second timer interval

    return () => clearInterval(timer);
  }, [isPlaying, displayList.length]);

  if (displayList.length === 0) return null;

  // Tripled list for infinite looping scroll effect
  const loopSlides = [...displayList, ...displayList, ...displayList];

  return (
    <section
      id="gallery"
      className="w-full min-h-[90dvh] sm:min-h-0 flex flex-col justify-center max-w-6xl mx-auto px-3 sm:px-4 py-8 space-y-4"
    >
      {/* Immersive Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0062D2] text-[11px] font-black uppercase tracking-widest border border-blue-100 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#0062D2] fill-[#0062D2]/20" />
            Immersive Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kizil Elma Gallery
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Multi-shape portrait, square & wide moments in 2-second auto-slide
          </p>
        </div>

        {/* Controls & Shape Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Shape filter chips */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            {[
              { id: "All", label: "All Shapes" },
              { id: "portrait", label: "Vertical" },
              { id: "square", label: "Square" },
              { id: "landscape", label: "Wide" },
            ].map((shape) => (
              <button
                key={shape.id}
                onClick={() => {
                  setSelectedShape(shape.id);
                  setActiveOffset(0);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedShape === shape.id
                    ? "bg-[#0062D2] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>

          {/* Pause / Play 2s Auto */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-800 transition-colors"
            title={isPlaying ? "Pause 2s Auto-slide" : "Play 2s Auto-slide"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>2s Auto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Multi-Shape Full Mobile Screen Showcase Container ── */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950 p-3 sm:p-4 border border-slate-800 shadow-2xl space-y-3">
        {/* Main Active Banner Showcase Card */}
        {(() => {
          const activeSlide = displayList[activeOffset % displayList.length];
          const shape = activeSlide.aspect_ratio || "landscape";
          const aspectClass =
            shape === "portrait"
              ? "aspect-[3/4] max-h-[480px]"
              : shape === "square"
              ? "aspect-square max-h-[440px]"
              : "aspect-[16/9] max-h-[400px]";

          return (
            <div
              className={`relative w-full ${aspectClass} rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-inner group transition-all duration-700`}
            >
              <img
                src={activeSlide.image_url}
                alt={activeSlide.title || "Gallery Item"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Overlay Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 sm:p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  {activeSlide.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider border border-white/25">
                      {activeSlide.category}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/40 text-blue-200 text-[10px] font-bold uppercase">
                    {shape} Shape
                  </span>
                </div>

                {activeSlide.title && (
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                    {activeSlide.title}
                  </h3>
                )}
                {activeSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1 truncate drop-shadow-sm">
                    {activeSlide.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── Multi-Shape Horizontal Sliding Strip (Touching with 8px gap) ── */}
        <div className="relative w-full overflow-hidden pt-1">
          <div
            className="flex gap-2 sm:gap-2.5 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${(activeOffset % displayList.length) * 38}%)`,
            }}
          >
            {loopSlides.map((slide, index) => {
              const shape = slide.aspect_ratio || "portrait";
              const isCurrent = index % displayList.length === activeOffset % displayList.length;

              const cardAspect =
                shape === "portrait"
                  ? "aspect-[3/4] w-[35%] sm:w-[22%]"
                  : shape === "square"
                  ? "aspect-square w-[32%] sm:w-[20%]"
                  : "aspect-[16/10] w-[42%] sm:w-[28%]";

              return (
                <div
                  key={`${slide.id}-${index}`}
                  onClick={() => setActiveOffset(index % displayList.length)}
                  className={`relative shrink-0 ${cardAspect} rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    isCurrent
                      ? "border-[#0062D2] ring-4 ring-blue-500/30 scale-[1.03] shadow-lg z-10"
                      : "border-white/10 opacity-70 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <img
                    src={slide.image_url}
                    alt={slide.title || "Slide"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                    <span className="text-[9px] font-black text-white truncate">
                      {slide.title || `Item #${(index % displayList.length) + 1}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
