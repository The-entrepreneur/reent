import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reent.vercel.app"),
  title: "Reent - Join the Waitlist | #1 Home Rental Marketplace",
  description:
    "Be the first to experience Reent - Because finding, renting, and managing properties in Nigeria should be effortless — and with Reent, it finally is.",
  keywords: [
    "waitlist",
    "property rental",
    "Nigeria",
    "real estate",
    "early access",
    "rental platform",
    "property management",
    "Nigerian real estate",
  ],
  authors: [{ name: "Reent" }],
  creator: "Reent",
  publisher: "Reent",

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Reent - Join the Waitlist | #1 Home Rental Marketplace",
    description:
      "Built for Nigeria. Designed for trust. Powered by innovation. Join thousands already waiting for the future of property rental.",
    url: "https://reent.vercel.app",
    siteName: "Reent",
    images: [
      {
        url: "/assets/soc-preview2.png",
        width: 1200,
        height: 630,
        alt: "Reent - #1 Home Rental Marketplace",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Reent - Join the Waitlist | #1 Home Rental Marketplace",
    description:
      "Built for Nigeria. Designed for trust. Powered by innovation. Join the future of property rental.",
    creator: "@Reent_App",
    images: ["/assets/soc-preview2.png"],
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/assets/favicon/Favicon-Yvr-A512%20x%20512.svg",
    shortcut: "/assets/favicon/Favicon-Yvr-A512%20x%20512.svg",
    apple: "/assets/favicon/Favicon-Yvr-A512%20x%20512.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-white">{children}</body>
    </html>
  );
}
