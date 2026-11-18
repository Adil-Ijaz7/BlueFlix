import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { IMG, getTitle, getType, getYear } from "@/lib/tmdb";

export function PosterCard({ media, badge }) {
  const type = getType(media);
  const title = getTitle(media);
  const year = getYear(media);
  const poster = IMG(media.poster_path, "w500");
  const rating = media.vote_average > 0 ? media.vote_average.toFixed(1) : null;

  return (
    <Link
      to={`/watch/${type}/${media.id}`}
      className="group relative flex w-[150px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#13151f] shadow-lg transition-all duration-300 hover:z-20 hover:-translate-y-1.5 hover:scale-105 hover:border-indigo-500/60 hover:shadow-[0_12px_30px_rgba(99,102,241,0.3)] sm:w-[175px] md:w-[195px]"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#181a24]">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-white/40">
            {title}
          </div>
        )}

        {/* Top Badge (if provided) */}
        {badge && (
          <div className="absolute left-2.5 top-2.5 z-10 rounded-md border border-indigo-400/30 bg-indigo-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
            {badge}
          </div>
        )}

        {/* Hover Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Metadata Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-12 transition-opacity duration-300">
          <h3 className="line-clamp-1 text-xs font-bold text-white drop-shadow sm:text-sm">
            {title}
          </h3>
          <div className="mt-1 flex items-center justify-between text-[11px] text-white/70">
            <span>{year}</span>
            {rating && (
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" />
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
