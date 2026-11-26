# CSET489 Mini-Project – Milestone II Report (Pre-Filled Draft)

> **Instructions before exporting to PDF:**
> 1. Copy/paste or open in Microsoft Word / Google Docs, replace every `[FILL: ...]` placeholder with your real team details, live measurements, and screenshots (`Figure 1`, `Figure 2`, ...), and delete any guidance boxes/notes before exporting.
> 2. Never invent GSC impressions/clicks, PageSpeed scores, or audit numbers — measure them on your live URL first.
> 3. Export directly to PDF named `CSET489_M2_[TeamID].pdf`.

---

## Cover Page

**Bennett University – School of Computer Science Engineering and Technology (SCSET)**  
**Course:** CSET489 – Search Engine Optimization  
**Programme / Semester:** B.Tech CSE, Semester VII, 2026–27  
**Assessment:** Mini-Project, Milestone II – SEO Implementation, Content, Backlinking, Analytics & Evaluation (20 marks)  
**Course Facilitator:** Dr. Saumitra Gangwar

| Field | Entry |
| --- | --- |
| Team ID (generate using the portal) | `[FILL: Your Team ID]` |
| Team Name | `[FILL: Your Team Name]` |
| Live Website URL (https://...) and hosting (VPS provider, or static host) | `https://wandrgo-ai-itiernary-planner-1.onrender.com/` (Render PaaS; paired with WordPress XAMPP + Simply Static export `[ADD STATIC URL IF APPLICABLE]`) |
| Blog Article URL (with the outbound links) | `https://wandrgo-ai-itiernary-planner-1.onrender.com/ai-travel-itinerary-planner-guide/` |
| UpdraftPlus Backup Link (Google Drive, public) | `[FILL: Public Google Drive link from XAMPP WordPress UpdraftPlus backup]` |
| Submission Date (DD-MM-YYYY) | `[FILL: DD-MM-YYYY]` |

## Team Members

| S. No. | Full Name | Enrolment No. | Role (Leader / Member) |
| --- | --- | --- | --- |
| 1 | `[FILL: Leader Name]` | `[FILL: Enrolment No.]` | Leader |
| 2 | `[FILL]` | `[FILL]` | Member |
| 3 | `[FILL]` | `[FILL]` | Member |
| 4 | `[FILL]` | `[FILL]` | Member |
| 5 | `[FILL]` | `[FILL]` | Member |

## Team Contribution Statement

| Task | Report Section | Led by (Enrolment No.) | Supported by (Enrolment No.) |
| --- | --- | --- | --- |
| Technical, on-page SEO and schema | 1 | `[FILL]` | `[FILL]` |
| Performance and security optimization | 2 | `[FILL]` | `[FILL]` |
| Website content creation | 3 | `[FILL]` | `[FILL]` |
| Outbound links in the blog article | 4 | `[FILL]` | `[FILL]` |
| GSC and GA4 setup and reporting | 5–6 | `[FILL]` | `[FILL]` |
| SEO audit and corrective actions | 7–8 | `[FILL]` | `[FILL]` |
| Backup and report compilation | 9–10 | `[FILL]` | `[FILL]` |

| Enrolment No. | Name | Share of Work (%) |
| --- | --- | --- |
| `[FILL]` | `[FILL]` | `[FILL]` |
| `[FILL]` | `[FILL]` | `[FILL]` |
| `[FILL]` | `[FILL]` | `[FILL]` |
| `[FILL]` | `[FILL]` | `[FILL]` |
| `[FILL]` | `[FILL]` | `[FILL]` |

---

## 1. Technical & On-Page SEO

**SEO plugin used:** Rank Math SEO (WordPress XAMPP build with `wandrgo-seo-theme`) + custom FastAPI semantic/JSON-LD SEO layer on Render.

| Element | Done (Y/N) | How / Setting Used | Figure No. |
| --- | --- | --- | --- |
| Unique title and meta description on every page | Y | Unique `<title>` & `<meta name="description">` configured per page in HTML templates and Rank Math snippet editor | Figure 1 |
| One H1 per page, logical H2/H3 structure | Y | Verified single `<h1>` on Homepage, About Us, Blog, and Blog Article with nested `<h2>`/`<h3>` subheadings | Figure 2 |
| SEO-friendly permalinks (`/%postname%/`) | Y | WordPress Permalinks set to `/%postname%/`; FastAPI routes use `/about-us/`, `/blog/`, and `/ai-travel-itinerary-planner-guide/` with 301 canonical redirects | Figure 3 |
| XML sitemap generated (give URL) | Y | `https://wandrgo-ai-itiernary-planner-1.onrender.com/sitemap.xml` (and `/sitemap_index.xml` via Rank Math) | Figure 4 |
| Breadcrumbs enabled | Y | Semantic `<nav aria-label="Breadcrumb">` + `BreadcrumbList` JSON-LD enabled in templates and Rank Math Breadcrumbs | Figure 5 |
| OpenGraph / social tags | Y | `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, and `twitter:card` configured across all pages | Figure 6 |
| Schema: Organization or WebSite | Y | JSON-LD `@graph` with `Organization` and `WebSite` on Homepage and `AboutPage` + `Organization` on About Us | Figure 7 |
| Schema: Article (on blog post) | Y | JSON-LD `Article` schema with `headline`, `datePublished`, `dateModified`, `author`, `publisher`, and `image` on `/ai-travel-itinerary-planner-guide/` | Figure 8 |
| Internal links between pages | Y | Header/footer navigation and contextual body links connecting `/`, `/about-us/`, `/blog/`, and `/ai-travel-itinerary-planner-guide/` | Figure 9 |

**Schema validation:**  
- **URL tested:** `https://wandrgo-ai-itiernary-planner-1.onrender.com/ai-travel-itinerary-planner-guide/` (run in [Google Rich Results Test](https://search.google.com/test/rich-results))  
- **Schema types detected:** `[FILL after running live test: e.g. Articles, Breadcrumbs]`  
- **Errors or warnings:** `[FILL: e.g. 0 errors, 0 warnings — attach screenshot as Figure 8]`

---

## 2. Performance & Security

Test the homepage before and after optimization, on mobile. Use the same tool and settings both times.

| Metric (mobile) | Before | After | Tool | Test Date |
| --- | --- | --- | --- | --- |
| PageSpeed Insights performance score | `[FILL]` | `[FILL]` | PageSpeed Insights | `[FILL]` |
| Largest Contentful Paint (LCP, s) | `[FILL]` | `[FILL]` | PageSpeed Insights | `[FILL]` |
| Interaction to Next Paint (INP, ms) or Total Blocking Time (TBT, ms) | `[FILL]` | `[FILL]` | PageSpeed Insights | `[FILL]` |
| Cumulative Layout Shift (CLS) | `[FILL]` | `[FILL]` | PageSpeed Insights | `[FILL]` |
| GTmetrix grade | `[FILL]` | `[FILL]` | GTmetrix | `[FILL]` |
| Total page size (MB) | `[FILL]` | `[FILL]` | GTmetrix | `[FILL]` |

| Optimization Applied | Plugin / Method |
| --- | --- |
| Caching | FastAPI `Cache-Control: public, max-age=604800` for static assets + GZip compression (`GZipMiddleware`); WP Super Cache on WordPress |
| Image compression and WebP conversion | Converted banner & workflow graphics to compressed `.webp` (`~28–35 KB`, explicit `width`/`height`); Converter for Media on WordPress |
| Cloudflare CDN and SSL mode | `[FILL: e.g. Render HTTPS TLS / Cloudflare CDN Full (strict) SSL if custom domain connected]` |
| Other (minification, lazy loading, etc.) | Removed render-blocking CSS `@import` in favor of `<link>` with `display=swap`, added `defer` to `app.js`, added `loading="lazy"` on below-the-fold images, removed WordPress emoji bloat |

---

## 3. Keyword-Based Content

| Page | URL | Target Keyword | Word Count | Internal Links | Outbound Citations |
| --- | --- | --- | --- | --- | --- |
| Homepage | `https://wandrgo-ai-itiernary-planner-1.onrender.com/` | `AI travel itinerary planner` | ~450+ (static) + dynamic itinerary | 4 (`/about-us/`, `/blog/`, `/ai-travel-itinerary-planner-guide/`, `/sitemap.xml`) | 0 |
| About Us | `https://wandrgo-ai-itiernary-planner-1.onrender.com/about-us/` | `WandrGo AI travel planner` | ~420 | 3 (`/`, `/blog/`, `/ai-travel-itinerary-planner-guide/`) | 0 |
| Blog Article | `https://wandrgo-ai-itiernary-planner-1.onrender.com/ai-travel-itinerary-planner-guide/` | `how to plan a trip with AI` | ~1,150 | 3 (`/`, `/about-us/`, `/blog/`) | 2 (`seonalabs.com`, `unwto.org`) |

**Search intent explanation (2–3 sentences):**  
Users searching for *"how to plan a trip with AI"* have informational and practical intent: they want a repeatable workflow rather than generic destination trivia. The article satisfies this intent by walking through trip constraints, structured zero-duplication rules, an INR budget breakdown table, context-aware refinement, and common planning mistakes before linking directly to the interactive WandrGo planner.

---

## 4. Outbound Links in the Blog Article

| Item | Entry |
| --- | --- |
| Blog article URL | `https://wandrgo-ai-itiernary-planner-1.onrender.com/ai-travel-itinerary-planner-guide/` |
| Link 1: `seonalabs.com` page linked | `https://seonalabs.com/` |
| Link 1: anchor text | `curated SEO and search tools` |
| Link 2: authority page linked | `https://www.unwto.org/world-tourism-barometer` |
| Link 2: anchor text | `UN Tourism World Tourism Barometer` |
| `rel` attribute of both links (from the page source) | `rel="noopener"` (no `nofollow`, `sponsored`, or `ugc`) |

*[Insert screenshot of View Page Source (`Ctrl+U`) showing both `<a>` tags in body paragraphs as Figure 10.]*

---

## 5. Google Search Console & GA4 Setup

| Item | Status / Value | Figure No. |
| --- | --- | --- |
| GSC property type (Domain / URL prefix) and verification method (DNS / HTML) | `[FILL: e.g. URL-prefix / HTML meta tag via GSC_META_TAG]` | Figure 11 |
| Sitemap submitted (URL and status) | `[FILL: https://wandrgo-ai-itiernary-planner-1.onrender.com/sitemap.xml — Success]` | Figure 12 |
| Pages indexed / not indexed | `[FILL: e.g. X indexed / Y discovered — from GSC Indexing report]` | Figure 13 |
| GA4 Measurement ID (`G-...`) and how installed | `[FILL: G-XXXXXXXXXX — installed via GA4_MEASUREMENT_ID in Render & Customizer]` | Figure 14 |
| Real-time report showing an active user | `[FILL: Yes — active user verified in GA4 Realtime]` | Figure 15 |
| Custom event created (event name and trigger) | `generate_itinerary` (triggered when user clicks Generate My AI Itinerary and receives a valid itinerary) + `ai_chat_message` | Figure 16 |

---

## 6. Performance Reporting & Ranking Analysis

*(Report exact live GSC data for your date range; if impressions/clicks are low or zero due to recent launch, state the exact figures honestly.)*

| Date Range | Impressions | Clicks | CTR (%) | Average Position |
| --- | --- | --- | --- | --- |
| `[FILL: DD-MM-YYYY to DD-MM-YYYY]` | `[FILL]` | `[FILL]` | `[FILL]` | `[FILL]` |

**Top queries (up to 5):**

| Query | Impressions | Clicks | Average Position | In Milestone I keyword list? (Y/N) |
| --- | --- | --- | --- | --- |
| `[FILL]` | `[FILL]` | `[FILL]` | `[FILL]` | `[FILL]` |
| `[FILL]` | `[FILL]` | `[FILL]` | `[FILL]` | `[FILL]` |

**Interpretation (80–120 words):**  
`[FILL after collecting your live GSC data: summarize which queries gained impressions, why newly indexed pages start with low click volume, and next steps such as internal linking and FAQ expansion.]`

---

## 7. SEO Audit & Issue Identification

**Audit tool and date:** `[FILL: e.g. Screaming Frog SEO Spider / Ahrefs Webmaster Tools; DD-MM-YYYY]`

*(Note: Below are real issues that existed in the initial `wandrgo-itinerary-planner` build before our SEO upgrade, which you can verify/update against your own audit run.)*

| # | Issue | Category | Severity (High / Medium / Low) | Pages Affected | Example URL |
| --- | --- | --- | --- | --- | --- |
| 1 | Missing `sitemap.xml`, `robots.txt`, and crawlable secondary pages (`About Us`, `Blog`) | Technical SEO | High | Sitewide | `https://wandrgo-ai-itiernary-planner-1.onrender.com/` |
| 2 | Missing JSON-LD Schema markup (`Organization`, `WebSite`, `Article`, `BreadcrumbList`) and OpenGraph tags | Technical / On-Page | High | All pages | `https://wandrgo-ai-itiernary-planner-1.onrender.com/` |
| 3 | Render-blocking CSS `@import` for Google Fonts and missing GZip / `Cache-Control` headers | Performance | Medium | All pages | `https://wandrgo-ai-itiernary-planner-1.onrender.com/static/style.css` |
| 4 | `[FILL any additional issue found by Screaming Frog / PSI on your live crawl]` | `[FILL]` | `[FILL]` | `[FILL]` | `[FILL]` |

---

## 8. Corrective Actions & Impact

| Issue # (from Section 7) | Fix Applied | Before | After | Worked? (Y / Partly / N) |
| --- | --- | --- | --- | --- |
| 1 | Added `/about-us/`, `/blog/`, `/ai-travel-itinerary-planner-guide/`, `/sitemap.xml`, and `/robots.txt` with 301 canonical redirects | Single-page app with 404 on `/sitemap.xml` and `/robots.txt` | 4 crawlable canonical URLs returning HTTP 200 and valid XML sitemap | Y |
| 2 | Embedded validated JSON-LD (`Organization`, `WebSite`, `Article`, `BreadcrumbList`) and OpenGraph meta tags | 0 structured data items detected | Valid schema detected in Rich Results Test `[VERIFY LIVE]` | `[FILL]` |
| 3 | Replaced CSS `@import` with non-blocking `<link>` + `display=swap`, enabled `GZipMiddleware`, added `Cache-Control` & compressed WebP images | `[FILL Before LCP / TBT]` | `[FILL After LCP / TBT]` | `[FILL]` |

**One fix that did not work as expected (2–3 sentences):**  
`[FILL with a genuine observation from your audit/test — for example, Render's free-tier cold start Time-to-First-Byte (TTFB) spike on first hit after inactivity, which server-side caching alone cannot eliminate without an always-on instance or static CDN front-end.]`

---

## 9. UpdraftPlus Backup

| Item | Entry |
| --- | --- |
| Backup date | `[FILL: DD-MM-YYYY]` |
| Contents included (database, plugins, themes, uploads, others) | Database, Plugins, Themes, Uploads, Others |
| Total size (MB) | `[FILL: e.g. 42.5 MB]` |
| Google Drive link, shared as "Anyone with the link" | `[FILL: https://drive.google.com/...]` |

---

## 10. Reflection

`[FILL 100–150 words reflecting on: (1) which technical/content change had the biggest impact on SEO/PageSpeed, (2) what you would do differently earlier in Milestone I/II—such as deploying static content on a CDN earlier so Googlebot indexes pages sooner—and (3) one practical lesson learned outside the syllabus, such as debugging cold-start TTFB or syncing a live FastAPI AI backend with a WordPress SEO frontend.]`

---

## 11. AI Use Disclosure & Declaration

| Tool or AI Assistant | What It Was Used For | Section(s) |
| --- | --- | --- |
| Antigravity (AI Coding Assistant) | Implementing FastAPI SEO routes, JSON-LD schema, WebP asset generation, custom WordPress theme (`wandrgo-seo-theme`), WXR import XML, and drafting article structure (reviewed and verified by team) | 1, 2, 3, 4 |
| Google Gemini / Groq / Ollama | Powering live AI itinerary generation and multi-turn travel chat inside the WandrGo application | Application backend |

We declare that this report and our website content are our own work, that all data was collected by us using the tools named, and that all sources are cited. We understand that copied content, fabricated data, or undisclosed AI-generated content will be treated as academic misconduct.

---

## Appendix: Figure List

| Figure No. | Caption | Section |
| --- | --- | --- |
| Figure 1 | Unique title and meta description verification | 1 |
| Figure 2 | Heading hierarchy (single H1, nested H2/H3) | 1 |
| Figure 3 | Permalink structure (`/%postname%/`) | 1 |
| Figure 4 | XML Sitemap loaded in browser | 1 |
| Figure 5 | Breadcrumbs displayed on About Us / Blog post | 1 |
| Figure 6 | OpenGraph social preview / meta tags | 1 |
| Figure 7 | Rich Results Test — Organization / WebSite schema | 1 |
| Figure 8 | Rich Results Test — Article schema on blog post | 1 |
| Figure 9 | Internal linking structure across pages | 1 |
| Figure 10 | Blog post page source showing both outbound links (`seonalabs.com` and `unwto.org`) without `nofollow` | 4 |
| Figure 11–16 | GSC verification, sitemap submission, indexing, GA4 Realtime, custom event | 5 |
| Figure 17+ | PageSpeed Insights / GTmetrix before & after, Screaming Frog audit, UpdraftPlus Google Drive link | 2, 7, 8, 9 |
