import { Link } from "react-router-dom";
import { Play, List, Plus, Film, Star, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { IMG, getTitle, getType, getYear } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";

export function Hero({ items }) {
  const { t } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inList, setInList] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const total = items.length;
  const current = items[currentIndex] || items[0];

  // Auto-advance slideshow every 5 seconds (pauses on mouse hover, resets on slide change)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, currentIndex]);

  if (!current) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const type = getType(current);
  const title = getTitle(current);
  const year = getYear(current);
  const rating = current.vote_average > 0 ? current.vote_average.toFixed(1) : "8.7";

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-screen w-full overflow-hidden bg-black select-none"
    >
      {/* Background Slides with Crossfade */}
      {items.map((item, idx) => {
        const bg = IMG(item.backdrop_path, "original") || IMG(item.poster_path, "original");
        const isActive = idx === currentIndex;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
            }`}
          >
            {bg && (
              <img
                src={bg}
                alt={getTitle(item)}
                className={`h-full w-full object-cover object-center transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            )}
          </div>
        );
      })}

      {/* Cinematic Vignette Overlays (Smooth transition to deep dark #0b0c10) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/75 to-transparent w-full md:w-3/4" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-32" />

      {/* Content Container (Full Screen Centered/Bottom Aligned) */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col justify-end px-6 pb-20 md:px-12 md:pb-24">
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Title in Cinematic Serif */}
          <h1 className="font-cinematic text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            {title}
          </h1>

          {/* Meta Tags Row */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-white/80">
            <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white backdrop-blur-md">
              TV-MA
            </span>
            <span className="text-white/60">{year}</span>
            <span className="text-white/40">·</span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white backdrop-blur-md">
              HDR
            </span>
            <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white backdrop-blur-md">
              4K UHD
            </span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              {rating}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-xs font-medium text-white/90 backdrop-blur-md">
              {type === "tv" ? "TV Series" : "Feature Film"}
            </span>
          </div>

          {/* Synopsis Description */}
          <p className="mt-5 text-sm leading-relaxed text-white/75 drop-shadow md:text-base line-clamp-3 max-w-2xl">
            {current.overview ||
              "Stream in ultra-high definition with multi-audio support. Experience award-winning cinematic storytelling with top rated casts and thrilling visuals."}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center gap-3.5">
            {/* Play Button - Large Vibrant Purple/Indigo circle */}
            <Link
              to={`/watch/${type}/${current.id}`}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_45px_rgba(99,102,241,0.9)]"
              title={t.play}
              aria-label={t.play}
            >
              <Play className="h-6 w-6 fill-white text-white translate-x-0.5" />
            </Link>

            {/* Episodes / Details list button */}
            <Link
              to={`/watch/${type}/${current.id}`}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-xl transition duration-200 hover:bg-white/20 hover:scale-105"
              title={t.moreInfo}
              aria-label={t.moreInfo}
            >
              <List className="h-5 w-5" />
            </Link>

            {/* Add to Watchlist button */}
            <button
              onClick={() => setInList(!inList)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/15 shadow-xl backdrop-blur-xl transition duration-200 hover:scale-105 ${
                inList
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="Add to My List"
              aria-label="Add to My List"
            >
              <Plus
                className={`h-5 w-5 transition-transform duration-200 ${inList ? "rotate-45" : ""}`}
              />
            </button>

            {/* Watch Trailer button */}
            <Link
              to={`/watch/${type}/${current.id}`}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-xl transition duration-200 hover:bg-white/20 hover:scale-105"
              title={t.trailer}
              aria-label={t.trailer}
            >
              <Film className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Slideshow Navigation Controls (Arrows + Progress Indicators) */}
        <div className="absolute right-6 bottom-16 md:right-12 md:bottom-20 z-20 flex flex-col items-end gap-4">
          {/* Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-xl backdrop-blur-xl transition hover:bg-white/20 hover:scale-105 active:scale-95"
              aria-label="Previous Slide"
              title="Previous Slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-xl backdrop-blur-xl transition hover:bg-white/20 hover:scale-105 active:scale-95"
              aria-label="Next Slide"
              title="Next Slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Slide Progress Indicator Pills */}
          <div className="flex items-center gap-2">
            {items.map((item, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-8 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                      : "w-2.5 bg-white/25 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  title={getTitle(item)}
                />
              );
            })}
          </div>
        </div>

        {/* Scroll Down Hint at Bottom Center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-[11px] animate-bounce pointer-events-none">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
}
