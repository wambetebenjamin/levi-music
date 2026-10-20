import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`levi-nav-logo ${className}`} aria-label="Levi Music home">
      <span className="mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="wordmark">
        Levi Music
        <small>Stream East Africa</small>
      </span>
    </Link>
  );
}
