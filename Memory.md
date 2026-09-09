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
