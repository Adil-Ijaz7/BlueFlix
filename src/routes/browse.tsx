import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { api, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { PosterCard } from "@/components/PosterCard";
import { cn } from "@/lib/utils";

const schema = z.object({
  cat: fallback(z.enum(["movie", "tv", "bollywood", "hindi-tv", "top"]), "movie").default("movie"),
  genre: fallback(z.number().optional(), undefined).optional(),
  year: fallback(z.number().optional(), undefined).optional(),
  rating: fallback(z.number().optional(), undefined).optional(),
});

export const Route = createFileRoute("/browse")({
  validateSearch: zodValidator(schema),
  component: Browse,
});

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 16 }, (_, i) => CURRENT_YEAR - i);
const RATINGS = [9, 8, 7, 6, 5];

function catToDiscover(cat: string): {
  type: "movie" | "tv";
  originalLanguage?: string;
  region?: string;
  baseMinRating?: number;
} {
  switch (cat) {
    case "tv": return { type: "tv" };
    case "bollywood": return { type: "movie", originalLanguage: "hi", region: "IN" };
    case "hindi-tv": return { type: "tv", originalLanguage: "hi" };
    case "top": return { type: "movie", baseMinRating: 7.5 };
    default: return { type: "movie" };
  }
}

function Browse() {
  const search = Route.useSearch();
  const { cat, genre, year, rating } = search;
  const { lang, t } = useLang();
  const [items, setItems] = useState<Media[] | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  const cfg = useMemo(() => catToDiscover(cat), [cat]);

  useEffect(() => {
    api.genres(cfg.type, lang).then(setGenres).catch(() => setGenres([]));
  }, [cfg.type, lang]);

  useEffect(() => {
    setItems(null);
    api
      .discover(cfg.type, lang, {
        genreId: genre,
        year,
        minRating: rating ?? cfg.baseMinRating,
        originalLanguage: cfg.originalLanguage,
        region: cfg.region,
      })
      .then(setItems)
      .catch(() => setItems([]));
  }, [cfg, lang, genre, year, rating]);

  const title =
    cat === "movie" ? t.popularMovies
    : cat === "tv" ? t.popularTV
    : cat === "bollywood" ? t.bollywoodMovies
    : cat === "hindi-tv" ? t.hindiSeries
    : t.topRated;

  const hasFilters = genre !== undefined || year !== undefined || rating !== undefined;

  return (
    <div className="px-4 md:px-8 py-8">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{title}</h1>

      <div className="space-y-4 mb-8">
        <FilterRow label={t.genre}>
          <Chip to="/browse" search={(p) => ({ ...p, genre: undefined })} active={genre === undefined}>
            {t.anyGenre}
          </Chip>
          {genres.map((g) => (
            <Chip
              key={g.id}
              to="/browse"
              search={(p) => ({ ...p, genre: g.id })}
              active={genre === g.id}
            >
              {g.name}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t.year}>
          <Chip to="/browse" search={(p) => ({ ...p, year: undefined })} active={year === undefined}>
            {t.anyYear}
          </Chip>
          {YEARS.map((y) => (
            <Chip key={y} to="/browse" search={(p) => ({ ...p, year: y })} active={year === y}>
              {y}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t.minRating}>
          <Chip to="/browse" search={(p) => ({ ...p, rating: undefined })} active={rating === undefined}>
            {t.any}
          </Chip>
          {RATINGS.map((r) => (
            <Chip key={r} to="/browse" search={(p) => ({ ...p, rating: r })} active={rating === r}>
              ★ {r}+
            </Chip>
          ))}
        </FilterRow>

        {hasFilters && (
          <Link
            to="/browse"
            search={{ cat, genre: undefined, year: undefined, rating: undefined }}
            className="inline-block text-xs text-muted-foreground hover:text-foreground underline"
          >
            {t.clearFilters}
          </Link>
        )}
      </div>

      {!items ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">{t.noResults}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {items.map((m) => <PosterCard key={m.id} media={m} />)}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
        {label}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 md:-mx-8 px-4 md:px-8 row-scroll">
        {children}
      </div>
    </div>
  );
}

type ChipSearch = (prev: z.infer<typeof schema>) => Partial<z.infer<typeof schema>>;

function Chip({
  to,
  search,
  active,
  children,
}: {
  to: "/browse";
  search: ChipSearch;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={cn(
        "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-surface-2 text-foreground border-border hover:bg-surface",
      )}
    >
      {children}
    </Link>
  );
}
