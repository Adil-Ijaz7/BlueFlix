import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, IMG, getTitle, getYear, type MediaDetails, type Media } from "@/lib/tmdb";
import { useLang } from "@/lib/i18n";
import { SOURCES, type AudioLang } from "@/lib/sources";
import { Row } from "@/components/Row";

export const Route = createFileRoute("/watch/$type/$id")({
  component: Watch,
});

function Watch() {
  const { type, id } = Route.useParams();
  const mediaType = (type === "tv" ? "tv" : "movie") as "movie" | "tv";
  const tmdbId = Number(id);
  const { lang, t } = useLang();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [recs, setRecs] = useState<Media[]>([]);
  const [sourceIdx, setSourceIdx] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);
  const [audio, setAudio] = useState<AudioLang>(lang === "hi" ? "hi" : "original");

  useEffect(() => {
    setAudio(lang === "hi" ? "hi" : "original");
  }, [lang]);

  useEffect(() => {
    setDetails(null);
    setSeason(1);
    setEpisode(1);
    setShowTrailer(false);
    api.details(mediaType, tmdbId, lang).then(setDetails).catch(() => setDetails(null));
    api.recommendations(mediaType, tmdbId, lang).then(setRecs).catch(() => setRecs([]));
  }, [mediaType, tmdbId, lang]);

  if (!details) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const trailer = details.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer")
    || details.videos?.results.find((v) => v.site === "YouTube");

  const src = showTrailer && trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : SOURCES[sourceIdx].url(mediaType, tmdbId, season, episode, audio);

  const seasons = details.seasons?.filter((s) => s.season_number > 0) ?? [];
  const currentSeason = seasons.find((s) => s.season_number === season);
  const episodes = currentSeason ? Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1) : [];

  return (
    <div className="pb-12">
      <div className="relative w-full bg-black aspect-video max-h-[80vh]">
        <iframe
          key={src}
          src={src}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
          className="w-full h-full border-0"
          title={getTitle(details)}
        />
      </div>

      {/* Source switcher */}
      <div className="px-4 md:px-8 py-4 flex flex-wrap items-center gap-2 border-b border-border">
        <span className="text-xs uppercase text-muted-foreground mr-2">{t.source}:</span>
        {SOURCES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => { setSourceIdx(i); setShowTrailer(false); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              !showTrailer && sourceIdx === i
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "bg-surface-2 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.name}
          </button>
        ))}
        {trailer && (
          <button
            onClick={() => setShowTrailer(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              showTrailer ? "bg-red-600 text-white" : "bg-surface-2 text-muted-foreground hover:text-foreground"
            }`}
          >
            ▶ {t.trailer}
          </button>
        )}
      </div>

      {/* Audio language selector */}
      {!showTrailer && (
        <div className="px-4 md:px-8 py-3 flex flex-wrap items-center gap-2 border-b border-border">
          <span className="text-xs uppercase text-muted-foreground mr-2">{t.audio}:</span>
          {([
            { key: "hi" as const, label: t.audioHindi },
            { key: "en" as const, label: t.audioEnglish },
            { key: "original" as const, label: t.audioOriginal },
          ]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setAudio(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                audio === opt.key
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
          {audio !== "original" && SOURCES[sourceIdx].name !== "VidSrc.to" && SOURCES[sourceIdx].name !== "VidSrc.xyz" && (
            <span className="text-[10px] text-muted-foreground ml-2">
              ⚠ Hint not supported by this source — try VidSrc.to / VidSrc.xyz
            </span>
          )}
        </div>
      )}

      {/* TV episode selector */}
      {mediaType === "tv" && seasons.length > 0 && (
        <div className="px-4 md:px-8 py-4 flex flex-wrap items-center gap-3 border-b border-border">
          <div>
            <label className="block text-xs uppercase text-muted-foreground mb-1">{t.season}</label>
            <select
              value={season}
              onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
              className="bg-surface-2 text-foreground rounded px-3 py-2 border border-border"
            >
              {seasons.map((s) => (
                <option key={s.season_number} value={s.season_number}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs uppercase text-muted-foreground mb-1">{t.episode}</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {episodes.map((ep) => (
                <button
                  key={ep}
                  onClick={() => setEpisode(ep)}
                  className={`min-w-[40px] px-2 py-1 rounded text-xs font-bold transition ${
                    episode === ep
                      ? "gradient-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="px-4 md:px-8 py-8 grid md:grid-cols-[200px_1fr] gap-6 max-w-6xl">
        {details.poster_path && (
          <img
            src={IMG(details.poster_path, "w300")}
            alt={getTitle(details)}
            className="rounded-lg shadow-card w-full max-w-[200px]"
          />
        )}
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{getTitle(details)}</h1>
          {details.tagline && <p className="text-muted-foreground italic mt-1">{details.tagline}</p>}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {details.vote_average > 0 && (
              <span><span className="text-muted-foreground">{t.rating}: </span><span className="text-primary font-bold">★ {details.vote_average.toFixed(1)}</span></span>
            )}
            <span><span className="text-muted-foreground">{t.year}: </span>{getYear(details)}</span>
            {details.runtime && <span><span className="text-muted-foreground">{t.runtime}: </span>{details.runtime}m</span>}
          </div>
          {details.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {details.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 text-xs bg-surface-2 rounded-full">{g.name}</span>
              ))}
            </div>
          )}
          <h2 className="text-lg font-bold mt-6 mb-2">{t.overview}</h2>
          <p className="text-foreground/90 leading-relaxed">{details.overview}</p>
        </div>
      </div>

      {recs.length > 0 && <Row title={t.recommended} items={recs} />}
    </div>
  );
}
