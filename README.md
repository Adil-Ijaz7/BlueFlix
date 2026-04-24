# BlueFlix — Hindi-Flix-Maker

A Netflix-style streaming web app focused on Hindi/Bollywood content, built with TanStack Start and powered by the TMDB API. Browse trending movies and TV shows, discover Bollywood hits and Hindi web series, watch via multiple embedded streaming sources, and switch between an English and Hindi UI — all in one place.

---

## ✨ Features

- **Home page** — curated rows for Trending, Bollywood Hits, Hindi-Dubbed Movies, Popular Movies, Hindi Web Series, Hindi-Dubbed TV, Popular TV Shows, and Top Rated.
- **Browse** — filter content by category (Movies, TV, Bollywood, Hindi TV, Top Rated) and narrow down by genre, release year, or minimum TMDB rating.
- **Search** — debounced global search across movies and TV shows.
- **Watch page** — inline player with five switchable streaming sources:
  - VidSrc.to · VidSrc.xyz · 2Embed · MultiEmbed · Embed.su
- **Audio language selector** — request Hindi, English, or original-language audio where the source supports it.
- **TV season & episode picker** — navigate any season and episode for TV series.
- **YouTube trailer** — watch the official trailer directly in the player.
- **Bilingual UI** — toggle between English and Hindi (हिंदी) at any time.
- **Recommendations** — related titles shown below every watch page.
- **Cloudflare Workers deployment** — production build targets the Cloudflare edge runtime.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React SSR) |
| Bundler | [Vite](https://vite.dev) v7 + `@lovable.dev/vite-tanstack-config` |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data fetching | [TanStack Query](https://tanstack.com/query) v5 + direct TMDB API |
| Language | TypeScript (strict) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| UI components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives + Lucide icons) |
| Forms | react-hook-form + Zod |
| Data source | [TMDB API](https://developer.themoviedb.org) |
| Deployment | [Cloudflare Workers](https://workers.cloudflare.com) via Wrangler |
| Package manager | [Bun](https://bun.sh) (npm also works) |

---

## 📋 Prerequisites

| Requirement | Version |
|---|---|
| [Node.js](https://nodejs.org) | 18+ (LTS recommended) |
| [Bun](https://bun.sh) | 1.x (recommended) **or** npm 9+ |
| TMDB API key | See [Environment Variables](#-environment-variables) |

> **Note:** A TMDB API key is bundled in the source for quick evaluation. For production use you should replace it with your own key (see below).

---

## ⚙️ Environment Variables

The app uses a single external API key — the TMDB key. By default it is hard-coded in `src/lib/tmdb.ts` for immediate out-of-the-box use.

For production deployments (especially on Cloudflare Workers) you should move the key to an environment variable. Cloudflare Workers reads secrets from `.dev.vars` locally and from the Cloudflare dashboard in production.

Create a `.dev.vars` file in the repository root (it is already git-ignored):

```ini
# .dev.vars  — Cloudflare Workers local secrets (never commit this file)
TMDB_API_KEY=your_tmdb_api_key_here
```

Then update `src/lib/tmdb.ts` to read the key from the environment:

```ts
// Replace the hard-coded key with:
export const TMDB_KEY = import.meta.env.VITE_TMDB_KEY ?? "1f54bd990f1cdfb230adb312546d765d";
```

And expose it in `vite.config.ts` (or via a `VITE_TMDB_KEY` entry in a `.env.local` file):

```ini
# .env.local  — Vite local overrides (never commit this file)
VITE_TMDB_KEY=your_tmdb_api_key_here
```

| Variable | Description | Required |
|---|---|---|
| `VITE_TMDB_KEY` | Your [TMDB API v3 read key](https://www.themoviedb.org/settings/api). Without it the app falls back to the bundled demo key. | Optional |

---

## 🚀 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Adil-Ijaz7/hindi-flix-maker.git
cd hindi-flix-maker
```

### 2. Install dependencies

**Using Bun (recommended):**

```bash
bun install
```

**Using npm:**

```bash
npm install
```

### 3. (Optional) Configure environment variables

If you want to use your own TMDB key, create a `.env.local` file:

```bash
cp /dev/null .env.local
echo "VITE_TMDB_KEY=your_tmdb_api_key_here" >> .env.local
```

The app works out-of-the-box without this step.

### 4. Start the development server

```bash
bun run dev
# or
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)**.

> If port 5173 is already in use Vite will automatically try the next available port and print the actual URL in the terminal.

---

## 🏗 Build & Production

### Build for production

```bash
bun run build
# or
npm run build
```

The output is placed in the `dist/` directory, ready for deployment to Cloudflare Workers.

### Preview the production build locally

```bash
bun run preview
# or
npm run preview
```

### Build in development mode (with source maps, no minification)

```bash
bun run build:dev
# or
npm run build:dev
```

### Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

Make sure you are authenticated (`npx wrangler login`) and that `wrangler.jsonc` reflects your account/project settings.

---

## 🔍 Code Quality

### Lint

```bash
bun run lint
# or
npm run lint
```

### Format (Prettier)

```bash
bun run format
# or
npm run format
```

> There are no automated tests in this project at this time.

---

## 📂 Project Structure

```
hindi-flix-maker/
├── src/
│   ├── routes/               # File-based routes (TanStack Router)
│   │   ├── __root.tsx        # Root layout (HTML shell, header, footer)
│   │   ├── index.tsx         # Home page — curated content rows
│   │   ├── browse.tsx        # Browse page — category + genre/year/rating filters
│   │   ├── search.tsx        # Search page
│   │   └── watch.$type.$id.tsx  # Watch page — video player, episode picker
│   ├── components/
│   │   ├── Header.tsx        # Top navigation bar + language toggle
│   │   ├── Hero.tsx          # Featured hero banner
│   │   ├── Row.tsx           # Horizontal scrollable content row
│   │   ├── PosterCard.tsx    # Poster thumbnail card
│   │   ├── LangProvider.tsx  # Language context provider
│   │   └── ui/               # shadcn/ui component library
│   ├── lib/
│   │   ├── tmdb.ts           # TMDB API client and type definitions
│   │   ├── sources.ts        # Video streaming source definitions
│   │   ├── i18n.ts           # English / Hindi translation strings
│   │   └── utils.ts          # Shared utilities (cn helper etc.)
│   ├── hooks/
│   │   └── use-mobile.tsx    # Responsive mobile detection hook
│   ├── router.tsx            # TanStack Router instance
│   ├── routeTree.gen.ts      # Auto-generated route tree (do not edit)
│   └── styles.css            # Global Tailwind CSS styles
├── vite.config.ts            # Vite configuration (via lovable preset)
├── wrangler.jsonc            # Cloudflare Workers deployment config
├── components.json           # shadcn/ui configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint flat config
├── .prettierrc               # Prettier formatting rules
└── package.json              # Project metadata and scripts
```

---

## 🛠 Troubleshooting

### `Error: TMDB 401` or blank content rows

The TMDB API key is invalid or has been revoked. Generate a new free key at <https://www.themoviedb.org/settings/api> and set `VITE_TMDB_KEY` in your `.env.local`.

### Port 5173 is already in use

Vite auto-increments to the next free port (5174, 5175, …) and prints the URL in the terminal. Alternatively, specify a port explicitly:

```bash
bun run dev -- --port 4000
```

### `bun: command not found`

Install Bun from <https://bun.sh>, or use `npm install` / `npm run dev` instead — npm works equally well.

### `wrangler` deploy fails with "No account ID"

Log in to Cloudflare first:

```bash
npx wrangler login
```

Then verify your account ID is set in `wrangler.jsonc` under `"account_id"`.

### Streaming player shows a blank/grey screen

Some embed sources may be blocked by your browser or network. Try switching to a different source using the **Source** buttons below the player. VidSrc.to and VidSrc.xyz tend to be the most reliable.

### `routeTree.gen.ts` is out of date

This file is auto-generated by the TanStack Router Vite plugin on every dev/build run. If you see type errors related to routes, restart the dev server:

```bash
bun run dev
```

---

## 📄 License

No license specified.
