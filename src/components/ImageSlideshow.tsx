"use client";

import { useState, useEffect } from "react";
import { SlideshowImage } from "@/types";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface ImageSlideshowProps {
  images: SlideshowImage[];
}

export function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [selectedImage, setSelectedImage] = useState<SlideshowImage | null>(null);
  const [lightboxSlideIndex, setLightboxSlideIndex] = useState(0);

  const slides = images && images.length > 0 ? images : [];
  if (slides.length === 0) return null;

  // Distribute items into 2 columns for a balanced Pinterest masonry grid matching reference HTML
  const col1 = slides.filter((_, idx) => idx % 2 === 0);
  const col2 = slides.filter((_, idx) => idx % 2 === 1);

  const handleOpenLightbox = (img: SlideshowImage) => {
    setSelectedImage(img);
    setLightboxSlideIndex(0);
  };

  const activeSlideImages = selectedImage
    ? selectedImage.images && selectedImage.images.length > 0
      ? selectedImage.images
      : [selectedImage.image_url]
    : [];

  return (
    <section id="gallery" className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-10 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-widest border border-slate-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0062D2]" />
          Aesthetic Mosaic Gallery
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Visual Showcase & Highlights
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
          Explore curated festival moments with dynamic auto-sliding photo cards
        </p>
      </div>

      {/* ── Pinterest-Style Masonry Grid (Matching Reference HTML Structure) ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
        {/* Column 1 */}
        <div className="space-y-3 sm:space-y-4">
          {col1.map((img, idx) => (
            <MasonryCard
              key={img.id || idx}
              img={img}
              cardIndex={idx * 2}
              onClick={() => handleOpenLightbox(img)}
            />
          ))}
        </div>

        {/* Column 2 */}
        <div className="space-y-3 sm:space-y-4">
          {col2.map((img, idx) => (
            <MasonryCard
              key={img.id || idx}
              img={img}
              cardIndex={idx * 2 + 1}
              onClick={() => handleOpenLightbox(img)}
            />
          ))}
        </div>
      </div>

      {/* Full-screen Lightbox Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl space-y-0 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeSlideImages[lightboxSlideIndex] || selectedImage.image_url}
                alt={selectedImage.title || "Gallery Image"}
                className="w-full h-full object-contain max-h-[75vh] transition-opacity duration-300"
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20 z-20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Next/Prev Navigation Buttons inside Lightbox */}
              {activeSlideImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxSlideIndex((prev) =>
                        prev === 0 ? activeSlideImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setLightboxSlideIndex((prev) => (prev + 1) % activeSlideImages.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom Dot Indicators in Lightbox */}
              {activeSlideImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                  {activeSlideImages.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === lightboxSlideIndex ? "bg-white scale-125 shadow-md" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Footer */}
            {selectedImage && (
              <div className="p-5 bg-slate-900 text-white space-y-2 border-t border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                      {selectedImage.category || "Gallery"}
                    </span>
                    {selectedImage.instagram_url && (
                      <a
                        href={selectedImage.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-[11px] font-black hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <InstagramIcon className="w-3.5 h-3.5" />
                        <span>View on Instagram</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Slide {lightboxSlideIndex + 1} of {activeSlideImages.length}
                  </span>
                </div>
                {selectedImage.title && (
                  <h3 className="text-lg font-black text-slate-100">{selectedImage.title}</h3>
                )}
                {selectedImage.subtitle && (
                  <p className="text-xs text-slate-400 font-medium">{selectedImage.subtitle}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** Individual Mosaic Card with Auto-Sliding and Dots Indicator */
function MasonryCard({
  img,
  cardIndex,
  onClick,
}: {
  img: SlideshowImage;
  cardIndex: number;
  onClick: () => void;
}) {
  const slideList =
    img.images && img.images.length > 0 ? img.images : [img.image_url];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-sliding interval with staggered delay based on cardIndex
  useEffect(() => {
    if (slideList.length <= 1) return;

    // Stagger slide timing slightly across cards for visual rhythm
    const delay = 3200 + (cardIndex % 5) * 600;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideList.length);
    }, delay);

    return () => clearInterval(interval);
  }, [slideList.length, cardIndex]);

  // Aspect ratio class calculation matching reference prompt
  const shape = img.aspect_ratio || "portrait";
  const aspectClass =
    shape === "portrait"
      ? "aspect-[3/4]"
      : shape === "tall"
      ? "aspect-[9/16]"
      : shape === "vertical"
      ? "aspect-[4/5]"
      : shape === "landscape"
      ? "aspect-[16/10]"
      : "aspect-square";

  return (
    <div
      onClick={onClick}
      className="group relative w-full rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/80 bg-white"
    >
      <div className={`relative w-full ${aspectClass} rounded-3xl overflow-hidden bg-slate-900`}>
        {/* Slides Images with Smooth Cross-fade */}
        {slideList.map((slideUrl, idx) => (
          <img
            key={idx}
            src={slideUrl}
            alt={img.title || "Gallery Image"}
            className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-700 ${
              idx === currentSlideIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } group-hover:scale-105 transition-transform duration-500`}
          />
        ))}

        {/* Optional Instagram Link Badge */}
        {img.instagram_url && (
          <a
            href={img.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white backdrop-blur-md flex items-center justify-center border border-white/30 shadow-md transition-transform hover:scale-110 active:scale-95"
            title="View on Instagram"
          >
            <InstagramIcon className="w-4 h-4 text-white" />
          </a>
        )}

        {/* Hover Dark Overlay with Title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
          <div className="flex items-center justify-between gap-1 mb-1">
            {img.category && (
              <span className="inline-block self-start px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider border border-white/30">
                {img.category}
              </span>
            )}
            {img.instagram_url && (
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-pink-300 bg-black/40 px-2 py-0.5 rounded-full border border-pink-400/30">
                <InstagramIcon className="w-2.5 h-2.5" /> Instagram
              </span>
            )}
          </div>
          {img.title && (
            <h4 className="text-xs sm:text-sm font-extrabold text-white truncate drop-shadow-md">
              {img.title}
            </h4>
          )}
          {img.subtitle && (
            <p className="text-[10px] text-slate-200 truncate font-medium">
              {img.subtitle}
            </p>
          )}
        </div>

        {/* Dots Overlay at Bottom (Exact syntax requested from HTML spec) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {slideList.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlideIndex
                  ? "bg-white scale-125 shadow-sm"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
