import { NavLink } from "react-router-dom";
import { Home, Film, Tv, Ghost, Flame, Search, Sparkles, Globe } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Sidebar() {
  const { lang, setLang, t } = useLang();

  const navItems = [
    { to: "/", icon: Home, label: t.home, end: true },
    { to: "/browse?cat=movie", icon: Film, label: t.movies },
    { to: "/browse?cat=tv", icon: Tv, label: t.tv },
    { to: "/anime", icon: Ghost, label: t.anime },
    { to: "/browse?cat=bollywood", icon: Flame, label: t.bollywood },
    { to: "/browse?cat=top", icon: Sparkles, label: t.topRated },
    { to: "/search", icon: Search, label: t.search },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 flex w-18 flex-col items-center justify-between border-r border-white/5 bg-[#0d0e14]/90 py-6 backdrop-blur-2xl transition-all max-md:hidden">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <NavLink
          to="/"
          className="group relative flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 hover:scale-110"
          title="BlueFlix"
        >
          <img
            src="/logo.png"
            alt="BlueFlix"
            className="h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] transition duration-300 group-hover:drop-shadow-[0_0_25px_rgba(99,102,241,0.9)]"
          />
        </NavLink>

        {/* Primary Nav Icons */}
        <nav className="flex flex-col items-center gap-2.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white/12 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)] border border-white/15"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />

                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-lg border border-white/10 bg-[#161823] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Language Switcher */}
      <div className="flex flex-col items-center pb-2">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-white/50 transition duration-200 hover:bg-white/10 hover:text-white"
          title={t.language}
          aria-label={t.language}
        >
          <Globe className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow">
            {lang === "en" ? "EN" : "हिं"}
          </span>
          <span className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-lg border border-white/10 bg-[#161823] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
            {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
          </span>
        </button>
      </div>
    </aside>
  );
}
