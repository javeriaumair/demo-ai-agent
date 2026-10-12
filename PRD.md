# Product Requirements Document (PRD)

**Product:** LikhoAI — AI Agents Platform
**First agent:** Content Writing Agent
**Platforms:** Web (Next.js) → Mobile (iOS & Android via Expo)
**Last updated:** 2026-10-13
**Status:** Draft v2

---

## 1. Overview

**LikhoAI** is a web app (later mobile apps too) where users can use AI agents for their daily work. The first agent is a **Content Writing Agent**: the user enters a topic or keyword, and the agent generates a ready-to-publish SEO content package:

1. Article **outline**
2. Full **SEO-optimized article**
3. **Meta title** and **meta description**
4. **FAQ** section

**Budget constraint:** There is no budget for paid APIs right now, so **Phase 1 must run at zero cost** (free-tier services only). Paid APIs come in a later phase.

## 2. Goals

- Help small businesses and bloggers produce good SEO content quickly.
- Support **English, Urdu, and Roman Urdu** output.
- Launch Phase 1 at **$0 monthly cost**.
- Ship a usable product fast (Phase 1A), then add accounts and history (Phase 1B).
- Build a foundation (auth, database, agent architecture) that can host more AI agents later.

### Non-goals (Phase 1)

- Direct publishing to WordPress or other CMSs
- Paid plans or payments
- Mobile apps (planned for Phase 2)
- Image generation

## 3. Target Users

| User | Need |
|---|---|
| **Small businesses** | SEO content for their website to get more traffic, without hiring a writer |
| **Bloggers / freelancers** | Write articles faster for their own blogs or for clients |

**Example persona:** Ali runs a small online clothing store in Lahore. He wants blog posts like "Best summer lawn suits 2026" to bring Google traffic, but has no time or budget for a writer.

## 4. Features — Phase 1 (Free)

Phase 1 is split into two parts:

| | Phase 1A — Generate (no login) | Phase 1B — Accounts & History |
|---|---|---|
| Content form + generation | ✅ | ✅ |
| Edit / copy / download | ✅ | ✅ |
| Login (Google + Email) | — | ✅ |
| Supabase database | — | ✅ |
| History (saved articles) | — | ✅ |
| Regenerate a single section | — | ✅ |
| Daily limit (5 articles) | Per IP / browser | Per user account |

### Phase 1A — Generate, edit, download (no login, no database)

#### 4.1 Content generation form
| Field | Type | Required |
|---|---|---|
| Topic / main keyword | Text | Yes |
| Secondary keywords | Tags / comma-separated | No |
| Language | English / Urdu / Roman Urdu | Yes (default: English) |
| Tone | Formal, Casual, Friendly, Professional, Persuasive | Yes (default: Professional) |
| Length | Short (~600 words), Medium (~1200), Long (~2000) | Yes (default: Medium) |
| Target audience | Text (e.g. "Small shop owners in Pakistan") | No |

#### 4.2 Generated output
- **Outline:** H1, H2, H3 heading structure.
- **Article:** Full article following the outline, using the main and secondary keywords naturally (no keyword stuffing).
- **Meta title:** ≤ 60 characters, includes the main keyword.
- **Meta description:** ≤ 160 characters, includes the main keyword.
- **FAQ:** 5 question–answer pairs related to the topic.
- Output appears progressively (streaming) so the user doesn't wait at a blank screen.
- Urdu output displays correctly right-to-left (RTL).

#### 4.3 Edit, copy & download
- Edit the article inside the app (simple rich-text / Markdown editor).
- **Copy** buttons for each section (article, meta title, meta description, FAQ).
- **Download** as `.md` and `.docx`.
- Since there is no database in 1A, content lives only in the browser session. Show a clear notice: *"Download or copy your article — it is not saved."*

#### 4.4 Daily limit (1A)
- **5 articles per day** per visitor, tracked by IP address (server-side, e.g. in-memory or a free key-value store such as Upstash Redis free tier).
- Show how many generations are left today.
- Friendly message when the limit or the AI provider's free quota is reached.

### Phase 1B — Login, history, Supabase

#### 4.5 Authentication
- Sign up / login with **Google** or **Email** (Supabase Auth).
- Each user has their own private history.

#### 4.6 History
- All generated content is saved automatically to Supabase.
- History page: list with topic, language, and date; open, edit, re-download, or delete.

#### 4.7 Regenerate a single section
- User can regenerate only one part — **outline, article, meta title/description, or FAQ** — without regenerating the whole package.
- Regenerating a section uses the existing content as context so it stays consistent.
- A section regeneration counts as **one generation** toward the daily limit.

#### 4.8 Daily limit (1B)
- **5 articles per day per user account**, stored in Supabase (`usage` table).
- Limit resets daily at midnight (Pakistan time, PKT).

## 5. Technical Approach

