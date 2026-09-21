# Project Memory: Saasu Maa Website

## Feature Index
- Contact Emails & Contact Section: `done`
- SEO — Local & National Ranking: `done`
- Email OTP Auth (Resend & Supabase): `done`
- Admin Management Console & Paginated Orders: `done`
- Admin Product Catalog & Cloudinary Media: `done`


## Tech Stack & Specifications
- Framework: Next.js 16 (App Router, JavaScript, HTML5, Vanilla CSS)
- Database & Backend: Supabase (`@supabase/supabase-js`)
  - User / Public: `getSupabaseClient()` using `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY` (RLS enforced)
  - Admin / Server: `getSupabaseAdmin()` using `SUPABASE_SERVICE_ROLE_KEY` (Server-only, bypasses RLS)
- Email Service: Resend (`resend` SDK) with sender `Saasu Maa's Food <otp@saasumaasfood.site>`
- Frontend: Client & Server components with category filters, dynamic 250g/500g/1kg size selector, basket state, direct WhatsApp & Call ordering, passwordless OTP login/signup, customer account dashboard, admin management console
- Backend: Next.js Route Handlers (`/api/auth/*`, `/api/admin/*`, `/api/products`, `/api/orders`)
- Contact & Booking: `8979319003` (Phone & WhatsApp)
- Assets:
  - Official Price List: `/images/price-list.png`
  - Brand Posters: `/images/brand-poster.png`, `/images/logo.jpg`, `/images/billboard.png`, `/images/real-jars.png`
  - Product Artworks: `/images/products/mango.png`, `lahsun.png`, `lal-mirch.png`, `hari-mirch.png`, `lemon-jar.png`, `lemon.png`, `karonda.png`
- Repository: `https://github.com/Focitech/Saasu-Maa-Ka-Achaar.git` (main branch)

## Key Milestones
- Initialized Next.js setup with JavaScript and Vanilla CSS.
- Cropped and integrated all client WhatsApp images into high-res transparent/clean product creatives.
- Dual-tier Supabase architecture configured with idempotent SQL migrations.
- Integrated Resend email delivery with branded OTP templates and console fallback.
- Added `/login`, `/signup`, and `/account` pages with 6-digit OTP verification and 60s cooldown.
- Added separate `/admin` Management Console with KPI cards, paginated orders, and status updater.

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

## Feature: Email OTP Auth (Resend & Supabase)
- Status: done
- Purpose: Passwordless customer login, registration, and session management via 6-digit email OTPs
- Files:
  - `src/app/login/page.js` — two-phase login flow (email -> 6-digit OTP grid) with auth gate redirect
  - `src/app/signup/page.js` — customer signup flow (full name, email, phone -> OTP verification) with auth gate redirect
  - `src/components/SpiroSpinner.js` — 36-ring spirograph geometric torus loading spinner matching blue-to-violet design
  - `src/proxy.js` — Next.js 16 route proxy protecting `/login` and `/signup` from authenticated users
  - `src/lib/auth.js` — OTP generation, HMAC-SHA256 hashing, session tokens, cookies, replay prevention
  - `src/lib/resend.js` — Resend API integration with branded HTML template & dev console fallback
  - `src/app/api/auth/send-otp/route.js` — endpoint with 60s cooldown per email
  - `src/app/api/auth/verify-otp/route.js` — atomic OTP verification, attempt counter (max 5), profile upsert
  - `src/app/api/auth/me/route.js` — session reader for navbar & customer context
  - `src/app/api/auth/logout/route.js` — session cookie invalidation
  - `supabase/schema.sql` & `supabase/auth_schema.sql` — idempotent schema with `public.profiles` and `public.email_otps`
