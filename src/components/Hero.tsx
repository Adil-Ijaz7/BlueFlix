import { Link } from "@tanstack/react-router";
import { IMG, getTitle, getType, getYear, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";

export function Hero({ media }: { media: Media }) {
  const { t } = useLang();
  const type = getType(media);
  const bg = IMG(media.backdrop_path, "original") || IMG(media.poster_path, "w780");

  return (
    <section className="relative -mt-16 min-h-[560px] w-full overflow-hidden">
      {bg && (
        <img
          src={bg}
          alt={getTitle(media)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-overlay" />

      <div className="relative mx-auto grid min-h-[560px] w-full max-w-[1500px] items-end gap-8 px-4 pb-12 pt-28 md:grid-cols-[minmax(0,1.25fr)_minmax(290px,0.75fr)] md:px-8 md:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Featured Premiere</p>
          <h1 className="mt-3 font-display text-shadow-hero text-4xl font-semibold leading-[1.02] tracking-normal md:text-7xl">
            {getTitle(media)}
          </h1>
          <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            {media.vote_average > 0 && (
              <span className="font-semibold text-primary">★ {media.vote_average.toFixed(1)}</span>
            )}
            <span>{getYear(media)}</span>
            <span className="rounded border border-border bg-surface/80 px-2 py-0.5 text-xs uppercase text-foreground">{type}</span>
          </div>
          <p className="mt-5 max-w-2xl line-clamp-3 text-base text-foreground/90 text-shadow-hero">
            {media.overview}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(media.id) }}
              className="gradient-primary shadow-glow rounded-md px-7 py-3 font-semibold text-primary-foreground transition hover:brightness-110"
            >
              {t.play}
            </Link>
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(media.id) }}
              className="rounded-md border border-border bg-surface/85 px-7 py-3 font-semibold text-foreground backdrop-blur transition hover:bg-surface-2"
            >
              ⓘ {t.moreInfo}
            </Link>
          </div>
        </div>

        <aside className="hidden self-end rounded-md border border-border bg-surface/80 p-5 shadow-card backdrop-blur md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Spotlight</p>
          <p className="mt-2 line-clamp-2 font-display text-2xl font-semibold leading-tight">{getTitle(media)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-border bg-background/40 p-3">
              <p className="text-[11px] uppercase text-muted-foreground">Release</p>
              <p className="mt-1 font-semibold text-foreground">{getYear(media)}</p>
            </div>
            <div className="rounded-md border border-border bg-background/40 p-3">
              <p className="text-[11px] uppercase text-muted-foreground">Rating</p>
              <p className="mt-1 font-semibold text-primary">{media.vote_average > 0 ? media.vote_average.toFixed(1) : "N/A"}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
