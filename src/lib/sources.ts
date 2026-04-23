// Multi-source video embed providers
export type AudioLang = "hi" | "en" | "original";

export interface Source {
  name: string;
  url: (type: "movie" | "tv", id: number, season?: number, episode?: number, audio?: AudioLang) => string;
}

// Append an audio/subtitle language hint where the provider supports it.
// vidsrc.to / vidsrc.xyz accept ?ds_lang=<iso639-1> (default subtitle/audio language).
// "original" → no hint (let the provider use the title's original audio).
const langHint = (url: string, audio?: AudioLang) => {
  if (!audio || audio === "original") return url;
  const code = audio === "hi" ? "hi" : "en";
  return `${url}${url.includes("?") ? "&" : "?"}ds_lang=${code}`;
};

export const SOURCES: Source[] = [
  {
    name: "VidSrc.to",
    url: (t, id, s, e, audio) =>
      langHint(
        t === "movie"
          ? `https://vidsrc.to/embed/movie/${id}`
          : `https://vidsrc.to/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
        audio,
      ),
  },
  {
    name: "VidSrc.xyz",
    url: (t, id, s, e, audio) =>
      langHint(
        t === "movie"
          ? `https://vidsrc.xyz/embed/movie/${id}`
          : `https://vidsrc.xyz/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
        audio,
      ),
  },
  {
    name: "VidSrc.in",
    url: (t, id, s, e, audio) =>
      langHint(
        t === "movie"
          ? `https://vidsrc.in/embed/movie/${id}`
          : `https://vidsrc.in/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
        audio,
      ),
  },
  {
    name: "2Embed",
    url: (t, id, s, e) =>
      t === "movie"
        ? `https://www.2embed.cc/embed/${id}`
        : `https://www.2embed.cc/embedtv/${id}&s=${s ?? 1}&e=${e ?? 1}`,
  },
  {
    name: "MultiEmbed",
    url: (t, id, s, e) =>
      t === "movie"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s ?? 1}&e=${e ?? 1}`,
  },
  {
    name: "Embed.su",
    url: (t, id, s, e) =>
      t === "movie"
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
  },
];
