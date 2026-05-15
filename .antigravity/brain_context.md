# Project System Brain

## 1. Core Purpose & Value Proposition
- **Problem Solved:** Website owners struggle with low conversion rates but lack the expertise to identify specific UI, UX, or copy issues. UXAuditX provides an automated, AI-driven, 12-point Conversion Rate Optimization (CRO) audit in under 60 seconds.
- **Intended User:** Website owners, marketers, founders, and growth professionals looking for actionable, brutally honest feedback to increase their landing page conversions.

## 2. System Architecture & Tech Stack
- **High-level Architectural Pattern:** Monolithic full-stack web application with serverless API routes, functioning as an orchestration layer for headless browser scraping and parallelized AI evaluation.
- **Tech Stack:**
  - **Framework:** Next.js 16.2.6 (App Router), React 19
  - **Styling:** Tailwind CSS 4, shadcn/ui, lucide-react (icons)
  - **Database:** Supabase (PostgreSQL) for storing leads, scans, and audit results.
  - **AI Layer:** Multiple providers (Anthropic Claude, Google Gemini, OpenAI) via Vercel AI SDK.
  - **Scraping:** Puppeteer / Playwright via `playwright-core` and `@sparticuz/chromium` (for serverless environments), Cheerio for HTML parsing.
  - **Rate Limiting:** Upstash Redis with `@upstash/ratelimit`.
  - **Exporting:** `html2canvas` and `jspdf` for generating downloadable PDF reports on the client side.
- **Data Flow Overview:**
  1. User submits a URL, name, and email on the frontend (`/`).
  2. The frontend POSTs to `/api/audit`.
  3. The API validates input (Zod), checks the rate limit (Upstash Redis), and immediately saves the lead to Supabase (`audits` table).
  4. The scraper spins up a headless browser, goes to the URL, takes desktop/mobile screenshots, and extracts raw text, headings, CTAs, and forms using Cheerio (`src/lib/scraper.ts`).
  5. The extracted context and screenshots are fed into the AI provider (`src/lib/claude.ts`) which runs 12 specific CRO parameters in parallel (batched in 3s to respect rate limits).
  6. The AI results are saved to the database. The API returns only "free" issues to the frontend.
  7. The frontend routes to `/results?id=...` and displays the audit report. The user can download this as a PDF.

## 3. Key Technical Decisions & Rationales
- **Headless Browser + DOM Parsing:** Relying on both screenshots (Vision AI) and text extraction ensures the AI has complete context of both the visual hierarchy and the raw copy/HTML semantics without exceeding context window limits or relying strictly on visual capabilities.
- **Serverless Chromium:** Using `@sparticuz/chromium` allows the headless browser to run within strict serverless limits on platforms like Vercel or AWS Lambda.
- **Batched AI API Calls:** The 12 AI parameters are evaluated in parallel batches of 3 to avoid hitting concurrent rate limits while keeping the audit fast (~60 seconds).
- **Lead Capture First:** The system inserts the user details into the database *before* attempting to scrape or run the AI. This prevents lead loss if the scrape fails.
- **Agnostic AI Provider Abstraction:** The logic is designed to switch between AI providers based on environment variables (`src/lib/ai-provider.ts`), mitigating vendor lock-in.

## 4. Domain Language & Concepts
- **Scan/Audit:** A single evaluation event of a user's URL.
- **Lead:** A user who submits a URL and their contact info.
- **Audit Parameter:** A specific CRO heuristic evaluated by the AI (e.g., Form Friction, Visual Hierarchy, CTA Clarity, Pricing Clarity).
- **Free Issues vs. Total Issues:** The AI evaluates 12 parameters (Total), but the API returns only 3 (Free) to tease value and encourage potential upgrades or consultations.
- **ParamResult/AuditResult:** Structured JSON objects returned by the AI containing a score (0-10), title, problem definition, fix recommendation, rewritten example, and impact.

## 5. Coding Standards & Anti-Patterns
- **No Generic AI Advice:** The system prompt explicitly strictly forces the AI to quote actual text from the page and provide concrete rewriting examples rather than high-level platitudes.
- **Strict JSON Parsing:** AI models are instructed to return *only* JSON. The backend strips backticks and attempts to parse it safely, falling back to a default "needs manual review" object if the parse fails.
- **Responsive & Premium UI:** The frontend must use robust, premium aesthetics (glassmorphism, vibrant gradients, micro-animations) to match enterprise consultancy reports. Avoid generic styling.
- **Rate Limiting Enforcement:** IP-based rate limiting is enforced via Redis to prevent abuse of expensive LLM and scraping operations.
- **Graceful Scrape Failures:** If a website blocks the headless browser or times out, the app must catch the error, log it to Supabase, and fail gracefully with a user-friendly message rather than crashing.
:** If a website blocks the headless browser or times out, the app must catch the error, log it to Supabase, and fail gracefully with a user-friendly message rather than crashing.
