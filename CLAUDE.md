# CLAUDE.md

## Vision

We are building a web app that will also have mobile apps (iOS and Android). AI agents will be integrated into both. The first agent is a **Content Writing Agent** — see [PRD.md](PRD.md) for full product requirements.

## Rules (always follow)

1. **Code quality:** Write high-quality, scalable, well-structured code.
2. **Security:** Keep security in mind at all times — never commit secrets (use `.env` files, keep them in `.gitignore`), validate all user input, call AI APIs only from the server, and apply auth checks and rate limits.
3. **Commits:** Always commit code after each meaningful change, with a clear commit message.
4. **Latest versions:** Always use the latest stable versions of packages and frameworks.
5. **Mobile-friendly:** The web app must be fully responsive and work well on phone screens.
6. **Font:** Use the **Inter** font everywhere.
7. **Border radius:** Use **15px** border radius for UI elements (cards, buttons, inputs, modals).
8. **Explain in Roman Urdu:** The user is a beginner. After every task, explain in simple Roman Urdu what was done and why.

## Tech stack (decided)

- **Web:** Next.js (App Router) + TypeScript
- **Mobile:** React Native with Expo + TypeScript
- **Auth + Database:** Supabase (free tier) — Google + Email login
- **AI (Phase 1):** free-tier cloud LLM API (Google Gemini, with Groq as a fallback), called only from the server
