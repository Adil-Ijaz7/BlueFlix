import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { api, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Home,
});

interface Bundle {
  trending: Media[];
  popularMovies: Media[];
  popularTV: Media[];
  topRated: Media[];
  bollywood: Media[];
  hindiTV: Media[];
  hindiDubbedMovies: Media[];
  hindiDubbedTV: Media[];
}

function Home() {
  const { lang, t } = useLang();
  const [data, setData] = useState<Bundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    Promise.all([
      api.trending(lang),
      api.popularMovies(lang),
      api.popularTV(lang),
      api.topRated(lang),
      api.bollywood(lang),
      api.hindiTV(lang),
      api.hindiDubbedMovies(lang),
      api.hindiDubbedTV(lang),
    ])
      .then(([trending, popularMovies, popularTV, topRated, bollywood, hindiTV, hindiDubbedMovies, hindiDubbedTV]) => {
        if (cancelled) return;
        setData({ trending, popularMovies, popularTV, topRated, bollywood, hindiTV, hindiDubbedMovies, hindiDubbedTV });
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-destructive font-bold">Failed to load: {error}</p>
          <button onClick={() => location.reload()} className="mt-4 px-4 py-2 bg-primary rounded text-primary-foreground">Retry</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hero = data.trending[0];

  return (
    <div className="pb-12">
      {hero && <Hero media={hero} />}
      <Row title={t.trending} items={data.trending.slice(1)} />
      <Row title={t.bollywoodMovies} items={data.bollywood} />
      <Row title={t.hindiDubbedMovies} items={data.hindiDubbedMovies} badge="HI Dub" />
      <Row title={t.popularMovies} items={data.popularMovies} />
      <Row title={t.hindiSeries} items={data.hindiTV} />
      <Row title={t.hindiDubbedTV} items={data.hindiDubbedTV} badge="HI Dub" />
      <Row title={t.popularTV} items={data.popularTV} />
      <Row title={t.topRated} items={data.topRated} />
    </div>
  );
}
