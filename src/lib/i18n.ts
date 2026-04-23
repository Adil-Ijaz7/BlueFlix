import { createContext, useContext } from "react";
import type { Lang } from "./tmdb";

export type T = Record<
  | "brand" | "home" | "movies" | "tv" | "bollywood" | "search" | "play" | "moreInfo"
  | "trending" | "popularMovies" | "popularTV" | "topRated" | "bollywoodMovies" | "hindiSeries"
  | "recommended" | "overview" | "rating" | "year" | "runtime" | "season" | "episode"
  | "source" | "trailer" | "noResults" | "searching" | "close" | "language"
  | "filters" | "genre" | "anyGenre" | "anyYear" | "minRating" | "any" | "clearFilters"
  | "hindiDubbedMovies" | "hindiDubbedTV"
  | "audio" | "audioHindi" | "audioEnglish" | "audioOriginal",
  string
>;

export const dict: { en: T; hi: T } = {
  en: {
    brand: "BlueFlix",
    home: "Home",
    movies: "Movies",
    tv: "TV Shows",
    bollywood: "Bollywood",
    search: "Search movies, shows...",
    play: "▶ Play",
    moreInfo: "More Info",
    trending: "Trending Now",
    popularMovies: "Popular Movies",
    popularTV: "Popular TV Shows",
    topRated: "Top Rated",
    bollywoodMovies: "Bollywood Hits",
    hindiSeries: "Hindi Web Series",
    recommended: "Recommended",
    overview: "Overview",
    rating: "Rating",
    year: "Year",
    runtime: "Runtime",
    season: "Season",
    episode: "Episode",
    source: "Source",
    trailer: "Trailer",
    noResults: "No results found",
    searching: "Searching...",
    close: "Close",
    language: "Language",
    filters: "Filters",
    genre: "Genre",
    anyGenre: "All genres",
    anyYear: "All years",
    minRating: "Min rating",
    any: "Any",
    clearFilters: "Clear filters",
    hindiDubbedMovies: "Hollywood Movies (Hindi Dub)",
    hindiDubbedTV: "Hollywood Series (Hindi Dub)",
    audio: "Audio",
    audioHindi: "Hindi",
    audioEnglish: "English",
    audioOriginal: "Original",
  },
  hi: {
    brand: "BlueFlix",
    home: "होम",
    movies: "फ़िल्में",
    tv: "टीवी शोज़",
    bollywood: "बॉलीवुड",
    search: "फ़िल्में, शोज़ खोजें...",
    play: "▶ चलाएँ",
    moreInfo: "और जानकारी",
    trending: "अभी ट्रेंडिंग",
    popularMovies: "लोकप्रिय फ़िल्में",
    popularTV: "लोकप्रिय टीवी शोज़",
    topRated: "सर्वोच्च रेटेड",
    bollywoodMovies: "बॉलीवुड हिट्स",
    hindiSeries: "हिंदी वेब सीरीज़",
    recommended: "अनुशंसित",
    overview: "विवरण",
    rating: "रेटिंग",
    year: "साल",
    runtime: "अवधि",
    season: "सीज़न",
    episode: "एपिसोड",
    source: "स्रोत",
    trailer: "ट्रेलर",
    noResults: "कोई परिणाम नहीं मिला",
    searching: "खोज रहे हैं...",
    close: "बंद करें",
    language: "भाषा",
    filters: "फ़िल्टर",
    genre: "शैली",
    anyGenre: "सभी शैलियाँ",
    anyYear: "सभी वर्ष",
    minRating: "न्यूनतम रेटिंग",
    any: "कोई भी",
    clearFilters: "फ़िल्टर साफ़ करें",
    hindiDubbedMovies: "हॉलीवुड फ़िल्में (हिंदी डब)",
    hindiDubbedTV: "हॉलीवुड सीरीज़ (हिंदी डब)",
    audio: "ऑडियो",
    audioHindi: "हिंदी",
    audioEnglish: "अंग्रेज़ी",
    audioOriginal: "मूल",
  },
};

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: T }>({
  lang: "en",
  setLang: () => {},
  t: dict.en,
});

export const useLang = () => useContext(LangContext);
