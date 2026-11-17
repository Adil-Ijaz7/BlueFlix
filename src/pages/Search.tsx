import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";
import { api, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { PosterCard } from "@/components/PosterCard";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { lang, t } = useLang();
  const [results, setResults] = useState<Media[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = q ? `Search: "${q}" — BlueFlix` : `Search — BlueFlix`;
  }, [q]);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const handle = setTimeout(() => {
      api
        .search(q, lang)
        .then((r) => {
          if (!cancelled) setResults(r);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [q, lang]);

  const quickSearches = [
    "House of the Dragon",
    "Stranger Things",
    "Inception",
    "Interstellar",
    "Pathaan",
    "Breaking Bad",
    "The Dark Knight",
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 pt-20 pb-8 md:px-10 md:pt-20">
      <div className="max-w-2xl">
        <h1 className="font-cinematic text-3xl font-bold tracking-wide text-white md:text-5xl">
          {t.search}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Search millions of movies, TV series, anime, and Bollywood hits with instant streaming.
        </p>
      </div>

      {/* Spotlight Search Box */}
      <div className="relative mt-8">
        <SearchIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <input
          autoFocus
          type="text"
          value={q}
          aria-label={t.search}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              setSearchParams({ q: val }, { replace: true });
            } else {
              setSearchParams({}, { replace: true });
            }
          }}
          placeholder="Search by title, director, or cast..."
          className="w-full rounded-2xl border border-white/10 bg-[#13151f]/80 py-4.5 pl-14 pr-12 text-base text-white shadow-2xl backdrop-blur-xl transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 md:text-lg"
        />
        {q && (
          <button
            onClick={() => setSearchParams({}, { replace: true })}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Search Tag Suggestions */}
      {!q && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-white/40">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Trending Searches:
          </span>
          {quickSearches.map((term) => (
            <button
              key={term}
              onClick={() => setSearchParams({ q: term })}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-indigo-500/50 hover:bg-white/10 hover:text-white"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Results View */}
      <div className="mt-10">
        {loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#13151f] p-4 text-sm text-white/60">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <span>{t.searching}</span>
          </div>
        )}

        {!loading && results && results.length === 0 && q.length >= 2 && (
          <div className="rounded-2xl border border-white/10 bg-[#13151f] py-20 text-center text-white/40">
            {t.noResults}
          </div>
        )}

        {results && results.length > 0 && (
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Found {results.length} titles
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((m) => (
                <PosterCard key={`${m.media_type}-${m.id}`} media={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
