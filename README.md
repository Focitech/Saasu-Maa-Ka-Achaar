# Saasu Maa Ka Achaar (सासू माँ का अचार)

Official web storefront and management platform for **Saasu Maa's Food** — handcrafted Indian homemade pickles prepared in traditional wood-pressed mustard oil with whole sun-dried spices and zero artificial preservatives.

---

## Features

- **Interactive Product Catalog**: Dynamic size switcher across **250g**, **500g**, and **1kg** variants with real-time price calculations and local basket management.
- **Dual Authentication (Password & Email OTP)**: Secure login supporting both email OTP and strong password authentication (`crypto.scrypt` hashing with per-user salt and timing-safe verification), with automatic OTP identity verification for OTP-created accounts setting up their first password.
- **Customer Account Portal**: Dedicated `/account` dashboard displaying member details, order shortcuts, and direct concierge links.
- **Admin Management Console**: Dedicated `/admin` route with all-in-one Order Cards view (zero horizontal scrolling, all details, items list, order/payment status selectors, and WhatsApp button visible on one page), interactive Cards/Table view switcher, and idempotent payment audit trails.
- **Product Catalog & Pricing Editor**: Dedicated `/admin/products` suite to manage pickle varieties, bilingual Hindi/English names, real-time stock toggles, adaptive single/multi-column catalog grid, and full-screen mobile edit drawer modal with Cloudinary uploads.
- **Cloudinary Image Management**: Automated jar photo uploads directly to Cloudinary with CDN delivery, auto-formatting, and dev base64 fallback.
- **Official Rate Card & Price List**: Dedicated section displaying the authentic price poster and interactive pricing table.
- **Direct WhatsApp & Phone Ordering**: Automatic WhatsApp checkout redirection with complete itemized order breakdown, order reference ID, delivery address, and direct phone booking (`+91 8979319003`).
- **Comprehensive Local & Regional SEO**: JSON-LD structured data (`LocalBusiness`, `Product`, `BreadcrumbList`), Open Graph, Twitter Cards, automated `sitemap.xml`, and `robots.txt` optimized for Bareilly, Uttar Pradesh, and pan-India discovery.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Email Service**: [Resend](https://resend.com/) for transactional 6-digit OTP delivery
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (v2 Node SDK) for product photo optimization and CDN delivery
- **Styling**: Vanilla CSS with custom royal Indian design tokens
- **Runtime**: Node.js

---

## Project Structure

```
├── public/
│   ├── images/
│   │   ├── products/        # Product creatives (mango, lahsun, lal mirch, etc.)
│   │   ├── brand-poster.png # High-resolution brand artwork
│   │   ├── price-list.png   # Official rate card poster
│   │   └── real-jars.png    # Kitchen jars packaging showcase
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── account/         # Customer account dashboard
│   │   ├── admin/           # Admin management console with paginated orders
│   │   │   └── products/    # Product catalog, prices & Cloudinary photo editor
│   │   ├── login/           # Email OTP login page
│   │   ├── signup/          # Registration page with OTP verification
│   │   ├── api/
│   │   │   ├── admin/       # Admin endpoints (paginated orders, stats, products, upload)
│   │   │   ├── auth/        # Auth endpoints (send-otp, verify-otp, me, logout)
│   │   │   ├── orders/      # Customer order placement & DB persistence
│   │   │   └── products/    # Catalog pricing endpoint
│   │   ├── globals.css      # Design tokens, catalog grid, auth & admin styles
│   │   ├── layout.js        # Root layout, fonts, and global metadata
│   │   ├── page.js          # Main storefront, catalog, and checkout modal
│   │   ├── robots.js        # Robots.txt generator
│   │   └── sitemap.js       # Dynamic sitemap generator
│   ├── components/
│   │   └── SpiroSpinner.js  # Torus spirograph geometric loading spinner
│   ├── lib/
│   │   ├── auth.js          # OTP generation, HMAC hashing, signed cookies
│   │   ├── cloudinary.js    # Cloudinary v2 stream uploader & fallback
│   │   ├── resend.js        # Resend email client & branded HTML template
│   │   └── supabase/        # Public anon & admin service-role clients
│   └── proxy.js             # Route proxy guarding /login and /signup from authenticated users
├── supabase/
│   ├── schema.sql           # Complete idempotent database schema with RLS & indexes
│   └── auth_schema.sql      # Auth and payments migration add-on
└── .env.example             # Environment variables template
```

---

## Getting Started

### Prerequisites

- Node.js (v18.18+ or v20+)
- npm or pnpm

### 1. Installation

```bash
git clone https://github.com/Focitech/Saasu-Maa-Ka-Achaar.git
cd Saasu-Maa-Ka-Achaar
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=Saasu Maa's Food <otp@saasumaasfood.site>

# Session Secret (HMAC Signing)
AUTH_SECRET=your-random-32-char-secret-string

# Cloudinary (Product Jar Photo Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

*Note: In local development without live keys, OTP codes are logged directly to the server terminal (`[DEV AUTH OTP]`) for immediate testing.*

### 3. Database Setup

Open the [Supabase SQL Editor](https://app.supabase.com/) and run the contents of [`supabase/schema.sql`](supabase/schema.sql). The script is completely idempotent with safe drop/create policy guards.

### 4. Running Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront, [http://localhost:3000/login](http://localhost:3000/login) for customer auth, or [http://localhost:3000/admin](http://localhost:3000/admin) for the management console.

### 5. Production Build

```bash
npm run build
npm run start
```

---

## Contact & Store Details

- **Kitchen Location**: Bareilly, Uttar Pradesh, India
- **Phone / WhatsApp**: [+91 8979319003](tel:8979319003)
- **General Queries**: `query@saasumaasfood.site`
- **Customer Support**: `support@saasumaasfood.site`
