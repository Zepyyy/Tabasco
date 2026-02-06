# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the React + TypeScript app.
- Entry points: `src/main.tsx`, root UI in `src/App.tsx` and `src/ModernApp.tsx`.
- UI building blocks live in `src/components/` and `src/components/ui/`.
- State and data: `src/contexts/`, `src/providers/`, `src/hooks/`, `src/db/`.
- Shared types/constants: `src/types/`, `src/constants/`.
- Static assets: `src/assets/`. Styling starts in `src/index.css`.

## Build, Test, and Development Commands
- `bun dev` (or `npm run dev`): start Vite dev server with HMR.
- `bun run build` (or `npm run build`): type-check via `tsc -b` and build.
- `bun run preview` (or `npm run preview`): serve the production build locally.
- `bun run lint` (or `npm run lint`): run ESLint on the codebase.
- `bun run biome` (or `npm run biome`): format `src/` with Biome.

## Coding Style & Naming Conventions
- Indentation: tabs (Biome config).
- Strings: double quotes in TS/TSX (Biome config).
- Use the `@` path alias for `src` imports (see `vite.config.ts`/`tsconfig.json`).
- Components are PascalCase (`GuitarTabCreator.tsx`); hooks use `use*` (`useGuitarTab.ts`).

## Testing Guidelines
- No dedicated test framework is configured yet.
- If you add tests, co-locate near source or use `src/**/__tests__` and name files `*.test.ts(x)`.

## Commit & Pull Request Guidelines
- Commit history is free-form (sentence-style messages, often with issue links).
- Use concise, imperative summaries and link relevant issues (e.g. “Fix drag swap #123”).
- PRs should include: what changed, why, and screenshots for UI changes.

## Architecture Notes
- Local data is stored in IndexedDB via Dexie (`src/db/`).
- App-wide providers are centralized in `src/providers/Providers.tsx`.
- For deeper architecture details, see `CLAUDE.md`.
