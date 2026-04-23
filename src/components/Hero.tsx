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

      <div className="relative h-full flex flex-col justify-end pb-16 md:pb-24 px-4 md:px-12 max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-shadow-hero leading-none">
          {getTitle(media)}
        </h1>
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          {media.vote_average > 0 && (
            <span className="text-primary font-bold">★ {media.vote_average.toFixed(1)}</span>
          )}
          <span>{getYear(media)}</span>
          <span className="px-2 py-0.5 border border-border rounded text-xs uppercase">{type}</span>
        </div>
        <p className="mt-4 text-sm md:text-base text-foreground/90 line-clamp-3 max-w-xl text-shadow-hero">
          {media.overview}
        </p>
        <div className="flex gap-3 mt-6">
          <Link
            to="/watch/$type/$id"
            params={{ type, id: String(media.id) }}
            className="gradient-primary shadow-glow text-primary-foreground font-bold px-6 md:px-8 py-3 rounded-md hover:brightness-110 transition"
          >
            {t.play}
          </Link>
          <Link
            to="/watch/$type/$id"
            params={{ type, id: String(media.id) }}
            className="bg-surface-2/80 backdrop-blur text-foreground font-bold px-6 md:px-8 py-3 rounded-md hover:bg-surface-2 transition"
          >
            ⓘ {t.moreInfo}
          </Link>
        </div>
      </div>
    </section>
  );
}
