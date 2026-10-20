"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import type { Track } from "@/lib/types";

const KEY = "levi_music_saved_tracks";

export function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function SaveTrackButton({ track }: { track: Track }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(track.id));
  }, [track.id]);

  const toggle = () => {
    const list = readSaved();
    const next = list.includes(track.id)
      ? list.filter((id) => id !== track.id)
      : [track.id, ...list];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked */
    }
    setSaved(next.includes(track.id));
  };

  return (
    <button
      type="button"
      className="btn oneMusic-btn levi-btn-sm"
      onClick={toggle}
      aria-pressed={saved}
    >
      {saved ? (
        <Check size={15} aria-hidden="true" style={{ marginRight: 8 }} />
      ) : (
        <Bookmark size={15} aria-hidden="true" style={{ marginRight: 8 }} />
      )}
      {saved ? "Saved to playlist" : "Add to playlist"}
    </button>
  );
}
