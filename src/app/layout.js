import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://saasumaasfood.site"),

  title: {
    default: "Saasu Maa Ka Achaar | Best Homemade Achar in Bareilly, UP | सासू माँ का अचार",
    template: "%s | Saasu Maa Ka Achaar - Bareilly",
  },

  description:
    "Saasu Maa Ka Achaar — Best homemade pickles in Bareilly, Uttar Pradesh. Order authentic aam, lahsun, nimbu, hari mirch & karonda achaar online. Pure mustard oil, no preservatives. Delivery across Bareilly, Lucknow, Agra, Kanpur, Prayagraj, Varanasi and all of UP & India.",

  keywords: [
    // Brand + product
    "Saasu Maa Ka Achaar",
    "सासू माँ का अचार",
    "homemade achar",
    "ghar ka achaar",
    "desi achaar",
    "best homemade pickle",
    "pure mustard oil pickle",
    "no preservative pickle",
    // Bareilly specific
    "achar in Bareilly",
    "achaar Bareilly",
    "homemade pickle Bareilly",
    "ghar ka achar Bareilly",
    "best achar Bareilly UP",
    "Bareilly homemade food",
    "Bareilly pickle delivery",
    "pickle shop Bareilly",
    "achar order Bareilly",
    // UP cities
    "achar Lucknow",
    "pickle Lucknow",
    "achar Kanpur",
    "achar Agra",
    "pickle Agra",
    "achar Prayagraj",
    "achar Varanasi",
    "pickle Varanasi",
    "achar Mathura",
    "achar Aligarh",
    "achar Moradabad",
    "achar Meerut",
    "pickle UP",
    "homemade achar Uttar Pradesh",
    "UP me achar",
    // Product keywords
    "aam ka achar",
    "mango pickle online",
    "lahsun achar",
    "garlic pickle",
    "nimbu achar",
    "lemon pickle",
    "hari mirch ka achar",
    "green chilli pickle",
    "karonda achar",
    "lal mirch achar",
    "mix achar",
    "meetha achar",
    // Intent
    "order achar online India",
    "homemade pickle delivery",
    "ghar ki maa ka achar",
    "traditional Indian pickle",
    "desi ghar ka khana",
  ],

  authors: [{ name: "Sandhya — Saasu Maa's Food", url: "https://saasumaasfood.site" }],
  creator: "Saasu Maa's Food",
  publisher: "Saasu Maa's Food",

  alternates: {
    canonical: "https://saasumaasfood.site",
    languages: {
      "hi-IN": "https://saasumaasfood.site",
      "en-IN": "https://saasumaasfood.site",
    },
  },

  openGraph: {
    type: "website",
    locale: "hi_IN",
    alternateLocale: "en_IN",
    url: "https://saasumaasfood.site",
    siteName: "Saasu Maa Ka Achaar",
    title: "Saasu Maa Ka Achaar | Best Homemade Achar in Bareilly & UP",
    description:
      "Authentic ghar ka achaar from Bareilly, UP. Pure mustard oil, no preservatives. Aam, Lahsun, Nimbu, Hari Mirch, Karonda. Order now — delivery across Bareilly, UP & all India.",
    images: [
      {
        url: "/images/brand-poster.png",
        width: 1200,
        height: 630,
        alt: "Saasu Maa Ka Achaar - Homemade Pickles Bareilly UP",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Saasu Maa Ka Achaar | Homemade Pickle Bareilly UP",
    description:
      "Best ghar ka achaar from Bareilly, UP. Order aam, lahsun, nimbu, hari mirch pickles online. No preservatives, pure mustard oil. Delivery across UP & India.",
    images: ["/images/brand-poster.png"],
    creator: "@SaasuMaasFood",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Add Google Search Console verification token here when available
    // google: "YOUR_VERIFICATION_TOKEN",
  },

  category: "food",

  other: {
    // Geo targeting for Bareilly, Uttar Pradesh
    "geo.region": "IN-UP",
    "geo.placename": "Bareilly, Uttar Pradesh, India",
    "geo.position": "28.3670;79.4304",
    ICBM: "28.3670, 79.4304",
    // Language
    "content-language": "hi-IN, en-IN",
    // Rating
    rating: "general",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi-IN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.jpg" />
        <link rel="apple-touch-icon" href="/images/logo.jpg" />
        <meta name="theme-color" content="#44070e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=yes" />
        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
