# Project Memory: Saasu Maa Website

## Tech Stack & Specifications
- Framework: Next.js 16 (App Router, JavaScript, HTML5, Vanilla CSS)
- Database & Backend: Supabase (`@supabase/supabase-js`)
  - User / Public: `getSupabaseClient()` using `NEXT_PUBLIC_SUPABASE_ANON_KEY` (RLS enforced)
  - Admin / Server: `getSupabaseAdmin()` using `SUPABASE_SERVICE_ROLE_KEY` (Server-only, bypasses RLS)
- Frontend: Client & Server components with category filters, dynamic 250g/500g/1kg size selector, basket state, direct WhatsApp & Call ordering
- Backend: Next.js Route Handlers (`/api/products`, `/api/orders`) connected to Supabase tables
- Contact & Booking: `8979319003` (Phone & WhatsApp)
- Assets:
  - Official Price List: `/images/price-list.png`
  - Brand Posters: `/images/brand-poster.png`, `/images/logo.jpg`, `/images/billboard.png`, `/images/real-jars.png`
  - Product Artworks: `/images/products/mango.png`, `lahsun.png`, `lal-mirch.png`, `hari-mirch.png`, `lemon-jar.png`, `lemon.png`, `karonda.png`
- Repository: `https://github.com/Focitech/Saasu-Maa-Ka-Achaar.git` (main branch)

## Key Milestones
- Initialized Next.js setup with JavaScript and Vanilla CSS.
- Cropped and integrated all client WhatsApp images into high-res transparent/clean product creatives:
  - Price List (`price-list.png`)
  - Square Brand Creative (`brand-poster.png`)
  - Product Creatives: Mango, Lahsun, Lal Mirch, Hari Mirch, Lemon, Karonda.
- Updated Product Catalog with dynamic size selector (250g, 500g, 1kg) matching official rates.
- Added dedicated Official Rate Card & Price List section with interactive pricing breakdown.
- Added Real Kitchen Jars showcase (`real-jars.png`) highlighting hygiene and pure ingredients.
- Configured dual-tier Supabase architecture (`anon` for user, `service_role` for admin).
- Pushed complete codebase and assets to GitHub repository `https://github.com/Focitech/Saasu-Maa-Ka-Achaar.git`.
- Added domain email addresses (saasumaasfood.site) to website: Contact Us section with 5 email cards + mailto contact form + footer email links.

## Feature: Contact Emails & Contact Section
- Status: done
- Purpose: Surface all 5 domain emails and let visitors send messages via email client
- Files: `src/app/page.js` (Contact Us section JSX), `src/app/globals.css` (contact section CSS)
- Behavior / key decisions:
  - 5 branded email cards: `sandhya@`, `ayush@`, `query@`, `help@`, `support@` at `saasumaasfood.site`
  - Email card grid: 4-col desktop, 2-col tablet, 1-col mobile; support@ card spans full width (dark maroon gradient)
  - Contact form uses `mailto:` link built on submit — no backend needed; opens user's email client
  - Footer "Get in Touch" also updated with `query@`, `support@`, `help@` links
- Config / env: None (mailto only)
- Known issues / TODO: None
- Last changed: 2026-09-21 — added contact section with domain emails

## Feature: SEO — Local & National Ranking
- Status: done
- Purpose: Rank #1 in Bareilly, top UP cities, and nationally for homemade achar searches
- Files:
  - `src/app/layout.js` — full metadata API (title, description, OG, Twitter, geo tags, 50+ keywords)
  - `src/app/sitemap.js` → auto-generates `/sitemap.xml`
  - `src/app/robots.js` → auto-generates `/robots.txt`
  - `src/app/page.js` — JSON-LD structured data (LocalBusiness + FoodEstablishment + Products + BreadcrumbList + WebSite schema)
- Behavior / key decisions:
  - Geo coordinates set to Bareilly (lat: 28.367, lng: 79.430), `geo.region: IN-UP`
  - `areaServed` in schema: 12 UP cities + state + country
  - Footer city list provides crawlable local keyword signals for 25+ cities
  - JSON-LD `@graph` includes LocalBusiness, WebSite, BreadcrumbList, Product offers
  - Open Graph + Twitter Cards configured for sharing previews
  - `canonical` set to production domain; both `hi-IN` / `en-IN` language alternates
  - `robots.txt` blocks `/api/` routes; sitemap linked
- Config / env: Domain must be `saasumaasfood.site` in production
- Known issues / TODO:
  - Add Google Search Console verification token to layout.js `verification.google` when available
  - Submit sitemap.xml to Google Search Console manually after deploy
  - Create Google Business Profile for Bareilly to amplify local SEO
- Last changed: 2026-09-21 — full SEO overhaul (Bareilly + UP targeting)


