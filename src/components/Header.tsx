import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useLang();
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="gradient-primary shadow-glow h-2.5 w-2.5 rounded-full" aria-hidden />
          <span className="font-display text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
            Max{t.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
          <Link to="/" activeProps={{ className: "text-foreground" }} className="transition hover:text-foreground/90">
            {t.home}
          </Link>
          <Link
            to="/browse"
            search={{ cat: "movie" }}
            activeProps={{ className: "text-foreground" }}
            className="transition hover:text-foreground/90"
          >
            {t.movies}
          </Link>
          <Link
            to="/browse"
            search={{ cat: "tv" }}
            activeProps={{ className: "text-foreground" }}
            className="transition hover:text-foreground/90"
          >
            {t.tv}
          </Link>
          <Link
            to="/browse"
            search={{ cat: "bollywood" }}
            activeProps={{ className: "text-foreground" }}
            className="transition hover:text-foreground/90"
          >
            {t.bollywood}
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 md:flex-initial md:gap-3">
          <Link
            to="/search"
            search={{ q: "" }}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:bg-surface-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="hidden sm:inline text-muted-foreground">{t.search}</span>
          </Link>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-surface"
            title={t.language}
          >
            {lang === "en" ? "हिं" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
