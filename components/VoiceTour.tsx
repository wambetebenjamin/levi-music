"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { voiceTourScript } from "@/lib/site";

export function VoiceTour() {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [replay, setReplay] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceTourScript);
    utterance.rate = 0.97;
    utterance.pitch = 1.12;
    utterance.lang = "en-KE";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setReplay(true);
    };
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setReplay(true);
  }, []);

  // First scroll or click triggers the tour once, never before user intent.
  useEffect(() => {
    if (autoRef.current || !supported) return;

    const trigger = (event: Event) => {
      if (autoRef.current) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest(".levi-voice")) return;
      autoRef.current = true;
      cleanup();
      speak();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
      window.removeEventListener("keydown", trigger);
    };

    window.addEventListener("scroll", trigger, { once: true, passive: true });
    window.addEventListener("click", trigger, { once: true });
    window.addEventListener("keydown", trigger, { once: true });

    return cleanup;
  }, [speak, supported]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const onClick = () => {
    if (speaking) {
      stop();
      return;
    }
    speak();
  };

  const label = speaking
    ? "Site voice tour, click to mute"
    : replay
      ? "Replay tour"
      : "Site voice tour, click to play";

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`levi-float levi-voice ${speaking ? "is-speaking" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={speaking}
      title={speaking ? "Mute the tour" : "Hear what this site is about"}
    >
      <span className="levi-tooltip">
        {speaking ? "Tap to mute the tour" : replay ? "Replay tour" : "Hear what this site is about"}
      </span>
      <span className="levi-voice-icon" aria-hidden="true">
        {speaking ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </span>
    </button>
  );
}
