# Project System Brain

## 1. Core Purpose & Value Proposition
- **Problem Solved:** Website owners struggle with low conversion rates but lack the expertise to identify specific UI, UX, or copy issues. UXAuditX provides an automated, AI-driven, 12-point Conversion Rate Optimization (CRO) audit in under 60 seconds.
- **Intended User:** Website owners, marketers, founders, and growth professionals looking for actionable, brutally honest feedback to increase their landing page conversions.

## 2. System Architecture & Tech Stack
- **High-level Architectural Pattern:** Monolithic full-stack web application with serverless API routes, functioning as an orchestration layer for headless browser scraping and parallelized AI evaluation.
- **Hosting:** Railway.app (Docker container using `mcr.microsoft.com/playwright:v1.60.0-jammy`). **NOT Vercel** — moved away due to Serverless size/timeout limits.
- **Tech Stack:**
  - **Framework:** Next.js 16.2.6 (App Router), React 19
  - **Styling:** Tailwind CSS 4, shadcn/ui, lucide-react (icons)
  - **Database:** Supabase (PostgreSQL) for storing leads, scans, and audit results.
  - **Auth:** Supabase Auth (Email/Password) with `@supabase/ssr` for Next.js App Router cookie-based sessions.
  - **AI Layer:** Multiple providers (Anthropic Claude, Google Gemini, OpenAI) via Vercel AI SDK.
  - **Scraping:** `playwright` (standard package) with Chromium. Local: playwright installs its own Chromium. Production (Railway): Playwright image has Chromium pre-installed.
  - **Rate Limiting:** Upstash Redis with `@upstash/ratelimit`.
  - **Exporting:** `html2canvas` and `jspdf` for generating downloadable PDF reports on the client side.
- **Data Flow Overview:**
  1. User submits a URL on the homepage (`/`). If already logged in, they are redirected to `/dashboard`.
  2. The frontend POSTs to `/api/audit` with URL + name + email (anonymous defaults if not provided).
  3. The API validates input (Zod), checks rate limit (Upstash Redis), checks auth session, and saves the lead to Supabase `audits` table including `user_id` if authenticated.
  4. The scraper launches headless Chromium, takes desktop/mobile screenshots, and extracts DOM data using Cheerio (`src/lib/scraper.ts`).
  5. Screenshots + extracted context are fed to the AI provider (`src/lib/claude.ts`) which runs 12 CRO parameters in parallel batches of 3.
  6. ALL 12 results are saved to the `audits.results` JSON column. The API redirects the client to `/results/[id]`.
  7. The results page (`/results/[id]/page.tsx`) reads auth session server-side. **Unauthenticated users see 4 free issues** + a locked/blurred section with signup CTA. **Authenticated users see all 12 issues**.
  8. After signing up or logging in (redirected with `?redirect=/results/[id]`), users land back on the full report.
  9. Logged-in users can visit `/dashboard` to see all their past audits.

## 3. Authentication Architecture
- **Provider:** Supabase Auth (Email/Password). Email confirmation is configurable in Supabase Dashboard.
- **Session Management:** `@supabase/ssr` with cookie-based sessions via root `middleware.ts` that calls `updateSession()` on every request.
- **Supabase Utilities:**
  - `src/utils/supabase/server.ts` — SSR client (for Server Components, Server Actions, Route Handlers)
  - `src/utils/supabase/client.ts` — Browser client (for Client Components)
  - `src/utils/supabase/middleware.ts` — Session refresher for root middleware
- **Server Actions:** `src/app/auth/actions.ts` — signIn, signUp, signOut, forgotPassword, resetPassword
- **Auth Callback:** `src/app/auth/callback/route.ts` — exchanges email verification codes for sessions
- **Auth Pages:** `/login`, `/signup`, `/forgot-password`, `/reset-password`
- **Report Gating:** Server-side check in `/results/[id]/page.tsx`. 4 free previews (`isFreePreview: true`) shown to all. Full 12 shown only to authenticated users.
- **Dashboard:** `/dashboard` — protected, shows all audits linked to user by `user_id` OR `email`.

