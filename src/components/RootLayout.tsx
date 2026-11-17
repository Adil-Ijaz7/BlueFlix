import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";

export function RootLayout() {
  return (
    <div className="relative min-h-screen bg-[#0b0c10] text-[#f1f2f6]">
      {/* Ambient background glow (like the purple aura in screenshot) */}
      <div className="ambient-glow" />

      {/* Desktop Left Vertical Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-screen flex-col md:pl-18">
        <TopBar />
        <main className="flex-1 pb-20 md:pb-12">
          <Outlet />
        </main>
        <footer className="mt-auto border-t border-white/5 py-8 text-center text-xs text-white/35">
          Powered by TMDB API · Streaming via third-party providers
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
