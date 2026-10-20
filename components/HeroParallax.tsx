"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = ref.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.to(element, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <div className="levi-hero-media" ref={ref} aria-hidden="true">
      {children}
    </div>
  );
}
