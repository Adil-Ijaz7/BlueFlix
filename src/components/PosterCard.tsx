import { Link } from "@tanstack/react-router";
import { IMG, getTitle, getType, getYear, type Media } from "@/lib/tmdb";

export function PosterCard({ media, badge }: { media: Media; badge?: string }) {
  const type = getType(media);
  const poster = IMG(media.poster_path, "w300");
  return (
    <Link
      to="/watch/$type/$id"
      params={{ type, id: String(media.id) }}
      className="group relative w-[140px] shrink-0 overflow-hidden rounded-md border border-border bg-surface-2 shadow-card transition-transform duration-300 hover:z-10 hover:scale-[1.03] md:w-[180px]"
    >
      <div className="aspect-[2/3] bg-surface-2">
        {poster ? (
          <img
            src={poster}
            alt={getTitle(media)}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
            {getTitle(media)}
          </div>
        )}
      </div>
      {badge && (
        <span className="gradient-primary shadow-glow absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
          {badge}
        </span>
      )}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/55 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
        <div className="line-clamp-2 text-xs font-semibold">{getTitle(media)}</div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
          <span>{getYear(media)}</span>
          {media.vote_average > 0 && (
            <span className="text-primary">★ {media.vote_average.toFixed(1)}</span>
          )}
        </div>
        <span className="mt-1 text-[10px] uppercase text-muted-foreground">{type}</span>
      </div>
    </Link>
  );
}