## 4. Database Schema (Supabase)
- **`audits` table** (primary table — all data lives here):
  - `id` (UUID PK), `url`, `url_domain`, `name`, `email`, `user_id` (FK → auth.users), `ip_address`, `user_agent`, `referrer`, `utm_source/medium/campaign`
  - `ai_provider`, `ai_model`, `status` (scraping/analyzing/complete/failed)
  - `overall_score` (int), `summary` (text), `results` (JSONB — all 12 ParamResult objects), `free_results` (JSONB — 4 free ones)
  - `scraped_title`, `scraped_h1`, `scraped_word_count`, `scraped_has_https`, `scrape_error`
  - Timestamps: `scrape_started_at`, `scrape_done_at`, `analysis_started_at`, `analysis_done_at`, `created_at`
  - RLS enabled: service_role can do all; authenticated users can SELECT their own rows.
- **NOTE:** The old `database.sql` references `scans` and `audit_results` tables which are LEGACY and unused. Everything runs through the `audits` table.

## 5. Key Technical Decisions & Rationales
- **Railway over Vercel:** Vercel Serverless has a 50MB bundle limit which breaks `playwright`/Chromium. Railway runs a Docker container with no such limits, and `playwright` (standard) is used with the official Playwright Docker image.
- **`audits` Table (Single-table design):** All data (lead, scrape metadata, AI results) stored in one row in the `audits` table as JSONB. This avoids JOINs and keeps the data flow simple.
- **4 Free / 8 Locked Issues:** `isFreePreview: true` on CTA Clarity, Headline Strength, Social Proof, Value Proposition. All others are locked behind auth. The `results` page checks auth server-side.
- **Batched AI API Calls:** The 12 AI parameters are evaluated in parallel batches of 3 to avoid hitting concurrent rate limits while keeping the audit fast (~60 seconds).
- **Lead Capture First:** The system inserts the user details into the database *before* attempting to scrape or run the AI. This prevents lead loss if the scrape fails.

## 6. Domain Language & Concepts
- **Scan/Audit:** A single evaluation event of a user's URL. Stored in the `audits` table.
- **Lead:** A user who submits a URL and their contact info.
- **Audit Parameter:** A specific CRO heuristic evaluated by the AI (e.g., Form Friction, Visual Hierarchy, CTA Clarity, Pricing Clarity).
- **Free Issues (4) vs. Total Issues (12):** The AI evaluates 12 parameters. 4 are `isFreePreview: true` (visible to all). 8 are locked behind Supabase Auth signup/login.
- **ParamResult/AuditResult:** Structured JSON objects returned by the AI containing: `id`, `name`, `category`, `isFreePreview`, `score` (0-10), `severity`, `title`, `problem`, `fix`, `example`, `impact`.
- **Dashboard:** Authenticated user view at `/dashboard` listing all their completed audits.

## 7. Coding Standards & Anti-Patterns
- **No Generic AI Advice:** The system prompt explicitly strictly forces the AI to quote actual text from the page and provide concrete rewriting examples rather than high-level platitudes.
- **Strict JSON Parsing:** AI models are instructed to return *only* JSON. The backend strips backticks and attempts to parse it safely, falling back to a default "needs manual review" object if the parse fails.
- **Responsive & Premium UI:** The frontend must use robust, premium aesthetics (glassmorphism, vibrant gradients, micro-animations) to match enterprise consultancy reports. Avoid generic styling.
- **Rate Limiting Enforcement:** IP-based rate limiting is enforced via Redis to prevent abuse of expensive LLM and scraping operations.
- **Graceful Scrape Failures:** If a website blocks the headless browser or times out, the app must catch the error, log it to Supabase, and fail gracefully with a user-friendly message rather than crashing.
- **Two Supabase Clients:** Always use `src/lib/supabase.ts` (service role) for backend API routes that need to bypass RLS. Always use `src/utils/supabase/server.ts` (anon key, SSR) for checking auth sessions in Server Components and Route Handlers.
