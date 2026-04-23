import { PosterCard } from "./PosterCard";
import type { Media } from "@/lib/tmdb";

export function Row({ title, items, badge }: { title: string; items: Media[]; badge?: string }) {
  if (!items?.length) return null;
  return (
    <section className="px-4 md:px-8 mt-8">
      <h2 className="text-lg md:text-2xl font-bold mb-3 tracking-tight">{title}</h2>
      <div className="row-scroll flex gap-3 overflow-x-auto pb-3 -mx-4 md:-mx-8 px-4 md:px-8">
        {items.map((m) => (
          <PosterCard key={`${m.id}-${m.media_type ?? ""}`} media={m} badge={badge} />
        ))}
      </div>
    </section>
  );
}
