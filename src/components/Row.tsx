import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PosterCard } from "./PosterCard";
import type { Media } from "@/lib/tmdb";

interface RowProps {
  title: string;
  items: Media[];
  badge?: string;
  seeAllLink?: string;
}

export function Row({ title, items, badge, seeAllLink }: RowProps) {
  if (!items?.length) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-[1500px] px-5 md:px-10">
      {/* Row Header (Matches screenshot "More Like This" + "See All") */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-white md:text-xl">{title}</h2>

        {seeAllLink ? (
          <Link
            to={seeAllLink}
            className="group flex items-center gap-1 text-xs font-semibold text-white/50 transition hover:text-white"
          >
            <span>See All</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-white/40">
            {items.length} titles
          </span>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div className="row-scroll -mx-5 flex gap-4 overflow-x-auto pb-4 px-5 md:-mx-10 md:px-10">
        {items.map((m) => (
          <PosterCard key={`${m.id}-${m.media_type ?? ""}`} media={m} badge={badge} />
        ))}
      </div>
    </section>
  );
}
