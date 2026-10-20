"use client";

import { Bookmark, Check, Pause, Play, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlayer } from "@/lib/player-store";
import { readSaved } from "@/components/SaveTrackButton";
import type { Track } from "@/lib/types";

const KEY = "levi_music_saved_tracks";

export function TrackActions({ track, queue }: { track: Track; queue: Track[] }) {
  const { current, isPlaying, playTrack, toggle } = usePlayer();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const isCurrent = current?.id === track.id;

  useEffect(() => {
    setSaved(readSaved().includes(track.id));
  }, [track.id]);

  const toggleSaved = () => {
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

  const shareUrl = () =>
    typeof window === "undefined" ? "" : `${window.location.origin}/music/${track.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const whatsapp = () => {
    const text = encodeURIComponent(`Listen to ${track.title} by ${track.artistName} on Levi Music ${shareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="levi-detail-actions">
      <button
        type="button"
        className={`btn oneMusic-btn ${isCurrent && isPlaying ? "btn-2" : ""}`}
        onClick={() => {
          if (isCurrent) {
            toggle();
          } else {
            playTrack(track, queue);
          }
        }}
        aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title}`}
      >
        {isCurrent && isPlaying ? (
          <Pause size={16} aria-hidden="true" style={{ marginRight: 8 }} />
        ) : (
          <Play size={16} aria-hidden="true" style={{ marginRight: 8 }} />
        )}
        {isCurrent && isPlaying ? "Playing" : "Play track"}
      </button>

      <button
        type="button"
        className="btn oneMusic-btn levi-btn-sm"
        onClick={toggleSaved}
        aria-pressed={saved}
      >
        {saved ? (
          <Check size={15} aria-hidden="true" style={{ marginRight: 8 }} />
        ) : (
          <Bookmark size={15} aria-hidden="true" style={{ marginRight: 8 }} />
        )}
        {saved ? "In your playlist" : "Add to playlist"}
      </button>

      <button type="button" className="btn oneMusic-btn levi-btn-sm" onClick={whatsapp}>
        <Share2 size={15} aria-hidden="true" style={{ marginRight: 8 }} />
        Share on WhatsApp
      </button>

      <button type="button" className="levi-icon-btn" onClick={copyLink} aria-label="Copy link to track">
        <Share2 size={17} />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
