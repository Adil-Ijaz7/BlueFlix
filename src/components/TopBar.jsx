import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, ChevronLeft } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function TopBar() {
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-between px-5 md:px-10 pointer-events-none">
      {/* Mobile brand / Left quick buttons */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white md:hidden"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="BlueFlix" className="h-8 w-8 object-contain drop-shadow" />
          <span className="font-cinematic font-bold tracking-wide text-white">BlueFlix</span>
        </Link>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <Link
          to="/search"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 shadow-lg backdrop-blur-xl transition hover:bg-white/15 hover:text-white hover:scale-105"
          title={t.search}
          aria-label={t.search}
        >
          <Search className="h-4 w-4" />
        </Link>

        <Link
          to="/browse"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 shadow-lg backdrop-blur-xl transition hover:bg-white/15 hover:text-white hover:scale-105"
          title="Browse All"
          aria-label="Browse All"
        >
          <Plus className="h-4 w-4" />
        </Link>

        {/* Mobile Language Switcher */}
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="flex h-10 px-3 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xs font-bold text-white/90 shadow-lg backdrop-blur-xl transition hover:bg-white/15 md:hidden"
        >
          {lang === "en" ? "हिं" : "EN"}
        </button>
      </div>
    </header>
  );
}
