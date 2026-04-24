import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { api, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { PosterCard } from "@/components/PosterCard";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { lang, t } = useLang();
  const [results, setResults] = useState<Media[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      api.search(q, lang)
        .then((r) => setResults(r))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [q, lang]);

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-normal md:text-5xl">{t.search}</h1>
      <input
        autoFocus
        type="text"
        value={q}
        onChange={(e) => navigate({ search: { q: e.target.value }, replace: true })}
        placeholder={t.search}
        className="mt-5 w-full rounded-md border border-border bg-surface px-5 py-4 text-lg text-foreground transition focus:border-primary focus:outline-none focus:shadow-glow md:text-xl"
      />
      <div className="mt-8">
        {loading && <div className="rounded-md border border-border bg-surface px-4 py-3 text-muted-foreground">{t.searching}</div>}
        {!loading && results && results.length === 0 && q.length >= 2 && (
          <div className="rounded-md border border-border bg-surface px-4 py-3 text-muted-foreground">{t.noResults}</div>
        )}
        {results && results.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((m) => <PosterCard key={`${m.media_type}-${m.id}`} media={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}
