"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { SessionUser } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/artists", label: "Artists" },
  { href: "/upload", label: "Upload" },
];

export function HeaderNav({ user }: { user: Pick<SessionUser, "role" | "name"> | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dashboardHref = user?.role === "artist" ? "/dashboard/artist" : "/dashboard/listener";
  // Guests are taken to the live charts, signed in users to their workspace.
  const chartHref = user ? dashboardHref : "/music?sort=trending";

  const navLink = (href: string, label: string) => (
    <li key={href}>
      <Link
        href={href}
        className={
          href === "/" ? (pathname === "/" ? "levi-nav-active" : undefined) : pathname.startsWith(href) ? "levi-nav-active" : undefined
        }
      >
        {label}
      </Link>
    </li>
  );

  return (
    <header className="levi-header">
      <div className="container">
        <div className="levi-nav-bar">
          <Logo />

          <nav aria-label="Main navigation" className="levi-nav-desktop">
            <ul>
              {links.map((link) => navLink(link.href, link.label))}
              {navLink(chartHref, user ? "Dashboard" : "Charts")}
            </ul>
          </nav>

          <div className="levi-header-actions">
            <Link
              href={user ? dashboardHref : "/auth/signin"}
              className="levi-header-link"
            >
              {user ? user.name?.split(" ")[0] ?? "Account" : "Sign in"}
            </Link>
            <Link
              href={user?.role === "artist" ? "/upload" : "/auth/signup?role=artist"}
              className="btn oneMusic-btn levi-header-cta"
            >
              Upload music
            </Link>
            <button
              type="button"
              className="levi-nav-toggle"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="levi-drawer" role="dialog" aria-label="Menu">
          <div className="levi-drawer-head">
            <Logo />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <ul className="levi-drawer-list">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={pathname === link.href ? "is-active" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={chartHref} onClick={() => setOpen(false)}>
                {user ? "Dashboard" : "Top charts"}
              </Link>
            </li>
            <li>
              <Link href={user ? dashboardHref : "/auth/signin"} onClick={() => setOpen(false)}>
                {user ? user.name : "Sign in"}
              </Link>
            </li>
            <li>
              <Link href="/auth/signup?role=artist" onClick={() => setOpen(false)}>
                Create artist account
              </Link>
            </li>
          </ul>
          <p className="levi-drawer-foot">
            WhatsApp +254 112 272 061
            <br />
            Nairobi, Kenya
          </p>
        </div>
      )}
    </header>
  );
}
