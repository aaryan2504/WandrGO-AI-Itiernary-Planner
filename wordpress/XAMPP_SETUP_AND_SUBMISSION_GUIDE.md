# WandrGo — WordPress (XAMPP) + Render SEO Setup Guide

This guide explains how to connect your live AI app (`https://wandrgo-ai-itiernary-planner-1.onrender.com/`) with a complete WordPress SEO setup on **XAMPP** so every single requirement in the **CSET489 Milestone II** rubric is fulfilled without fabricating data.

---

## Part A — Push Updated Render App (Live AI + SEO Pages)

1. Review the updated files in `wandrgo-itinerary-planner/`:
   - `backend/main.py` & `backend/seo_config.json` (GZip, cache/security headers, `/about-us/`, `/blog/`, `/ai-travel-itinerary-planner-guide/`, `/sitemap.xml`, `/robots.txt`, GA4 & GSC injection)
   - `frontend/index.html`, `frontend/about-us.html`, `frontend/blog.html`, `frontend/blog-post.html`, `frontend/style.css`, `frontend/app.js`, and `frontend/images/*.webp|png`
2. Commit and push to GitHub so Render redeploys automatically.
3. Verify your live URLs on Render:
   - `https://wandrgo-ai-itiernary-planner-1.onrender.com/`
   - `https://wandrgo-ai-itiernary-planner-1.onrender.com/about-us/`
   - `https://wandrgo-ai-itiernary-planner-1.onrender.com/blog/`
   - `https://wandrgo-ai-itiernary-planner-1.onrender.com/ai-travel-itinerary-planner-guide/`
   - `https://wandrgo-ai-itiernary-planner-1.onrender.com/sitemap.xml`
   - `https://wandrgo-ai-itiernary-planner-1.onrender.com/robots.txt`

---

## Part B — Install WordPress Theme & Content on XAMPP

1. Start **Apache** and **MySQL** in XAMPP Control Panel and open your local WordPress site (e.g. `http://localhost/wandrgo/wp-admin`).
2. **Install the Theme**:
   - Go to **Appearance → Themes → Add New → Upload Theme**
   - Select `wordpress/wandrgo-seo-theme.zip` → **Install Now** → **Activate**.
3. **Import Pages & Blog Post**:
   - Go to **Tools → Import → WordPress → Install Now → Run Importer**.
   - Upload `wordpress/wandrgo-content-import.xml` and assign posts to your admin user.
4. **Set Homepage & Blog Page**:
   - Go to **Settings → Reading** → select **A static page**:
     - Homepage: **Home**
     - Posts page: **Blog**
5. **Set SEO-Friendly Permalinks**:
   - Go to **Settings → Permalinks** → choose **Post name (`/%postname%/`)** → **Save Changes**.
   - Your blog post URL will be `.../ai-travel-itinerary-planner-guide/`.

---

## Part C — Install Required WordPress Plugins

1. **Rank Math SEO** (Section 1):
   - Run the setup wizard.
   - Enable **Sitemap** (`/sitemap_index.xml`), **Breadcrumbs** (General Settings → Breadcrumbs → Enable), **OpenGraph/Social**, **Organization/WebSite Schema**, and **Article Schema** on blog posts.
2. **Performance Plugins** (Section 2):
   - **WP Super Cache** (or **W3 Total Cache**) for page caching.
   - **Converter for Media** (or **Imagify** / **Smush**) for image compression & WebP conversion.
   - **Autoptimize** for CSS/JS minification & lazy loading.
3. **UpdraftPlus** (Section 9 — Mandatory!):
   - Install **UpdraftPlus WordPress Backup Plugin**.
   - Go to **Settings → UpdraftPlus Backups → Settings** → choose **Google Drive** as remote storage, authenticate your Google account, check **Database, Plugins, Themes, Uploads, Others**, and click **Backup Now**.
   - Upload/locate the backup folder/zip on Google Drive → **Share → Anyone with the link (Viewer)** → test the link in an **Incognito/Private browser window** before submitting!
4. **Optional Static Export (to keep site live for free without a VPS)**:
   - Install **Simply Static** → Generate Static Files (ZIP) → deploy the exported static HTML to **Cloudflare Pages**, **Netlify**, or **GitHub Pages** over HTTPS (and enable Cloudflare proxy/SSL if using a custom domain).

---

## Part D — Connect GA4 & Google Search Console (Sections 5 & 6)

1. **Google Analytics 4 (GA4)**:
   - Create a GA4 property → copy your Measurement ID (`G-XXXXXXXXXX`).
   - On Render: set environment variable `GA4_MEASUREMENT_ID=G-XXXXXXXXXX` (or put it in `backend/seo_config.json` and push).
   - On WordPress: **Appearance → Customize → WandrGo SEO & AI Planner** → paste `G-XXXXXXXXXX` (or use Google Site Kit).
   - Verify active user in **GA4 → Reports → Realtime**.
   - Custom events already wired into code: `generate_itinerary`, `ai_chat_message`, `launch_ai_planner`, and `outbound_click`. Mark `generate_itinerary` (or create a custom event in GA4 Admin → Events).
2. **Google Search Console (GSC)**:
   - Add URL-prefix property (`https://wandrgo-ai-itiernary-planner-1.onrender.com/` or your static/WordPress domain).
   - Copy the **HTML tag** token → set `GSC_META_TAG` in Render / `backend/seo_config.json` (or paste in Rank Math / Theme Customizer).
   - Click **Verify** → submit `sitemap.xml` (or `sitemap_index.xml`).

---

## Part E — Collect Real Evidence & Screenshots for Your Report

Take real screenshots (save as Figure 1, Figure 2, ...) after running each live check:
1. **Google Rich Results Test** (`https://search.google.com/test/rich-results`) on `/ai-travel-itinerary-planner-guide/` and `/`.
2. **PageSpeed Insights** (Mobile) & **GTmetrix** — test before and after caching/CDN/WebP optimizations.
3. **Page Source (`Ctrl+U`)** on `/ai-travel-itinerary-planner-guide/` showing both outbound links (`https://seonalabs.com/` and `https://www.unwto.org/world-tourism-barometer`) with no `nofollow`/`sponsored`/`ugc`.
4. **GSC Verification, Sitemap Submitted, Coverage/Indexing, and Performance Report**.
5. **GA4 Realtime** showing 1+ active user & custom event.
6. **Screaming Frog SEO Spider** (free up to 500 URLs) or **Ahrefs Webmaster Tools** crawl before & after fixing issues.
7. **UpdraftPlus** backup log + Google Drive share link tested in incognito.
