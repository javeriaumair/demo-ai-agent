# Product Requirements Document (PRD)

**Product:** AI Agents Platform — Agent #1: Content Writing Agent
**Platforms:** Web (Next.js) → Mobile (iOS & Android via Expo)
**Last updated:** 2026-10-13
**Status:** Draft v1

---

## 1. Overview

A web app (later mobile apps too) where users can use AI agents for their daily work. The first agent is a **Content Writing Agent**: the user enters a topic or keyword, and the agent generates a ready-to-publish SEO content package:

1. Article **outline**
2. Full **SEO-optimized article**
3. **Meta title** and **meta description**
4. **FAQ** section

**Budget constraint:** There is no budget for paid APIs right now, so **Phase 1 must run at zero cost** (free-tier services only). Paid APIs come in a later phase.

## 2. Goals

- Help small businesses and bloggers produce good SEO content quickly.
- Support **English, Urdu, and Roman Urdu** output.
- Launch Phase 1 at **$0 monthly cost**.
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

## 4. Features — Phase 1 (Free MVP)

### 4.1 Authentication
- Sign up / login with **Google** or **Email** (Supabase Auth).
- Each user has their own private history.

### 4.2 Content generation form
| Field | Type | Required |
|---|---|---|
| Topic / main keyword | Text | Yes |
| Secondary keywords | Tags / comma-separated | No |
| Language | English / Urdu / Roman Urdu | Yes (default: English) |
| Tone | Formal, Casual, Friendly, Professional, Persuasive | Yes (default: Professional) |
| Length | Short (~600 words), Medium (~1200), Long (~2000) | Yes (default: Medium) |
| Target audience | Text (e.g. "Small shop owners in Pakistan") | No |

### 4.3 Generated output
- **Outline:** H1, H2, H3 heading structure.
- **Article:** Full article following the outline, using the main and secondary keywords naturally (no keyword stuffing).
- **Meta title:** ≤ 60 characters, includes the main keyword.
- **Meta description:** ≤ 160 characters, includes the main keyword.
- **FAQ:** 5 question–answer pairs related to the topic.
- Output appears progressively (streaming) so the user doesn't wait at a blank screen.
- Urdu output displays correctly right-to-left (RTL).

### 4.4 Edit, copy & download
- Edit the article inside the app (simple rich-text / Markdown editor).
- **Copy** buttons for each section (article, meta title, meta description, FAQ).
- **Download** as `.md` and `.docx`.

### 4.5 History
- All generated content is saved automatically.
- History page: list with topic, language, and date; open, edit, re-download, or delete.

### 4.6 Usage limits (to stay within free tier)
- Daily generation limit per user (e.g. **5 articles/day**, configurable).
- Show the user how many generations are left today.
- Friendly message when the limit or the AI provider's free quota is reached.

## 5. Technical Approach

### 5.1 Stack
| Layer | Choice | Cost |
|---|---|---|
| Web frontend + backend | Next.js (App Router, latest) + TypeScript | Free |
| UI | Tailwind CSS, **Inter** font, **15px** border radius, mobile-first | Free |
| Auth + Database | Supabase (Postgres + Auth, free tier) | Free |
| AI (Phase 1) | **Google Gemini API free tier** (latest Flash model); **Groq free tier** as fallback | Free |
| Hosting | Vercel (Hobby/free tier) | Free |
| Mobile (Phase 2) | React Native + Expo (latest) | Free |

### 5.2 AI provider abstraction
- All AI calls go through **one server-side module** (e.g. `lib/ai/provider.ts`) with a common interface.
- Switching providers (Gemini → Groq → paid API later) should only require a config/env change, not a rewrite.
- Prompts are stored as versioned templates, separate from code.

### 5.3 Data model (initial)
- `profiles` — user id, name, created_at
- `generations` — id, user_id, topic, keywords, language, tone, length, audience, outline, article, meta_title, meta_description, faq (JSON), created_at, updated_at
- `usage` — user_id, date, count

## 6. Security Requirements

- API keys live only in server environment variables — **never** sent to the browser or committed to git.
- All AI calls happen on the server (Next.js route handlers / server actions).
- **Row Level Security (RLS)** in Supabase: users can only access their own data.
- Validate and sanitize all inputs (e.g. with Zod); limit input length.
- Rate limiting per user and per IP.
- Sanitize generated HTML/Markdown before rendering (prevent XSS).
- Basic prompt-injection protection: user input is clearly separated from system instructions.
- **Note:** Free-tier AI providers may use submitted data to improve their models. Mention this in the privacy notice and tell users not to enter confidential data.

## 7. Non-Functional Requirements

- **Mobile-friendly:** fully responsive; works well from 360px width upward.
- **Performance:** first content appears within ~3 seconds (streaming).
- **Accessibility:** proper contrast, keyboard navigation, labels on form fields.
- **Scalability:** agent architecture should allow adding new agents without restructuring the app.
- **Code quality:** TypeScript strict mode, linting, formatting, and basic tests for core logic.

## 8. Roadmap

### Phase 1 — Free Web MVP ($0)
Auth, content generation form, outline/article/meta/FAQ output, edit/copy/download, history, daily limits, free-tier AI (Gemini + Groq fallback), deployment on Vercel.

### Phase 2 — Mobile Apps (still free)
- iOS & Android apps with Expo, using the same Supabase backend and API.
- Shared TypeScript types/logic between web and mobile (monorepo).
- *(Publishing to App Store requires a paid Apple developer account; Play Store has a one-time fee — plan for this.)*

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
- At least 20 active users in the first month after launch.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Free-tier AI quota runs out | Per-user daily limits, fallback provider (Groq), clear user message |
| Free-tier terms change | Provider abstraction makes switching easy |
| Lower quality of Urdu / Roman Urdu output | Language-specific prompts; test and tune with real samples |
| Abuse / spam accounts | Login required, rate limits, daily caps |
| Vercel Hobby plan is for non-commercial use | Move to a paid or alternative host before charging users (Phase 3) |

## 11. Open Questions

- Exact daily limit per user (5 is the starting assumption).
- App name and branding.
- Should users be able to regenerate a single section (e.g. only the FAQ)?
