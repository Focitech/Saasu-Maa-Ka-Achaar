# Project Memory: Saasu Maa Website

## Tech Stack & Specifications
- Framework: Next.js 16 (App Router, JavaScript, HTML5, Vanilla CSS)
- Database & Backend: Supabase (`@supabase/supabase-js`)
  - User / Public: `getSupabaseClient()` using `NEXT_PUBLIC_SUPABASE_ANON_KEY` (RLS enforced)
  - Admin / Server: `getSupabaseAdmin()` using `SUPABASE_SERVICE_ROLE_KEY` (Server-only, bypasses RLS)
- Frontend: Client & Server components with category filters, basket state, direct WhatsApp & Call ordering
- Backend: Next.js Route Handlers (`/api/products`, `/api/orders`) connected to Supabase tables
- Contact & Booking: `8979319003` (Phone & WhatsApp)
- Assets: Authentic Saasu Maa Ka Achaar branding assets (`/images/logo.jpg`, `/images/billboard.png`, `/images/poster.png`, `/images/real-jars.png`)
- Repository: `https://github.com/Focitech/Saasu-Maa-Ka-Achaar.git` (main branch)

## Key Milestones
- Initialized Next.js setup with JavaScript and Vanilla CSS.
- Implemented responsive landing page, branding showcase, product catalog, and checkout modal.
- Configured backend API endpoints for product retrieval and order placement.
- Fixed mobile navbar overflow: Hid redundant desktop order button on screens <= 860px, streamlined basket to icon/badge on mobile, and moved all primary CTAs into the mobile drawer.
- Integrated official brand details: 100% Mustard Oil, No Preservatives, Maa ke haath ka swaad, and direct booking via 8979319003.
- Removed unwanted hero badge pill from top of hero banner.
- Configured dual-tier Supabase architecture (`anon` for user, `service_role` for admin) with SQL schema & RLS policies in `supabase/schema.sql`.
- Pushed complete codebase and assets to GitHub repository `https://github.com/Focitech/Saasu-Maa-Ka-Achaar.git`.
