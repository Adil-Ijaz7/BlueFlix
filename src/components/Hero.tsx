import { Link } from "@tanstack/react-router";
import { IMG, getTitle, getType, getYear, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";

export function Hero({ media }: { media: Media }) {
  const { t } = useLang();
  const type = getType(media);
  const bg = IMG(media.backdrop_path, "original") || IMG(media.poster_path, "w780");

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] -mt-16">
      {bg && (
        <img
          src={bg}
          alt={getTitle(media)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

      <div className="relative mx-auto grid h-full w-full max-w-[1500px] items-end gap-8 px-4 pb-12 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] md:px-8 md:pb-16">
        <div>
          <h1 className="font-display text-shadow-hero text-4xl font-semibold leading-none tracking-normal md:text-6xl">
            {getTitle(media)}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            {media.vote_average > 0 && (
              <span className="font-semibold text-primary">★ {media.vote_average.toFixed(1)}</span>
            )}
            <span>{getYear(media)}</span>
            <span className="rounded border border-border bg-surface/80 px-2 py-0.5 text-xs uppercase text-foreground">{type}</span>
          </div>
          <p className="mt-4 max-w-2xl line-clamp-3 text-sm text-foreground/90 text-shadow-hero md:text-base">
            {media.overview}
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(media.id) }}
              className="gradient-primary shadow-glow rounded-md px-6 py-3 font-semibold text-primary-foreground transition hover:brightness-110 md:px-8"
            >
              {t.play}
            </Link>
            <Link
              to="/watch/$type/$id"
              params={{ type, id: String(media.id) }}
              className="rounded-md border border-border bg-surface-2/80 px-6 py-3 font-semibold text-foreground backdrop-blur transition hover:bg-surface md:px-8"
            >
              ⓘ {t.moreInfo}
            </Link>
          </div>
        </div>

        <aside className="hidden self-end rounded-lg border border-border bg-surface/80 p-5 shadow-card backdrop-blur md:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Featured</p>
          <p className="mt-2 line-clamp-2 font-display text-2xl font-semibold leading-tight">{getTitle(media)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-border bg-background/40 p-3">
              <p className="text-[11px] uppercase text-muted-foreground">Release</p>
              <p className="mt-1 font-semibold text-foreground">{getYear(media)}</p>
            </div>
            <div className="rounded border border-border bg-background/40 p-3">
              <p className="text-[11px] uppercase text-muted-foreground">Rating</p>
              <p className="mt-1 font-semibold text-primary">{media.vote_average > 0 ? media.vote_average.toFixed(1) : "N/A"}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
