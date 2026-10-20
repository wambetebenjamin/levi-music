"use client";

import { useEffect, useState } from "react";

/**
 * Preloader reproduced from the uploaded One Music theme:
 * the .lds-ellipsis four dot loader from style.css and index.html.
 * It is dismissed shortly after hydration, with a hard ceiling so it
 * never blocks the page.
 */
export function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const minTimer = window.setTimeout(() => setHidden(true), 700);
    const maxTimer = window.setTimeout(() => setHidden(true), 3000);
    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="preloader d-flex align-items-center justify-content-center"
      role="status"
      aria-live="polite"
      aria-label="Loading Levi Music"
    >
      <div className="lds-ellipsis" aria-hidden="true">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className="sr-only">Loading Levi Music.</span>
    </div>
  );
}
