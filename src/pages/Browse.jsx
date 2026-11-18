import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Film, Tv, Flame, Sparkles, X, Filter } from "lucide-react";
import { api } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { PosterCard } from "@/components/PosterCard";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 16 }, (_, i) => CURRENT_YEAR - i);
const RATINGS = [9, 8, 7, 6, 5];

function catToDiscover(cat) {
  switch (cat) {
    case "tv":
      return { type: "tv" };
    case "bollywood":
      return { type: "movie", originalLanguage: "hi", region: "IN" };
    case "hindi-tv":
      return { type: "tv", originalLanguage: "hi" };
    case "top":
      return { type: "movie", baseMinRating: 7.5 };
    default:
      return { type: "movie" };
  }
}

export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get("cat") || "movie";
  const genreParam = searchParams.get("genre");
  const yearParam = searchParams.get("year");
  const ratingParam = searchParams.get("rating");

  const genre = genreParam ? Number(genreParam) : undefined;
  const year = yearParam ? Number(yearParam) : undefined;
  const rating = ratingParam ? Number(ratingParam) : undefined;

  const { lang, t } = useLang();
  const [items, setItems] = useState(null);
  const [genres, setGenres] = useState([]);

  const cfg = useMemo(() => catToDiscover(cat), [cat]);

  const title =
    cat === "movie"
      ? t.popularMovies
      : cat === "tv"
        ? t.popularTV
        : cat === "bollywood"
          ? t.bollywoodMovies
          : cat === "hindi-tv"
            ? t.hindiSeries
            : t.topRated;

  useEffect(() => {
    document.title = `${title} — BlueFlix`;
  }, [title]);

  useEffect(() => {
    let cancelled = false;
    api
      .genres(cfg.type, lang)
      .then((g) => {
        if (!cancelled) setGenres(g);
      })
      .catch(() => {
        if (!cancelled) setGenres([]);
      });
    return () => {
      cancelled = true;
    };
  }, [cfg.type, lang]);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    api
      .discover(cfg.type, lang, {
        genreId: genre,
        year,
        minRating: rating ?? cfg.baseMinRating,
        originalLanguage: cfg.originalLanguage,
        region: cfg.region,
      })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [cfg, lang, genre, year, rating]);

  const hasFilters = genre !== undefined || year !== undefined || rating !== undefined;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    if (cat) next.set("cat", cat);
    setSearchParams(next);
  };

  const categories = [
    { id: "movie", label: t.movies, icon: Film },
    { id: "tv", label: t.tv, icon: Tv },
    { id: "bollywood", label: t.bollywood, icon: Flame },
    { id: "hindi-tv", label: t.hindiSeries, icon: Tv },
    { id: "top", label: t.topRated, icon: Sparkles },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 pt-20 pb-8 md:px-10 md:pt-20">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center gap-2.5 pb-6 border-b border-white/5">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("cat", c.id);
                setSearchParams(next);
              }}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h1 className="font-cinematic text-2xl font-bold tracking-wide text-white md:text-4xl">
          {title}
        </h1>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            <X className="h-3.5 w-3.5" />
            <span>{t.clearFilters}</span>
          </button>
        )}
      </div>

      {/* Filter Panels in Glass container */}
      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-[#13151f]/80 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <FilterRow label={t.genre}>
          <button
            onClick={() => updateParam("genre", undefined)}
            aria-pressed={genre === undefined}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              genre === undefined
                ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
            )}
          >
            {t.anyGenre}
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => updateParam("genre", g.id)}
              aria-pressed={genre === g.id}
              className={cn(
                "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                genre === g.id
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {g.name}
            </button>
          ))}
        </FilterRow>

        <FilterRow label={t.year}>
          <button
            onClick={() => updateParam("year", undefined)}
            aria-pressed={year === undefined}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              year === undefined
                ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
            )}
          >
            {t.anyYear}
          </button>
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => updateParam("year", y)}
              aria-pressed={year === y}
              className={cn(
                "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                year === y
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {y}
            </button>
          ))}
        </FilterRow>

        <FilterRow label={t.minRating}>
          <button
            onClick={() => updateParam("rating", undefined)}
            aria-pressed={rating === undefined}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              rating === undefined
                ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
            )}
          >
            {t.any}
          </button>
          {RATINGS.map((r) => (
            <button
              key={r}
              onClick={() => updateParam("rating", r)}
              aria-pressed={rating === r}
              className={cn(
                "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                rating === r
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              ★ {r}+
            </button>
          ))}
        </FilterRow>
      </div>

      {/* Grid of Results */}
      {!items ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#13151f] py-20 text-center text-white/40">
          {t.noResults}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((m) => (
            <PosterCard key={m.id} media={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="row-scroll -mx-5 flex gap-2 overflow-x-auto pb-2 px-5 md:-mx-5 md:px-5">
        {children}
      </div>
    </div>
  );
}
