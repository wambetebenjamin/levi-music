import Link from "next/link";
import { PageHero } from "@/components/PageHero";

const links = [
  { href: "/legal/privacy-policy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/cookie-policy", label: "Cookie policy" },
];

export function LegalLayout({
  title,
  eyebrow,
  updated,
  active,
  children,
}: {
  title: string;
  eyebrow: string;
  updated: string;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="levi-page">
      <PageHero eyebrow={eyebrow} title={title} image="/images/cover-6.jpg" small />

      <section className="levi-legal">
        <div className="container">
          <div className="levi-legal-layout">
            <nav className="levi-legal-nav" aria-label="Legal pages">
              <h4>Legal</h4>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active === link.href ? "is-active" : undefined}
                  aria-current={active === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/">Home</Link>
            </nav>

            <article className="levi-prose">
              <p className="levi-updated">Last updated {updated}</p>
              {children}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
