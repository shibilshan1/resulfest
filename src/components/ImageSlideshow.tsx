"use client";

import { useState, useEffect, useRef } from "react";
import { SlideshowImage } from "@/types";
import { ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon, Play, Pause } from "lucide-react";

interface ImageSlideshowProps {
  images: SlideshowImage[];
}

export function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = images && images.length > 0 ? images : [];

  // Auto-play timer set to 2 seconds (2000ms) as requested
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, slides.length]);

  if (slides.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section id="gallery" className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#0062D2] text-xs font-black uppercase tracking-widest border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-[#0062D2] fill-[#0062D2]/20" />
          Event Highlights & Moments
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Talents Meet Gallery
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
          Capturing unforgettable moments, performances, and celebrations
        </p>
      </div>

      {/* Apple-style Curved Boxy Image Carousel Container */}
      <div className="relative w-full overflow-hidden rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/80 shadow-2xl">
        {/* Main Display Boxy Curved Image Card */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[420px] rounded-2xl overflow-hidden bg-slate-900 group shadow-inner">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${
                  isActive
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 z-0 pointer-events-none"
                }`}
              >
                {/* Background Image */}
                <img
                  src={slide.image_url}
                  alt={slide.title || "Gallery Slide"}
                  className="w-full h-full object-cover rounded-2xl"
                />

                {/* Dark Gradient Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
                  {slide.category && (
                    <span className="inline-block self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-extrabold text-[10px] uppercase tracking-wider mb-2">
                      {slide.category}
                    </span>
                  )}
                  {slide.title && (
                    <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {slide.title}
                    </h3>
                  )}
                  {slide.subtitle && (
                    <p className="text-xs sm:text-sm font-medium text-slate-200 mt-1 max-w-xl truncate drop-shadow-sm">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Navigation Controls Overlay */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between z-20 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
              title="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
              title="Next Slide"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Play/Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
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

        {/* 3 or 4 Stylish Curved Box Thumbnail Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
          {slides.slice(0, 4).map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id || index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group text-left ${
                  isActive
                    ? "border-[#0062D2] ring-4 ring-blue-500/20 scale-[1.02] shadow-md z-10"
                    : "border-transparent opacity-65 hover:opacity-100 hover:scale-[1.01]"
                }`}
              >
                <img
                  src={slide.image_url}
                  alt={slide.title || `Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                  <p className="text-[10px] font-black text-white truncate leading-tight">
                    {slide.title || `Moment #${index + 1}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Apple-style Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-8 h-2.5 rounded-full bg-[#0062D2]"
                  : "w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400"
              }`}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
