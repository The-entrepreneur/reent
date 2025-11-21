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
  metadataBase: new URL("http://localhost:3001"),
  title: "Reent - Join the Waitlist | Property Rental Marketplace",
  description:
    "Be the first to experience Reent - Because finding, renting, and managing properties in Nigeria should be effortless — and with Reent, it finally is.",
  keywords: [
    "waitlist",
    "property rental",
    "Nigeria",
    "real estate",
    "early access",
  ],
  authors: [{ name: "Reent" }],
  openGraph: {
    title: "Reent - Join the Waitlist | Property Rental Marketplace",
    description:
      "Built for Nigeria. Designed for trust. Powered by innovation.",
    type: "website",
    locale: "en_NG",
  },
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
