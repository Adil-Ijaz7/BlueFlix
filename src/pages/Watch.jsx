import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Film, Play, User } from "lucide-react";
import { api, IMG, getTitle, getYear } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { Row } from "@/components/Row";

export function Watch() {
  const { type, id } = useParams();
  const mediaType = type === "tv" ? "tv" : "movie";
  const tmdbId = Number(id);
  const { lang, t } = useLang();
  const [details, setDetails] = useState(null);
  const [recs, setRecs] = useState([]);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDetails(null);
    setSeason(1);
    setEpisode(1);
    setShowTrailer(false);

    if (!tmdbId || isNaN(tmdbId)) return;

    api
      .details(mediaType, tmdbId, lang)
      .then((d) => {
        if (!cancelled) setDetails(d);
      })
      .catch(() => {
        if (!cancelled) setDetails(null);
      });

    api
      .recommendations(mediaType, tmdbId, lang)
      .then((r) => {
        if (!cancelled) setRecs(r);
      })
      .catch(() => {
        if (!cancelled) setRecs([]);
      });

    return () => {
      cancelled = true;
    };
  }, [mediaType, tmdbId, lang]);

  useEffect(() => {
    if (details) {
      document.title = `Watch ${getTitle(details)} — BlueFlix`;
    }
  }, [details]);

  if (!details) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141620]/80 px-6 py-4 backdrop-blur-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-medium text-white/70">Connecting to stream...</span>
        </div>
      </div>
    );
  }

  // VidSrc.to is the primary and only streaming provider
  const vidsrcUrl =
    mediaType === "movie"
      ? `https://vidsrc.to/embed/movie/${tmdbId}`
      : `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;

  const trailer =
    details.videos?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    details.videos?.results?.find((v) => v.site === "YouTube");

  const src =
    showTrailer && trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : vidsrcUrl;

  const seasons = details.seasons?.filter((s) => s.season_number > 0) ?? [];
  const currentSeason = seasons.find((s) => s.season_number === season);
  const episodes = currentSeason
    ? Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1)
    : [];

  const title = getTitle(details);
  const cast = details.credits?.cast?.slice(0, 16) || [];

  return (
    <div className="pt-16 pb-16 md:pt-16">
      {/* Theater Video Player Section */}
      <div className="relative mx-auto mt-2 w-full max-w-[1500px] px-0 md:mt-4 md:px-8">
        {/* Soft backlight behind player */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 blur-2xl opacity-60 pointer-events-none max-md:hidden" />

        <div className="relative aspect-video w-full overflow-hidden border-y border-white/10 bg-black md:rounded-3xl md:border md:shadow-2xl">
          <iframe
            key={src}
            src={src}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="no-referrer"
            className="h-full w-full border-0"
            title={title}
          />
        </div>
      </div>

      {/* TV Season & Episode Selector */}
      {mediaType === "tv" && seasons.length > 0 && (
        <div className="mx-auto mt-6 w-full max-w-[1500px] px-5 md:px-8">
          <div className="rounded-2xl border border-white/10 bg-[#13151f]/90 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                  {t.season}
                </label>
                <select
                  value={season}
                  onChange={(e) => {
                    setSeason(Number(e.target.value));
                    setEpisode(1);
                  }}
                  className="rounded-xl border border-white/10 bg-[#181b26] px-4 py-2.5 text-sm font-semibold text-white focus:border-indigo-500 focus:outline-none"
                >
                  {seasons.map((s) => (
                    <option key={s.season_number} value={s.season_number}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[220px]">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                  {t.episode} ({episodes.length} episodes)
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {episodes.map((ep) => (
                    <button
                      key={ep}
                      onClick={() => {
                        setEpisode(ep);
                        setShowTrailer(false);
                      }}
                      className={`min-w-[42px] rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                        episode === ep && !showTrailer
                          ? "border-indigo-400 bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      EP {ep}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Details, Rating, and Summary */}
      <div className="mx-auto mt-8 grid max-w-[1500px] gap-8 px-5 md:grid-cols-[220px_1fr] md:px-8">
        {details.poster_path && (
          <img
            src={IMG(details.poster_path, "w500")}
            alt={title}
            className="w-full max-w-[220px] rounded-2xl border border-white/10 shadow-2xl"
          />
        )}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-cinematic text-3xl font-black uppercase tracking-wider text-white md:text-5xl">
              {title}
            </h1>

            {/* Trailer toggle button if trailer available */}
            {trailer && (
              <button
                onClick={() => setShowTrailer(!showTrailer)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  showTrailer
                    ? "border-amber-400/50 bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-[0_0_16px_rgba(245,158,11,0.5)]"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {showTrailer ? (
                  <Play className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Film className="h-3.5 w-3.5" />
                )}
                <span>{showTrailer ? "Back to Stream" : "Watch Trailer"}</span>
              </button>
            )}
          </div>

          {details.tagline && (
            <p className="mt-2 text-sm italic text-indigo-400/90">{details.tagline}</p>
          )}

          {/* Rating, Year, Runtime */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
            {details.vote_average > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm font-bold text-white">
                  {details.vote_average.toFixed(1)}
                </span>
                <span className="text-[11px] text-white/40">/ 10</span>
              </span>
            )}
            <span className="text-white/40">·</span>
            <span>{getYear(details)}</span>
            {details.runtime && (
              <>
                <span className="text-white/40">·</span>
                <span>{details.runtime} mins</span>
              </>
            )}
            <span className="text-white/40">·</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-xs font-medium text-white/90">
              {mediaType === "tv" ? "TV Series" : "Feature Film"}
            </span>
          </div>

          {/* Genres */}
          {details.genres && details.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {details.genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Movie Summary */}
          <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-white/50">
            {t.overview}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
            {details.overview || "No overview available for this title."}
          </p>
        </div>
      </div>

      {/* Starring People (Cast) */}
      {cast.length > 0 && (
        <div className="mx-auto mt-12 w-full max-w-[1500px] px-5 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-white md:text-xl">
              Starring Cast
            </h2>
            <span className="text-xs font-semibold text-white/40">{cast.length} Actors</span>
          </div>

          <div className="row-scroll -mx-5 flex gap-4 overflow-x-auto pb-4 px-5 md:-mx-8 md:px-8">
            {cast.map((person) => {
              const photo = IMG(person.profile_path, "w185");
              return (
                <div
                  key={person.id}
                  className="group flex w-[120px] shrink-0 flex-col items-center text-center transition-transform hover:-translate-y-1 sm:w-[130px]"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#161824] shadow-md transition group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    {photo ? (
                      <img
                        src={photo}
                        alt={person.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2.5 line-clamp-1 w-full text-xs font-bold text-white group-hover:text-indigo-400">
                    {person.name}
                  </h3>
                  <p className="line-clamp-1 w-full text-[11px] text-white/50">
                    {person.character}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* "More Like This" Recommendations */}
      {recs.length > 0 && (
        <div className="mt-12">
          <Row title="More Like This" items={recs} />
        </div>
      )}
    </div>
  );
}
