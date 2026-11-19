// TMDB API client
export const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || "1f54bd990f1cdfb230adb312546d765d";
export const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
export const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

export const IMG = (path, size = "w500") => (path ? `${IMG_BASE}/${size}${path}` : "");

const cache = new Map();
const TTL = 5 * 60 * 1000;

async function tmdb(path, params = {}) {
  const usp = new URLSearchParams({
    api_key: TMDB_KEY,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${TMDB_BASE}${path}?${usp.toString()}`;
  const c = cache.get(url);
  if (c && Date.now() - c.t < TTL) return c.data;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  cache.set(url, { t: Date.now(), data });
  return data;
}

const langParam = (l) => (l === "hi" ? "hi-IN" : "en-US");

export const api = {
  trending: (lang) =>
    tmdb("/trending/all/day", { language: langParam(lang) }).then((r) => r.results),
  popularMovies: (lang) =>
    tmdb("/movie/popular", {
      language: langParam(lang),
      region: lang === "hi" ? "IN" : "US",
    }).then((r) => r.results),
  popularTV: (lang) => tmdb("/tv/popular", { language: langParam(lang) }).then((r) => r.results),
  topRated: (lang) =>
    tmdb("/movie/top_rated", { language: langParam(lang) }).then((r) => r.results),
  // Hindi/Bollywood discovery
  bollywood: (lang) =>
    tmdb("/discover/movie", {
      language: langParam(lang),
      with_original_language: "hi",
      sort_by: "popularity.desc",
      region: "IN",
    }).then((r) => r.results),
  hindiTV: (lang) =>
    tmdb("/discover/tv", {
      language: langParam(lang),
      with_original_language: "hi",
      sort_by: "popularity.desc",
    }).then((r) => r.results),
  // Hollywood movies popular in India (proxy for Hindi-dubbed availability)
  hindiDubbedMovies: (lang) =>
    tmdb("/discover/movie", {
      language: langParam(lang),
      with_original_language: "en",
      region: "IN",
      sort_by: "popularity.desc",
      "vote_count.gte": 200,
    }).then((r) => r.results),
  hindiDubbedTV: (lang) =>
    tmdb("/discover/tv", {
      language: langParam(lang),
      with_original_language: "en",
      sort_by: "popularity.desc",
      "vote_count.gte": 200,
      watch_region: "IN",
    }).then((r) => r.results),
  search: (q, lang) =>
    tmdb("/search/multi", {
      query: q,
      language: langParam(lang),
      include_adult: "false",
    }).then((r) => r.results.filter((x) => x.media_type === "movie" || x.media_type === "tv")),
  details: (type, id, lang) =>
    tmdb(`/${type}/${id}`, {
      language: langParam(lang),
      append_to_response: "videos,credits",
    }),
  recommendations: (type, id, lang) =>
    tmdb(`/${type}/${id}/recommendations`, {
      language: langParam(lang),
    }).then((r) => r.results),
  genres: (type, lang) =>
    tmdb(`/genre/${type}/list`, {
      language: langParam(lang),
    }).then((r) => r.genres),
  discover: (type, lang, opts = {}) => {
    const params = {
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
    return tmdb(`/discover/${type}`, params).then((r) => r.results);
  },
};

export const getTitle = (m) =>
  m.title || m.name || m.original_title || m.original_name || "Untitled";
export const getYear = (m) => {
  const d = m.release_date || m.first_air_date;
  return d ? d.slice(0, 4) : "";
};
export const getType = (m) => m.media_type || (m.first_air_date ? "tv" : "movie");
