import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Free Consult",
  description: "Book a free consult or ask a question about coaching with Boston Blore.",
};

export default function ContactPage() {
  return (
    <Section>
      <div className="grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title={<>Let's build your <span className="fire-text">plan</span></>}
            intro="Tell me about your goals and I'll point you to the right starting place. Free, no-pressure consult."
          />
          <div className="mt-8 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-ash">Email</p>
              <a href={`mailto:${site.email}`} className="text-lg font-medium hover:text-ember">{site.email}</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ash">Instagram</p>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="text-lg font-medium hover:text-ember">
                {site.instagramHandle}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ash">In-Person Training</p>
              <p className="text-lg font-medium">{site.location}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-ink-600 bg-ink-700 p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
