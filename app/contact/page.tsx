import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Levi Music team about streaming, artist uploads, payouts or partnerships. WhatsApp +254 112 272 061.",
};

export default function ContactPage() {
  return (
    <div className="levi-page">
      <PageHero
        eyebrow="We are in Nairobi"
        title="Get in touch"
        image="/images/cover-5.jpg"
        small
      />

      <section className="levi-section">
        <div className="container">
          <div className="levi-two-col">
            <div>
              <div className="section-heading levi-left">
                <p>Send a message</p>
                <h2>Talk to the team</h2>
              </div>
              <ContactForm />
            </div>

            <div>
              <div className="levi-about-box">
                <h3>WhatsApp</h3>
                <p>
                  Fastest route for artists, listeners and partners. We reply within working
                  hours, Monday to Saturday, 8am to 7pm East African Time.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn oneMusic-btn levi-btn-sm"
                >
                  +254 112 272 061
                </a>
              </div>

              <div className="levi-about-box mt-50">
                <h3>Artist support</h3>
                <p>
                  Uploading for the first time? Send us the track link, cover art and your payout
                  number and the artist team will walk you through the release.
                </p>
              </div>

              <div className="levi-about-box mt-50">
                <h3>Data requests</h3>
                <p>
                  Ask for a copy of your data, correction, or deletion under the Kenya Data
                  Protection Act 2019. We respond within 14 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
