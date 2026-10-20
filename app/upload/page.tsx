import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { UploadForm } from "@/components/UploadForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Upload your music",
  description:
    "Upload MP3 or WAV tracks to Levi Music. Add cover art, lyrics and release details, then track plays and earnings in your artist dashboard.",
};

export default async function UploadPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?next=/upload");
  }

  const isArtist = session.user.role === "artist";

  return (
    <div className="levi-page">
      <PageHero
        eyebrow={isArtist ? "Your next release starts here" : "Artist access"}
        title="Upload music"
        image="/images/cover-4.jpg"
      />

      <section className="levi-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              {isArtist ? (
                <UploadForm />
              ) : (
                <div className="levi-form-card">
                  <h2>Artist account required</h2>
                  <p className="levi-form-sub">
                    You are signed in as a listener. Create an artist account to upload music,
                    see play counts per track and withdraw earnings.
                  </p>
                  <div className="levi-detail-actions">
                    <Link href="/auth/signup?role=artist" className="btn oneMusic-btn">
                      Create artist account
                    </Link>
                    <Link href="/dashboard/listener" className="btn oneMusic-btn levi-btn-sm">
                      Go to listener dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-4">
              <div className="levi-about-box">
                <h3>Upload checklist</h3>
                <ul style={{ paddingLeft: 0 }}>
                  <li style={{ marginBottom: 12 }}>
                    Audio: MP3 or WAV, stereo, up to 20MB.
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    Cover art: square JPG or PNG, up to 5MB.
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    Lyrics are optional but help discovery and translation.
                  </li>
                  <li style={{ marginBottom: 12 }}>
                    Mark explicit tracks so family filters stay accurate.
                  </li>
                  <li style={{ marginBottom: 0 }}>
                    You keep your rights. Levi Music pays per play at the published rate.
                  </li>
                </ul>
              </div>
              <div className="levi-about-box mt-50">
                <h3>Need a hand?</h3>
                <p>
                  Talk to the artist team on WhatsApp for help with your first upload, cover art
                  or payout details.
                </p>
                <a
                  href="https://wa.me/254112272061?text=Hello%20Levi%20Music%2C%20I%20would%20like%20to%20ask%20about%20uploading%20music%20as%20an%20artist."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn oneMusic-btn levi-btn-sm"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
