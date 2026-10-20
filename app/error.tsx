"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Music4 } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Levi Music error boundary", error);
  }, [error]);

  return (
    <div className="levi-error-page">
      <div className="levi-error-inner">
        <p className="levi-error-code">Error 500</p>
        <div className="levi-error-icon" aria-hidden="true">
          <Music4 size={34} />
        </div>
        <h1>Something went wrong</h1>
        <p>
          The stream dropped on our side, not yours. Try again, and if it keeps happening message
          us on WhatsApp at{" "}
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
  );
}
