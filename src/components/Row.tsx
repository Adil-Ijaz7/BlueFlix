import { PosterCard } from "./PosterCard";
import type { Media } from "@/lib/tmdb";

export function Row({ title, items, badge }: { title: string; items: Media[]; badge?: string }) {
  if (!items?.length) return null;
  return (
    <section className="mx-auto mt-10 w-full max-w-[1500px] px-4 md:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold tracking-normal md:text-2xl">{title}</h2>
        <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:inline">View All</span>
      </div>
      <div className="row-scroll flex gap-3 overflow-x-auto pb-3 -mx-4 md:-mx-8 px-4 md:px-8">
        {items.map((m) => (
          <PosterCard key={`${m.id}-${m.media_type ?? ""}`} media={m} badge={badge} />
        ))}
      </div>
    </section>
  );
}
