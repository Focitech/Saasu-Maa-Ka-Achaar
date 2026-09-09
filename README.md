# Saasu Maa Ka Achaar (सासू माँ का अचार)

Official website and ordering platform for **Saasu Maa's Food** — traditional Indian homemade pickles prepared with 100% mustard oil, whole handpicked spices, and zero preservatives.

---

## Features

- **Interactive Product Catalog**: Real client product posters with dynamic size switching across **250g**, **500g**, and **1kg** jars.
- **Official Rate Card & Price List**: Dedicated section displaying the authentic price list poster and interactive rate table.
- **Real Kitchen Gallery**: Visual showcase of freshly packaged pickle jars straight from the kitchen.
- **Direct WhatsApp & Phone Ordering**: One-tap pre-filled WhatsApp ordering and direct call booking (`+91 8979319003`).
- **Mobile Optimized**: Clean, non-overflowing navbar with responsive slide-down menu.
- **Dual-Tier Supabase Integration**:
  - `anon` client for public browsing and order submissions (RLS enforced).
  - `service_role` admin client for backend management and processing.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **Frontend**: React (JavaScript), Vanilla CSS, HTML5
- **Backend**: Next.js Server Route Handlers
- **Package Manager**: npm

---

## Project Structure

```
├── public/
│   └── images/
│       ├── products/        # Cropped product artworks (mango, lahsun, lal mirch, etc.)
│       ├── brand-poster.png # High-res brand creative
│       ├── price-list.png   # Official rate card poster
│       └── real-jars.png    # Kitchen shelf packaging showcase
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── orders/      # Backend route for order processing
│   │   │   └── products/    # Backend route for catalog & pricing
│   │   ├── globals.css      # Design tokens, catalog grid, & responsive styles
│   │   ├── layout.js        # Root layout & SEO metadata
│   │   └── page.js          # Interactive store, size selectors, & checkout
│   └── lib/
│       └── supabase/        # User client (anon) & admin client (service_role)
├── supabase/
│   └── schema.sql           # Database schema & RLS policies
└── .env.example             # Environment variables template
```

---

## Getting Started

### Prerequisites

- Node.js (v18.18+ recommended)
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Contact & Inquiries

- **Brand**: Saasu Maa's Food
- **Phone / WhatsApp**: [+91 8979319003](tel:8979319003)
- **DM for Booking**: 8979319003
