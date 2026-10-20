import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "The cookies and local storage Levi Music uses, and how to change your choices under the Kenya Data Protection Act 2019.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      eyebrow="Small files, clear rules"
      title="Cookie policy"
      updated="12 October 2026"
      active="/legal/cookie-policy"
    >
      <p>
        Cookies and local storage help Levi Music remember your session, your player settings and
        your consent choices. This page lists what we use and how you can change your mind.
      </p>

      <h2>Your choice</h2>
      <p>
        On your first visit a banner asks whether to accept all cookies, save your own preferences,
        or allow only what is necessary. Your choice is stored in your browser under the key{" "}
        <strong>levi_music_consent</strong>. You can reopen preferences by clearing that key in
        your browser storage and reloading the site.
      </p>

      <h2>Categories</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">What it does</th>
            <th scope="col">Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Necessary</td>
            <td>
              Sign in session, security checks, consent record, and reCAPTCHA tokens that protect
              our forms.
            </td>
            <td>Always on</td>
          </tr>
          <tr>
            <td>Functional</td>
            <td>
              Remembers volume, the last track played, saved tracks and followed artists on this
              device.
            </td>
            <td>Off until accepted</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td>
              Anonymous play counts and page performance through Vercel Analytics and Speed
              Insights, used to improve discovery.
            </td>
            <td>Off until accepted</td>
          </tr>
          <tr>
            <td>Marketing</td>
            <td>
              Measures release announcements and artist campaigns. We do not run third party ad
              networks.
            </td>
            <td>Off until accepted</td>
          </tr>
        </tbody>
      </table>

      <h2>Local storage keys</h2>
      <ul>
        <li><strong>levi_music_consent</strong>: your cookie choices and the date you made them.</li>
        <li><strong>levi_music_saved_tracks</strong>: track ids you added to your playlist.</li>
        <li><strong>levi_music_followed_artists</strong>: artist usernames you follow.</li>
        <li><strong>levi_music_recent_plays</strong>: tracks played on this device.</li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Google reCAPTCHA v3 runs on our forms and may set cookies to tell humans from bots. Vercel
        provides hosting, analytics and file storage. Both act as processors under our
        instructions. Their own privacy notices apply to the data they process.
      </p>

      <h2>Changing your mind</h2>
      <p>
        Clear site data for levi.music in your browser settings, then reload the site to see the
        banner again. Blocking necessary cookies will stop sign in and the player from working.
      </p>

      <p>
        Questions about cookies go to the Levi Music team on WhatsApp at +254 112 272 061. See also
        the <Link href="/legal/privacy-policy">privacy policy</Link> and{" "}
        <Link href="/legal/terms">terms of service</Link>.
      </p>
    </LegalLayout>
  );
}
