"use client";

import Link from "next/link";
import { Music4 } from "lucide-react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-KE">
      <body>
        <div className="levi-error-page">
          <div className="levi-error-inner">
            <p className="levi-error-code">Error 500</p>
            <div className="levi-error-icon" aria-hidden="true">
              <Music4 size={34} />
            </div>
            <h1>Something went wrong</h1>
            <p>
              The stream dropped on our side, not yours. Try again, and if it keeps happening
              message us on WhatsApp at{" "}
              <a
                href="https://wa.me/254112272061"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                +254112272061
              </a>
              .
            </p>
            <div className="levi-error-actions">
              <button type="button" className="btn oneMusic-btn" onClick={reset}>
                Try Again
              </button>
              <Link href="/" className="btn oneMusic-btn">
                Back home
              </Link>
            </div>
          </div>
        </div>
        <span className="sr-only">{error.digest ? `Reference ${error.digest}` : ""}</span>
      </body>
    </html>
  );
}
