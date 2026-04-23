import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useLang();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
            {t.brand}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
            {t.home}
          </Link>
          <Link
            to="/browse"
            search={{ cat: "movie" }}
            activeProps={{ className: "text-foreground" }}
            className="hover:text-foreground transition"
          >
            {t.movies}
          </Link>
          <Link
            to="/browse"
            search={{ cat: "tv" }}
            activeProps={{ className: "text-foreground" }}
            className="hover:text-foreground transition"
          >
            {t.tv}
          </Link>
          <Link
            to="/browse"
            search={{ cat: "bollywood" }}
            activeProps={{ className: "text-foreground" }}
            className="hover:text-foreground transition"
          >
            {t.bollywood}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-initial justify-end">
          <Link
            to="/search"
            search={{ q: "" }}
            className="flex items-center gap-2 bg-surface-2 hover:bg-surface px-3 py-2 rounded-full text-sm transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="hidden sm:inline text-muted-foreground">{t.search}</span>
          </Link>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition border border-primary/30"
            title={t.language}
          >
            {lang === "en" ? "हिं" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