- Behavior / key decisions:
  - Spirograph Geometric Torus Spinner: High-res SVG component (`<SpiroSpinner />`) with 36 rotated ellipses, opacity sinusoidal wave, and blue-to-violet linear gradient (`#1e40af` -> `#2563eb` -> `#6366f1` -> `#8b5cf6` -> `#d8b4fe`) replacing generic circular spinners across auth and admin.
  - Clean Navbar Brand: Removed the secondary English slogan `Saasu Maa's Food • The Taste of Tradition` from the top header to prevent vertical and horizontal brand crowding.
  - Auth Page Guard: `src/proxy.js` intercepts requests to `/login` and `/signup`. If a valid `sasumaa_auth_session` cookie exists, it automatically redirects the user to `/account` (or `/admin` for admins, or valid `redirect` param).
  - Zero-Flash Client Guard: `LoginForm` and `SignupForm` gate rendering behind `isCheckingAuth` and synchronously check `localStorage` cache for instant client-side redirection without form flash.
  - Idempotency & Replay Protection: OTP is deleted from DB immediately upon successful verification.
  - Rate Limiting: 60-second cooldown enforced per email before a new code can be generated.
  - Max Attempts: 5 attempts per OTP; increments atomically; expired/exhausted codes purged.
  - Session Management: Signed session tokens stored in secure, HTTP-only, SameSite=Lax cookie (`sasumaa_auth_session`).
  - Zero-Delay State Sync: Navbar and pages sync from local session storage cache instantly (0ms) upon login, while asynchronously revalidating live role/profile data from Supabase.
  - Hydration-Safe Mounting: Auth elements gate on `isMounted` state to eliminate SSR/CSR hydration mismatches.
  - High-Contrast Badges: `.nav-admin-btn` uses bold deep royal maroon (`#4A0E17`) and gold borders for 100% sharp readability against light navbar backgrounds.
  - Role-Aware Badges: Navbar dynamically displays `🛡️ Admin Console` for `role === 'admin'`, `👔 Staff` for `role === 'staff'`, or user's first name/account for customers.
  - Responsive Navbar & Mobile Drawer: Two-tier mobile actions layout with full-width Auth button and 2-column Call & WhatsApp grid; redundant top header auth button hidden on <= 540px to prevent header squashing; scoped `.mobile-nav-link` CSS to prevent font color pollution on WhatsApp button.
  - Circular SVG Logout Button: Modern circular exit icon (`[→`) positioned at the very far-right end of all navbar actions (after Order Online and Admin button), with animated crimson hover transition.
  - Graceful Fallback: In-memory store & console OTP logging active when local env keys are pending.
- Config / env:
  - `RESEND_API_KEY`: API key from resend.com
  - `RESEND_FROM_EMAIL`: `Saasu Maa's Food <otp@saasumaasfood.site>`
  - `AUTH_SECRET`: Secret key for session token HMAC signatures
  - `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Known issues / TODO: None
- Last changed: 2026-09-21 — removed slogan from navbar brand and implemented spirograph geometric torus loading animation

## Feature: Admin Management Console & Paginated Orders
- Status: done
- Purpose: Separate administration console for store owners to manage orders, update statuses, and audit payments
- Files:
  - `src/app/admin/page.js` — responsive admin console with KPI cards, tab views, and paginated orders table
  - `src/app/api/admin/orders/route.js` — paginated, indexed query endpoint with status filter & search
  - `src/app/api/admin/stats/route.js` — fast aggregation of total orders, revenue, and status breakdowns
  - `supabase/schema.sql` — orders & payments table with high-performance B-tree indexes
- Behavior / key decisions:
  - Pagination & Performance: Offset/limit pagination with `range()` using composite index `(status, created_at desc)`.
  - Idempotent Payments Table: Unique index on `idempotency_key` ensures zero duplicate transactions.
  - Real-time Status Updates: In-table dropdowns for immediate PATCH update of order & payment statuses.
  - WhatsApp Direct Action: Direct links to contact customer on WhatsApp with prefilled order details.
- Config / env:
  - `SUPABASE_SERVICE_ROLE_KEY`: Required for admin data read/write
- Known issues / TODO: None
- Last changed: 2026-09-21 — created separate admin dashboard with paginated orders and payments audit

## Feature: Admin Product Catalog & Cloudinary Media
- Status: done
- Purpose: Admin dashboard to edit product descriptions, rates for 250g/500g/1kg, toggle stock status, and upload high-res jar photos to Cloudinary
- Files:
  - `src/app/admin/products/page.js` — interactive catalog grid, stock toggles, edit drawer modal, and photo uploader
  - `src/app/api/admin/products/route.js` — GET, POST, and PATCH endpoints for product data with Supabase persistence and fallback
  - `src/app/api/admin/upload/route.js` — multipart image upload endpoint with Cloudinary buffer streaming and dev fallback
  - `src/lib/cloudinary.js` — Cloudinary v2 SDK configuration and upload helper
  - `src/app/globals.css` — catalog grid, product cards, stock badges, pricing fieldset, and modal drawer styles
  - `src/app/admin/page.js` — tab navigation and top bar link to `/admin/products`
- Behavior / key decisions:
  - Dynamic Multi-Size Rates: Stores 250g, 500g, and 1kg rate mapping for all varieties in Supabase `products.rates` JSONB column.
  - Quick Stock Toggle: Instant PATCH toggle for `in_stock` with optimistic UI update and toast feedback.
  - Cloudinary Image Delivery: Direct server-side upload stream to folder `saasumaa_products` with auto webp/jpg optimization; falls back to dev base64 preview when Cloudinary keys are unconfigured.
  - Idempotent Product Upsert: Product IDs generated from slugified names; updates use atomic `adminClient.from('products').update()` keyed by `id`.
- Config / env:
  - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
  - `CLOUDINARY_API_KEY`: Cloudinary API key
  - `CLOUDINARY_API_SECRET`: Cloudinary API secret
- Known issues / TODO: None
- Last changed: 2026-09-21 — created admin product catalog management page and Cloudinary photo uploader

