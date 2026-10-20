import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { auth } from "@/lib/auth";
import { HeaderNav } from "@/components/HeaderNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CookieConsent } from "@/components/CookieConsent";
import { MiniPlayer } from "@/components/MiniPlayer";
import { VoiceTour } from "@/components/VoiceTour";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://levi.music";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Levi Music. Stream East Africa. Support your artists.",
    template: "%s. Levi Music",
  },
  description: siteConfig.description,
  keywords: [
    "East African music",
    "stream Kenyan music",
    "Afrobeats",
    "Gengetone",
    "Benga",
    "Gospel",
    "Bongo Flava",
    "artist upload",
  ],
  icons: {
    icon: "/img/core-img/favicon.ico",
  },
  openGraph: {
    title: "Levi Music. Stream East Africa. Support your artists.",
    description: siteConfig.description,
    url: siteUrl,
    siteName: "Levi Music",
    images: [{ url: "/images/hero-performer.jpg", width: 500, height: 333 }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Levi Music. Stream East Africa. Support your artists.",
    description: siteConfig.description,
    images: ["/images/hero-performer.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <html lang="en-KE">
      <body>
        <a href="#main-content" className="levi-skip-link">
          Skip to main content
        </a>
        <Preloader />
        <SmoothScroll />
        <HeaderNav
          user={user ? { role: user.role, name: user.name ?? "Account" } : null}
        />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <MiniPlayer />
        <VoiceTour />
        <WhatsAppButton />
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
