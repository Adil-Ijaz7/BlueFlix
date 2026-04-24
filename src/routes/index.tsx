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
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div className="rounded-lg border border-border bg-surface/80 p-6 shadow-card backdrop-blur">
          <p className="font-semibold text-destructive">Failed to load: {error}</p>
          <button onClick={() => location.reload()} className="mt-4 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:brightness-110">Retry</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading titles...</span>
        </div>
      </div>
    );
  }

  const hero = data.trending[0];

  return (
    <div className="pb-14">
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
