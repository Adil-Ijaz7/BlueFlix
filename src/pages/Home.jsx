import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { api } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";

export function Home() {
  const { lang, t } = useLang();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "BlueFlix — Stream Movies & TV Shows";
  }, []);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    Promise.allSettled([
      api.trending(lang),
      api.popularMovies(lang),
      api.popularTV(lang),
      api.topRated(lang),
      api.bollywood(lang),
      api.hindiTV(lang),
      api.hindiDubbedMovies(lang),
      api.hindiDubbedTV(lang),
    ])
      .then((results) => {
        if (cancelled) return;

        const getVal = (r) => (r.status === "fulfilled" ? r.value : []);

        const bundle = {
          trending: getVal(results[0]),
          popularMovies: getVal(results[1]),
          popularTV: getVal(results[2]),
          topRated: getVal(results[3]),
          bollywood: getVal(results[4]),
          hindiTV: getVal(results[5]),
          hindiDubbedMovies: getVal(results[6]),
          hindiDubbedTV: getVal(results[7]),
        };

        const totalItems = Object.values(bundle).reduce((sum, arr) => sum + arr.length, 0);
        if (totalItems === 0) {
          setError("Unable to connect to TMDB. Please check your network connection.");
        } else {
          setData(bundle);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div className="rounded-2xl border border-white/10 bg-[#141620] p-6 shadow-2xl backdrop-blur-xl">
          <p className="font-semibold text-red-400">Failed to load: {error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141620]/80 px-5 py-3.5 backdrop-blur-xl">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-medium text-white/70">Loading BlueFlix Originals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-14">
      {data.trending.length > 0 && <Hero items={data.trending.slice(0, 6)} />}
      <Row title={t.trending} items={data.trending} seeAllLink="/browse?cat=movie" />
      <Row title={t.bollywoodMovies} items={data.bollywood} seeAllLink="/browse?cat=bollywood" />
      <Row
        title={t.hindiDubbedMovies}
        items={data.hindiDubbedMovies}
        seeAllLink="/browse?cat=movie"
      />
      <Row title={t.popularMovies} items={data.popularMovies} seeAllLink="/browse?cat=movie" />
      <Row title={t.hindiSeries} items={data.hindiTV} seeAllLink="/browse?cat=hindi-tv" />
      <Row title={t.hindiDubbedTV} items={data.hindiDubbedTV} seeAllLink="/browse?cat=tv" />
      <Row title={t.popularTV} items={data.popularTV} seeAllLink="/browse?cat=tv" />
      <Row title={t.topRated} items={data.topRated} seeAllLink="/browse?cat=top" />
    </div>
  );
}
