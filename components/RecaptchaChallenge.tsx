"use client";

import { useEffect, useRef } from "react";
import { RECAPTCHA_SITE_KEY } from "@/components/recaptcha";

/**
 * Interactive reCAPTCHA v2 fallback. Rendered only when the server reports a
 * v3 score below 0.5, or when a v3 token is missing. The checkbox token is
 * verified on the same server route with the same secret.
 */
export function RecaptchaChallenge({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (renderedRef.current) return;

    const render = () => {
      const container = containerRef.current;
      if (!container || !window.grecaptcha?.render || renderedRef.current) return;
      renderedRef.current = true;
      window.grecaptcha.render(container, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    if (window.grecaptcha?.render) {
      render();
      return;
    }

    window.__leviRecaptchaV2Ready = render;
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-levi-recaptcha-v2="true"]',
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://www.google.com/recaptcha/api.js?onload=__leviRecaptchaV2Ready&render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.leviRecaptchaV2 = "true";
      document.head.appendChild(script);
    }
  }, [onToken]);

  return (
    <div className="levi-input-group mb-30">
      <label>Security check</label>
      <div ref={containerRef} />
      <span className="levi-hint">
        Complete the checkbox so we can confirm this request is genuine, then submit again.
      </span>
    </div>
  );
}
