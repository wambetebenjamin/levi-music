import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Levi Music collects, uses and protects personal data under the Kenya Data Protection Act 2019.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      eyebrow="Your data, your rights"
      title="Privacy policy"
      updated="12 October 2026"
      active="/legal/privacy-policy"
    >
      <p>
        Levi Music is a music streaming and artist discovery platform built for East Africa. This
        policy explains what we collect, why we collect it, and the choices you have. We handle
        personal data in line with the Kenya Data Protection Act 2019 and the principles of the
        Office of the Data Protection Commissioner.
      </p>

      <h2>Who we are</h2>
      <p>
        Levi Music is the data controller for this service. You can reach us on WhatsApp at +254
        112 272 061 for any privacy question, including requests to access, correct or delete your
        data.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Account details: name, email address, password hash, account type (listener or artist).</li>
        <li>Google sign in details: your name, email and profile image, shared by Google when you choose that option.</li>
        <li>Listening activity: tracks played, saved and followed, used to build your recent history and charts.</li>
        <li>Artist content: uploaded audio, cover art, lyrics, release dates and explicit content labels.</li>
        <li>Payment details for artist payouts and M-Pesa tips: the phone number and amount needed to complete the transaction. We never store your M-Pesa PIN.</li>
        <li>Technical data: device type, browser, approximate region and pages visited, used for security and performance.</li>
        <li>Security signals from Google reCAPTCHA v3, used to stop automated abuse of forms.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To provide streaming, playlists and artist discovery.</li>
        <li>To calculate play counts, chart positions and artist earnings.</li>
        <li>To process tips and payouts and to meet tax and record keeping duties.</li>
        <li>To keep the platform secure, investigate abuse and enforce our terms.</li>
        <li>To send service messages and, only with your consent, release announcements.</li>
      </ul>

      <h2>Legal bases</h2>
      <p>
        We rely on contract performance for streaming and artist payouts, consent for marketing
        and optional cookies, legitimate interest for security and fraud prevention, and legal
        obligation for financial records.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We use necessary cookies to keep you signed in and functional storage to remember your
        player volume and saved tracks. Analytics and marketing cookies are off unless you accept
        them. Your choice is stored under the key levi_music_consent. See the{" "}
        <Link href="/legal/cookie-policy">cookie policy</Link> for the full list.
      </p>

      <h2>Sharing</h2>
      <p>
        We share data with processors who help us run the platform: hosting and storage, email
        delivery, security checks, and payment partners including M-Pesa. We do not sell personal
        data. We may disclose data where required by Kenyan law or a valid court order.
      </p>

      <h2>Retention</h2>
      <p>
        Account data is kept while your account is active and for 12 months after closure, unless
        a longer period is required for financial records. Play records are retained in aggregate
        so artist earnings remain auditable.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>Access a copy of the personal data we hold about you.</li>
        <li>Correct inaccurate or incomplete data.</li>
        <li>Request deletion where we no longer need the data.</li>
        <li>Object to or restrict certain processing, including marketing.</li>
        <li>Withdraw consent for optional cookies at any time.</li>
        <li>Lodge a complaint with the Office of the Data Protection Commissioner in Kenya.</li>
      </ul>

      <h2>Children</h2>
      <p>
        Levi Music is not directed at children under 13. If you believe a child has created an
        account, contact us and we will remove it.
      </p>

      <h2>Changes</h2>
      <p>
        We will post any update on this page and change the date above. Material changes will be
        announced in the product or by email.
      </p>
    </LegalLayout>
  );
}
