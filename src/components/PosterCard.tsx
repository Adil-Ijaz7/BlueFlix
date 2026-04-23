import { Link } from "@tanstack/react-router";
import { IMG, getTitle, getType, getYear, type Media } from "@/lib/tmdb";

export function PosterCard({ media, badge }: { media: Media; badge?: string }) {
  const type = getType(media);
  const poster = IMG(media.poster_path, "w300");
  return (
    <Link
      to="/watch/$type/$id"
      params={{ type, id: String(media.id) }}
      className="group relative shrink-0 w-[140px] md:w-[180px] rounded-lg overflow-hidden bg-surface-2 shadow-card transition-transform hover:scale-105 hover:z-10"
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
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider gradient-primary text-primary-foreground shadow-glow uppercase">
          {badge}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
        <div className="text-xs font-bold line-clamp-2">{getTitle(media)}</div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
          <span>{getYear(media)}</span>
          {media.vote_average > 0 && (
            <span className="text-primary">★ {media.vote_average.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
