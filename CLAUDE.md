# CLAUDE.md

## Vision

We are building **LikhoAI**, a web app that will also have mobile apps (iOS and Android). AI agents will be integrated into both. The first agent is a **Content Writing Agent** — see [PRD.md](PRD.md) for full product requirements.

## Rules (always follow)

1. **Code quality:** Write high-quality, scalable, well-structured code.
2. **Security:** Keep security in mind at all times — never commit secrets (use `.env` files, keep them in `.gitignore`), validate all user input, call AI APIs only from the server, and apply auth checks and rate limits.
3. **Commits:** Always commit code after each meaningful change, with a clear commit message.
4. **Latest versions:** Always use the latest stable versions of packages and frameworks.
5. **Mobile-friendly:** The web app must be fully responsive and work well on phone screens, in both light and dark mode.
6. **Font:** Use the **Inter** font everywhere.
7. **Border radius:** Use **15px** border radius for UI elements (cards, buttons, inputs, modals).
8. **Explain in Roman Urdu:** The user is a beginner. After every task, explain in simple Roman Urdu what was done and why.

## Tech stack (decided)

- **Web:** Next.js (App Router) + TypeScript
- **Mobile:** React Native with Expo + TypeScript
- **UI:** Tailwind CSS v4, `lucide-react` icons, original SVG illustrations (no copyrighted images)
- **Auth + Database:** Supabase (free tier) — Google + Facebook + Email login (Phase 1B; Phase 1A has no login or database)
- **AI (Phase 1):** free-tier cloud LLM API (Google Gemini, with Groq as a fallback), called only from the server

## Code conventions

- Next.js 16 has breaking changes vs. older versions — follow [AGENTS.md](AGENTS.md) and check `node_modules/next/dist/docs/` before writing Next.js code.
- Use the `rounded-brand` Tailwind class (15px) and color tokens from `src/app/globals.css` (`bg-surface`, `border-line`, `text-muted`, `bg-accent`, ...) instead of hard-coded values.
- Brand gradient (violet → pink → blue): `bg-brand-gradient` / `text-brand-gradient`. Shared field/button classes are in `src/lib/ui.ts`.
- Dark mode uses `data-theme` on `<html>` (set before paint in `src/app/layout.tsx`); style with `dark:` utilities or the CSS tokens.
- Folders: `src/app/(marketing)` (landing, blog), `src/app/login`, `src/app/signup`, `src/app/dashboard`; components in `src/components/{landing,auth,dashboard,ui,illustrations,icons}`.
- AI: `src/app/api/generate/route.ts` (validation, origin check, daily limit via `src/lib/rate-limit.ts` — Upstash Redis with in-memory fallback) → `src/lib/ai/` (`index.ts` entry point, `gemini.ts`, `prompts.ts`). Server-only modules start with `import "server-only"`. Request/response schemas: `src/lib/article-schema.ts`.
- Secrets go in `.env.local` (git-ignored); document new variables in `.env.example`.
- Landing page copy lives in `src/lib/site-content.ts`; article form options in `src/lib/article-options.ts`.
