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
  metadataBase: new URL("https://www.bostonblore.com"),
  title: {
    default: "Boston Blore | Classic & Open Bodybuilder & Online Coach",
    template: "%s | Boston Blore",
  },
  description:
    "Classic & open bodybuilder and National Pro Qualifier. In-person personal training by enquiry, plus online coaching, custom training splits and nutrition plans worldwide.",
  keywords: [
    "online personal trainer",
    "classic and open bodybuilder",
    "online fitness coaching",
    "bodybuilding coach",
    "nutrition coach",
    "Boston Blore",
  ],
  openGraph: {
    title: "Boston Blore | Classic & Open Bodybuilder & Online Coach",
    description:
      "Online training & nutrition coaching, anywhere.",
    type: "website",
    url: "https://www.bostonblore.com",
    images: ["/images/tnt-medal-frontdouble.jpg"],
  },
  alternates: {
    canonical: "https://www.bostonblore.com",
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
