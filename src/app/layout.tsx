import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bostonblore.com"),
  title: {
    default: "Boston Blore | Natural IFBB Competitor & Online Coach",
    template: "%s | Boston Blore",
  },
  description:
    "100% natural IFBB competitor and National Pro Qualifier. In-person personal training in Lloydminster, AB, plus online coaching, custom training splits and nutrition plans worldwide.",
  keywords: [
    "personal trainer Lloydminster",
    "natural bodybuilding coach",
    "online fitness coaching",
    "IFBB competitor",
    "nutrition coach",
    "Boston Blore",
  ],
  openGraph: {
    title: "Boston Blore | Natural IFBB Competitor & Online Coach",
    description:
      "Drug-free results from a competitive natural athlete. Online training & nutrition coaching, anywhere.",
    type: "website",
    images: ["/images/tnt-medal-frontdouble.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ink text-bone">
        {children}
      </body>
    </html>
  );
}
