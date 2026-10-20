import Link from "next/link";
import { Logo } from "@/components/Logo";
import { genres } from "@/lib/data";
import { siteConfig, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="levi-footer">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="levi-footer-brand">
              <Logo />
            </div>
            <p className="levi-footer-tagline">
              {siteConfig.tagline} Levi Music is built in East Africa, for East Africa.
            </p>
            <p>
              <a className="levi-footer-link" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp +254 112 272 061
              </a>
            </p>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h4>Genres</h4>
            <ul>
              {genres.slice(0, 5).map((genre) => (
                <li key={genre.slug}>
                  <Link href={`/music?genre=${genre.slug}`}>{genre.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h4>More genres</h4>
            <ul>
              {genres.slice(5).map((genre) => (
                <li key={genre.slug}>
                  <Link href={`/music?genre=${genre.slug}`}>{genre.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/music">All music</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h4>Artists</h4>
            <ul>
              <li>
                <Link href="/auth/signup?role=artist">Artist signup</Link>
              </li>
              <li>
                <Link href="/upload">Upload music</Link>
              </li>
              <li>
                <Link href="/artists">Artist directory</Link>
              </li>
              <li>
                <Link href="/dashboard/artist">Artist dashboard</Link>
              </li>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/legal/privacy-policy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/legal/terms">Terms of service</Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy">Cookie policy</Link>
              </li>
              <li>
                <Link href="/player">Player</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="levi-footer-bottom">
          <span>
            {year} Levi Music. Streaming and artist discovery for East Africa. All rights reserved.
          </span>
          <span>
            Nairobi, Kenya. <Link href="/legal/privacy-policy">Kenya Data Protection Act 2019</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
