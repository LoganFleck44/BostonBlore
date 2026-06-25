import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: site.name,
  description:
    "100% natural IFBB competitor and National Pro Qualifier offering online training, nutrition coaching, and in-person personal training.",
  areaServed: "Worldwide",
  address: { "@type": "PostalAddress", addressLocality: "Lloydminster", addressRegion: "AB", addressCountry: "CA" },
  email: site.email,
  sameAs: [site.instagram],
  url: "https://bostonblore.com",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
