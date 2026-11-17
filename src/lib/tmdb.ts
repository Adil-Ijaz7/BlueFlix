// TMDB API client
export const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || "1f54bd990f1cdfb230adb312546d765d";
export const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
export const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

export const IMG = (
  path: string | null,
  size: "w300" | "w500" | "w780" | "w1280" | "original" = "w500",
) => (path ? `${IMG_BASE}/${size}${path}` : "");

export type Lang = "en" | "hi";

export interface Media {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  original_language?: string;
  genre_ids?: number[];
}

export interface MediaDetails extends Media {
  runtime?: number;
  genres: { id: number; name: string }[];
  number_of_seasons?: number;
  seasons?: { season_number: number; episode_count: number; name: string }[];
  videos?: { results: { key: string; site: string; type: string; name: string }[] };
  tagline?: string;
}

const cache = new Map<string, { t: number; data: unknown }>();
const TTL = 5 * 60 * 1000;

async function tmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const usp = new URLSearchParams({
    api_key: TMDB_KEY,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${TMDB_BASE}${path}?${usp.toString()}`;
  const c = cache.get(url);
  if (c && Date.now() - c.t < TTL) return c.data as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = (await res.json()) as T;
  cache.set(url, { t: Date.now(), data });
  return data;
}

const langParam = (l: Lang) => (l === "hi" ? "hi-IN" : "en-US");

export const api = {
  trending: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/trending/all/day", { language: langParam(lang) }).then(
      (r) => r.results,
    ),
  popularMovies: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/movie/popular", {
      language: langParam(lang),
      region: lang === "hi" ? "IN" : "US",
    }).then((r) => r.results),
  popularTV: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/tv/popular", { language: langParam(lang) }).then((r) => r.results),
  topRated: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/movie/top_rated", { language: langParam(lang) }).then(
      (r) => r.results,
    ),
  // Hindi/Bollywood discovery
  bollywood: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/discover/movie", {
      language: langParam(lang),
      with_original_language: "hi",
      sort_by: "popularity.desc",
      region: "IN",
    }).then((r) => r.results),
  hindiTV: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/discover/tv", {
      language: langParam(lang),
      with_original_language: "hi",
      sort_by: "popularity.desc",
    }).then((r) => r.results),
  // Hollywood movies popular in India (proxy for Hindi-dubbed availability)
  hindiDubbedMovies: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/discover/movie", {
      language: langParam(lang),
      with_original_language: "en",
      region: "IN",
      sort_by: "popularity.desc",
      "vote_count.gte": 200,
    }).then((r) => r.results),
  hindiDubbedTV: (lang: Lang) =>
    tmdb<{ results: Media[] }>("/discover/tv", {
      language: langParam(lang),
      with_original_language: "en",
      sort_by: "popularity.desc",
      "vote_count.gte": 200,
      watch_region: "IN",
    }).then((r) => r.results),
  search: (q: string, lang: Lang) =>
    tmdb<{ results: Media[] }>("/search/multi", {
      query: q,
      language: langParam(lang),
      include_adult: "false",
    }).then((r) => r.results.filter((x) => x.media_type === "movie" || x.media_type === "tv")),
  details: (type: "movie" | "tv", id: number, lang: Lang) =>
    tmdb<MediaDetails>(`/${type}/${id}`, {
      language: langParam(lang),
      append_to_response: "videos",
    }),
  recommendations: (type: "movie" | "tv", id: number, lang: Lang) =>
    tmdb<{ results: Media[] }>(`/${type}/${id}/recommendations`, {
      language: langParam(lang),
    }).then((r) => r.results),
  genres: (type: "movie" | "tv", lang: Lang) =>
    tmdb<{ genres: { id: number; name: string }[] }>(`/genre/${type}/list`, {
      language: langParam(lang),
    }).then((r) => r.genres),
  discover: (
    type: "movie" | "tv",
    lang: Lang,
    opts: {
      genreId?: number;
      year?: number;
      minRating?: number;
      originalLanguage?: string;
      region?: string;
    } = {},
  ) => {
    const params: Record<string, string | number> = {
      language: langParam(lang),
      sort_by: "popularity.desc",
      include_adult: "false",
    };
    if (opts.genreId) params.with_genres = opts.genreId;
    if (opts.minRating) params["vote_average.gte"] = opts.minRating;
    if (opts.originalLanguage) params.with_original_language = opts.originalLanguage;
    if (opts.region) params.region = opts.region;
    if (opts.year) {
      if (type === "movie") params.primary_release_year = opts.year;
      else params.first_air_date_year = opts.year;
    }
    return tmdb<{ results: Media[] }>(`/discover/${type}`, params).then((r) => r.results);
  },
};

export const getTitle = (m: Media) =>
  m.title || m.name || m.original_title || m.original_name || "Untitled";
export const getYear = (m: Media) => {
  const d = m.release_date || m.first_air_date;
  return d ? d.slice(0, 4) : "";
};
export const getType = (m: Media): "movie" | "tv" =>
  (m.media_type as "movie" | "tv") || (m.first_air_date ? "tv" : "movie");
