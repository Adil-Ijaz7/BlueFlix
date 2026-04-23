import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { LangProvider } from "@/components/LangProvider";
import { Header } from "@/components/Header";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BlueFlix — Stream movies & shows in English & Hindi" },
      { name: "description", content: "Watch trending movies, TV series, and Bollywood hits with multi-source streaming and Hindi support." },
      { property: "og:title", content: "BlueFlix — Stream movies & shows in English & Hindi" },
      { property: "og:description", content: "Watch trending movies, TV series, and Bollywood hits with multi-source streaming and Hindi support." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "BlueFlix — Stream movies & shows in English & Hindi" },
      { name: "twitter:description", content: "Watch trending movies, TV series, and Bollywood hits with multi-source streaming and Hindi support." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/19e4671a-6aed-4337-9028-f40d719ba2a6/id-preview-a03bf6fa--99c7e198-60f1-4f82-a1ea-e1610aba7d63.lovable.app-1776576916613.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/19e4671a-6aed-4337-9028-f40d719ba2a6/id-preview-a03bf6fa--99c7e198-60f1-4f82-a1ea-e1610aba7d63.lovable.app-1776576916613.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://api.themoviedb.org" },
      { rel: "preconnect", href: "https://image.tmdb.org" },
      { rel: "preconnect", href: "https://cdn.plyr.io" },
      { rel: "dns-prefetch", href: "https://api.themoviedb.org" },
      { rel: "dns-prefetch", href: "https://image.tmdb.org" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://cdn.plyr.io/3.7.8/plyr.css" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LangProvider>
      <div className="min-h-screen pt-16">
        <Header />
        <Outlet />
        <footer className="mt-20 py-8 text-center text-xs text-muted-foreground border-t border-border">
          Powered by TMDB · Streaming via third-party providers
        </footer>
      </div>
    </LangProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}
