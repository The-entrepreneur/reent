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
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Reent - Find Your Perfect Rental Property",
    template: "%s | Reent",
  },
  description:
    "Discover and rent the perfect property in Nigeria. Browse apartments, houses, and commercial spaces with Reent - your trusted rental marketplace.",
  keywords: [
    "rental",
    "property",
    "Nigeria",
    "apartment",
    "house",
    "real estate",
  ],
  authors: [{ name: "Reent" }],
  openGraph: {
    title: "Reent - Find Your Perfect Rental Property",
    description: "Discover and rent the perfect property in Nigeria",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gray-50">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
