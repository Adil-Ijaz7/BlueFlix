import { NavLink } from "react-router-dom";
import { Home, Film, Tv, Ghost, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function MobileNav() {
  const { t } = useLang();

  const navItems = [
    { to: "/", icon: Home, label: t.home, end: true },
    { to: "/browse?cat=movie", icon: Film, label: t.movies },
    { to: "/browse?cat=tv", icon: Tv, label: t.tv },
    { to: "/anime", icon: Ghost, label: "Anime" },
    { to: "/search", icon: Search, label: t.search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-[#0d0e14]/95 px-3 backdrop-blur-2xl md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-indigo-400 font-bold" : "text-white/40 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
