# Saasu Maa Ka Achaar (सासू माँ का अचार)

Official website and ordering system for **Saasu Maa's Food** — homemade traditional Indian pickles prepared with 100% mustard oil, time-tested family recipes, and zero preservatives.

---

## Highlights

- **Compact, Responsive Header**: Streamlined 52px sticky navbar with single-line aligned navigation and mobile drawer toggle.
- **Product Catalog**: Dynamic categorization across 8 authentic pickle varieties (Mango, Spicy, Digestive, Special).
- **Direct Ordering Channels**:
  - One-click WhatsApp order generation (+91 8979319003) with pre-filled itemized breakdown.
  - Direct telephone booking badge.
  - Delivery inquiry form connected to the backend API.
- **Floating Contact Actions**: Always-accessible WhatsApp and direct phone call buttons.
- **Backend API Routes**:
  - `GET /api/products`: Fetches full product catalog and metadata.
  - `POST /api/orders`: Submits customer orders and inquiry requests.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React (JavaScript), Vanilla CSS, HTML5
- **Backend**: Next.js Server Route Handlers
- **Package Manager**: npm

---

## Project Structure

```
├── public/
│   └── images/            # Brand logo and billboard graphics
├── src/
│   └── app/
│       ├── api/
│       │   ├── orders/     # Backend route for order processing
│       │   └── products/   # Backend route for product catalog
│       ├── globals.css     # Design tokens and responsive styles
│       ├── layout.js       # App root layout & SEO metadata
│       └── page.js         # Landing page & store logic
├── package.json
└── test-endpoints.mjs      # Endpoint verification script
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

### Verification Script

Run the automated endpoint test suite:

```bash
node test-endpoints.mjs
```

---

## Contact & Inquiries

- **Brand**: Saasu Maa's Food
- **Phone / WhatsApp**: [+91 8979319003](tel:8979319003)
- **DM for Booking**: 8979319003
