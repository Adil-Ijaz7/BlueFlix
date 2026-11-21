import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { api } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { Sparkles, Flame, Swords, Tv2, Film, Star } from "lucide-react";

export function Anime() {
  const { lang, t } = useLang();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    document.title = `${t.anime} — BlueFlix`;
  }, [t.anime]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    Promise.allSettled([
      api.animeTrending(lang),
      api.animeAction(lang),
      api.cartoons(lang),
      api.animeMovies(lang),
      api.animeTopRated(lang),
    ])
      .then((results) => {
        if (cancelled) return;

        const getVal = (r) => (r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []);

        const bundle = {
          trending: getVal(results[0]).map((m) => ({ ...m, media_type: "tv" })),
          action: getVal(results[1]).map((m) => ({ ...m, media_type: "tv" })),
          cartoons: getVal(results[2]).map((m) => ({ ...m, media_type: "tv" })),
          movies: getVal(results[3]).map((m) => ({ ...m, media_type: "movie" })),
          topRated: getVal(results[4]).map((m) => ({ ...m, media_type: "tv" })),
        };

        const totalItems = Object.values(bundle).reduce((sum, arr) => sum + arr.length, 0);
        if (totalItems === 0) {
          setError("Unable to load anime and cartoons. Please check your network connection.");
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
          <span className="text-sm font-medium text-white/70">Loading Anime & Cartoons Hub...</span>
        </div>
      </div>
    );
  }

  const heroItems = data.trending.slice(0, 6);

  const tabs = [
    { id: "all", label: "All Categories", icon: Sparkles },
    { id: "trending", label: t.trendingAnime, icon: Flame },
    { id: "action", label: t.actionAnime, icon: Swords },
    { id: "cartoons", label: t.cartoons, icon: Tv2 },
    { id: "movies", label: t.animeMovies, icon: Film },
    { id: "topRated", label: t.topRatedAnime, icon: Star },
  ];

  return (
    <div className="pb-16">
      {/* Anime Spotlight Hero Banner */}
      {heroItems.length > 0 && <Hero items={heroItems} />}

      {/* Mini App Quick Jump Tabs */}
      <div className="mx-auto mt-6 w-full max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "border border-indigo-400/30 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Rows with Poster Cards */}
      {(activeTab === "all" || activeTab === "trending") && (
        <Row title={t.trendingAnime} items={data.trending} seeAllLink="/browse?cat=tv&genre=16" />
      )}

      {(activeTab === "all" || activeTab === "action") && (
        <Row title={t.actionAnime} items={data.action} seeAllLink="/browse?cat=tv&genre=16" />
      )}

      {(activeTab === "all" || activeTab === "cartoons") && (
        <Row title={t.cartoons} items={data.cartoons} seeAllLink="/browse?cat=tv&genre=16" />
      )}

      {(activeTab === "all" || activeTab === "movies") && (
        <Row title={t.animeMovies} items={data.movies} seeAllLink="/browse?cat=movie&genre=16" />
      )}

      {(activeTab === "all" || activeTab === "topRated") && (
        <Row title={t.topRatedAnime} items={data.topRated} seeAllLink="/browse?cat=tv&genre=16" />
      )}
    </div>
  );
}
