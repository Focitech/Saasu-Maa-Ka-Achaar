import "./globals.css";

export const metadata = {
  title: "सासू माँ का अचार | Saasu Maa Ka Achaar - Homemade Goodness, Crafted with Love",
  description: "Authentic homemade Indian pickles made with traditional recipes, cold-pressed mustard oil, and pure spices. Aam, Nimbu, Mix, Hari Mirch, Lahsun and more.",
  keywords: ["सासू माँ का अचार", "Saasu Maa Ka Achaar", "Homemade Pickles", "Mango Pickle", "Desi Achaar", "Indian Pickles Online"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi-IN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.jpg" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
