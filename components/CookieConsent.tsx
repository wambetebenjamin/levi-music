"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

interface ConsentState {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const STORAGE_KEY = siteConfig.consentKey;

const defaultPrefs = {
  functional: true,
  analytics: true,
  marketing: false,
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (!stored) {
      setVisible(true);
      document.documentElement.setAttribute("data-consent", "open");
      return;
    }

    document.documentElement.removeAttribute("data-consent");
    try {
      const parsed = JSON.parse(stored) as ConsentState;
      setPrefs({
        functional: Boolean(parsed.functional),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      });
    } catch {
      /* ignore malformed consent payloads */
    }
  }, []);

  // Publish the banner height so the docked player and buttons never overlap it.
  useEffect(() => {
    if (!visible) {
      document.documentElement.style.setProperty("--consent-h", "0px");
      return;
    }
    const node = panelRef.current;
    if (!node) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        "--consent-h",
        `${Math.ceil(node.getBoundingClientRect().height)}px`,
      );
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, manage]);

  const persist = (next: typeof defaultPrefs) => {
    const payload: ConsentState = {
      necessary: true,
      ...next,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage can be blocked, consent still closes for the session */
    }
    document.documentElement.removeAttribute("data-consent");
    setVisible(false);
    setManage(false);
  };

  if (!visible) return null;

  return (
    <section
      ref={panelRef}
      className="levi-consent"
      aria-label="Cookie and privacy preferences"
      lang="en"
    >
      <div className="levi-prefs open" hidden={!manage}>
        <div className="levi-prefs-inner">
          <div className="levi-pref-row">
            <div>
              <strong>Necessary</strong>
              <p>
                Required to sign you in, keep your player state, and remember this consent
                choice. These cannot be switched off.
              </p>
            </div>
            <button type="button" className="levi-switch on" disabled aria-label="Necessary cookies are always on" />
          </div>
          <div className="levi-pref-row">
            <div>
              <strong>Functional</strong>
              <p>
                Remembers your volume, the last track you played, and saved tracks on this
                device.
              </p>
            </div>
            <button
              type="button"
              className={`levi-switch ${prefs.functional ? "on" : ""}`}
              role="switch"
              aria-checked={prefs.functional}
              aria-label="Functional cookies"
              onClick={() => setPrefs((p) => ({ ...p, functional: !p.functional }))}
            />
          </div>
          <div className="levi-pref-row">
            <div>
              <strong>Analytics</strong>
              <p>
                Anonymous play counts and page performance so we can improve discovery across
                the region.
              </p>
            </div>
            <button
              type="button"
              className={`levi-switch ${prefs.analytics ? "on" : ""}`}
              role="switch"
              aria-checked={prefs.analytics}
              aria-label="Analytics cookies"
              onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
            />
          </div>
          <div className="levi-pref-row">
            <div>
              <strong>Marketing</strong>
              <p>
                Used only if you agree to hear about new releases and artist campaigns. Off by
                default.
              </p>
            </div>
            <button
              type="button"
              className={`levi-switch ${prefs.marketing ? "on" : ""}`}
              role="switch"
              aria-checked={prefs.marketing}
              aria-label="Marketing cookies"
              onClick={() => setPrefs((p) => ({ ...p, marketing: !p.marketing }))}
            />
          </div>
        </div>
      </div>

      <div className="levi-consent-inner">
        <div className="levi-consent-copy">
          <h4>Cookies and your data</h4>
          <p>
            We use necessary cookies to run Levi Music and, with your permission, functional,
            analytics, and marketing cookies. You can change your mind at any time. Read the{" "}
            <Link href="/legal/cookie-policy">cookie policy</Link> and{" "}
            <Link href="/legal/privacy-policy">privacy policy</Link>, both aligned with the
            Kenya Data Protection Act 2019.
          </p>
        </div>
        <div className="levi-consent-actions">
          <button
            type="button"
            className="btn oneMusic-btn levi-btn-outline"
            onClick={() => setManage((v) => !v)}
            aria-expanded={manage}
          >
            {manage ? "Hide preferences" : "Manage preferences"}
          </button>
          {manage && (
            <button
              type="button"
              className="btn oneMusic-btn levi-btn-outline"
              onClick={() => persist(prefs)}
            >
              Save preferences
            </button>
          )}
          <button
            type="button"
            className="btn oneMusic-btn"
            onClick={() => persist({ functional: true, analytics: true, marketing: true })}
          >
            Accept all
          </button>
          <button
            type="button"
            className="btn oneMusic-btn levi-btn-outline"
            onClick={() => persist({ functional: false, analytics: false, marketing: false })}
          >
            Necessary only
          </button>
        </div>
      </div>
    </section>
  );
}