### 5.1 Stack
| Layer | Choice | Phase | Cost |
|---|---|---|---|
| Web frontend + backend | Next.js (App Router, latest) + TypeScript | 1A | Free |
| UI | Tailwind CSS, **Inter** font, **15px** border radius, mobile-first | 1A | Free |
| AI | **Google Gemini API free tier** (latest Flash model); **Groq free tier** as fallback | 1A | Free |
| Rate limiting | Upstash Redis free tier (or similar) | 1A | Free |
| Hosting | Vercel (Hobby/free tier) | 1A | Free |
| Auth + Database | Supabase (Postgres + Auth, free tier) | 1B | Free |
| Mobile | React Native + Expo (latest) | 2 | Free |

### 5.2 AI provider abstraction
- All AI calls go through **one server-side module** (e.g. `lib/ai/provider.ts`) with a common interface.
- Switching providers (Gemini → Groq → paid API later) should only require a config/env change, not a rewrite.
- Prompts are stored as versioned templates, separate from code.
- Each section (outline, article, meta, FAQ) has its own prompt, so single-section regeneration in 1B needs no restructuring.

### 5.3 Data model (Phase 1B)
- `profiles` — user id, name, created_at
- `generations` — id, user_id, topic, keywords, language, tone, length, audience, outline, article, meta_title, meta_description, faq (JSON), created_at, updated_at
- `usage` — user_id, date, count

## 6. Security Requirements

- API keys live only in server environment variables — **never** sent to the browser or committed to git.
- All AI calls happen on the server (Next.js route handlers / server actions).
- Validate and sanitize all inputs (e.g. with Zod); limit input length.
- Rate limiting per IP (1A) and per user (1B).
- Sanitize generated HTML/Markdown before rendering (prevent XSS).
- Basic prompt-injection protection: user input is clearly separated from system instructions.
- **1B:** Supabase **Row Level Security (RLS)** — users can only access their own data.
- **Note:** Free-tier AI providers may use submitted data to improve their models. Mention this in the privacy notice and tell users not to enter confidential data.

## 7. Non-Functional Requirements

- **Mobile-friendly:** fully responsive; works well from 360px width upward.
- **Performance:** first content appears within ~3 seconds (streaming).
- **Accessibility:** proper contrast, keyboard navigation, labels on form fields.
- **Scalability:** agent architecture should allow adding new agents without restructuring the app.
- **Code quality:** TypeScript strict mode, linting, formatting, and basic tests for core logic.

## 8. Roadmap

### Phase 1A — Free Web MVP, no login ($0)
Content form, outline/article/meta/FAQ generation, edit/copy/download, 5/day limit per IP, free-tier AI (Gemini + Groq fallback), deployment on Vercel.

### Phase 1B — Accounts & History ($0)
Google + Email login, Supabase database, saved history, single-section regeneration, 5/day limit per user account.

### Phase 2 — Mobile Apps (still free)
- iOS & Android apps with Expo, using the same Supabase backend and API.
- Shared TypeScript types/logic between web and mobile (monorepo).
- *(Publishing to the App Store requires a paid Apple developer account; the Play Store has a one-time fee — plan for this.)*

### Phase 3 — Paid AI & Premium Features (when budget is available)
- Add a paid, higher-quality AI provider (e.g. **Anthropic Claude API**) through the same provider abstraction.
- Higher limits / paid subscription plans (payments integration).
- Direct publishing to WordPress.
- More agents (e.g. social media post agent, email writing agent).
- SEO extras: keyword research, readability score, plagiarism check.

## 9. Success Metrics (Phase 1)

- Users can go from topic → full content package in under 1 minute.
- ≥ 90% of generations complete without error.
- Monthly running cost stays at **$0**.
- At least 20 active users in the first month after the 1B launch.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Free-tier AI quota runs out | 5/day limit, fallback provider (Groq), clear user message |
| IP-based limit in 1A is easy to bypass (VPN, shared IPs) | Accepted for 1A; replaced by per-account limits in 1B |
| Users lose work in 1A (nothing saved) | Clear "not saved" notice; easy copy/download buttons |
| Free-tier terms change | Provider abstraction makes switching easy |
| Lower quality of Urdu / Roman Urdu output | Language-specific prompts; test and tune with real samples |
| Abuse / spam accounts (1B) | Rate limits, daily caps, email verification |
| Vercel Hobby plan is for non-commercial use | Move to a paid or alternative host before charging users (Phase 3) |

## 11. Decisions Log

| Date | Decision |
|---|---|
| 2026-10-13 | App name: **LikhoAI** |
| 2026-10-13 | Phase 1 split into **1A** (no login/database) and **1B** (login, Supabase, history) |
| 2026-10-13 | Daily limit: **5 articles per user** (per IP in 1A, per account in 1B) |
| 2026-10-13 | Single-section regeneration: **yes, in Phase 1B** |
