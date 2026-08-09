"use client";

import { useState } from "react";
import { SlideshowImage } from "@/types";
import { Sparkles, X, Maximize2 } from "lucide-react";

interface ImageSlideshowProps {
  images: SlideshowImage[];
}

export function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [selectedImage, setSelectedImage] = useState<SlideshowImage | null>(null);

  const slides = images && images.length > 0 ? images : [];
  if (slides.length === 0) return null;

  // Split images into 2 columns for mobile/tablet masonry layout matching user's screenshot
  const col1 = slides.filter((_, idx) => idx % 2 === 0);
  const col2 = slides.filter((_, idx) => idx % 2 === 1);

  return (
    <section id="gallery" className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-8 space-y-5">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-widest border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-[#0062D2]" />
          Aesthetic Showcase
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Visual Gallery
        </h2>
        <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
          Explore curated highlights, moments, and artistic perspectives
        </p>
      </div>

      {/* ── Pinterest-Style Masonry Grid (Matching Reference Screenshot) ── */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 items-start">
        {/* Column 1 */}
        <div className="space-y-2.5 sm:space-y-4">
          {col1.map((img) => (
            <MasonryCard key={img.id} img={img} onClick={() => setSelectedImage(img)} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="space-y-2.5 sm:space-y-4">
          {col2.map((img) => (
            <MasonryCard key={img.id} img={img} onClick={() => setSelectedImage(img)} />
          ))}
        </div>
      </div>

      {/* Full-screen Lightbox Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full max-h-[75vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || "Gallery Image"}
                className="w-full h-full object-contain max-h-[75vh]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            {selectedImage.title && (
              <div className="p-5 bg-white space-y-1">
                {selectedImage.category && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider mb-1">
                    {selectedImage.category}
                  </span>
                )}
                <h3 className="text-lg font-black text-slate-900">{selectedImage.title}</h3>
                {selectedImage.subtitle && (
                  <p className="text-xs text-slate-500 font-medium">{selectedImage.subtitle}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function MasonryCard({ img, onClick }: { img: SlideshowImage; onClick: () => void }) {
  const shape = img.aspect_ratio || "portrait";

  // Aspect ratio styles matching reference screenshot
  const aspectClass =
    shape === "portrait"
      ? "aspect-[3/4]"
      : shape === "landscape"
      ? "aspect-[16/10]"
      : "aspect-square";

  return (
    <div
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-1 sm:p-1.5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className={`relative w-full ${aspectClass} rounded-lg sm:rounded-xl overflow-hidden bg-slate-100`}>
        <img
          src={img.image_url}
          alt={img.title || "Gallery Image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Icon & Gradient Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Minimal Subtitle */}
      {img.title && (
        <div className="pt-2 px-1 pb-1">
          <p className="text-[11px] font-black text-slate-900 truncate leading-tight">
            {img.title}
          </p>
          {img.subtitle && (
            <p className="text-[9px] font-medium text-slate-400 truncate mt-0.5">
              {img.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
