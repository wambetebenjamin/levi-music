"use client";

import { useEffect, useState } from "react";
import { Heart, Check } from "lucide-react";
import { SupportModal } from "@/components/SupportModal";
import type { Artist } from "@/lib/types";

const KEY = "levi_music_followed_artists";

export function ArtistActions({ artist }: { artist: Artist }) {
  const [following, setFollowing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setFollowing(list.includes(artist.username));
    } catch {
      setFollowing(false);
    }
  }, [artist.username]);

  const toggleFollow = () => {
    let list: string[] = [];
    try {
      const raw = window.localStorage.getItem(KEY);
      list = raw ? JSON.parse(raw) : [];
    } catch {
      list = [];
    }
    const next = list.includes(artist.username)
      ? list.filter((name) => name !== artist.username)
      : [artist.username, ...list];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked */
    }
    setFollowing(next.includes(artist.username));
  };

  return (
    <>
      <div className="levi-detail-actions" style={{ marginBottom: 0 }}>
        <button
          type="button"
          className={`btn oneMusic-btn ${following ? "levi-btn-light" : "levi-btn-on-dark"}`}
          onClick={toggleFollow}
          aria-pressed={following}
        >
          {following ? (
            <Check size={16} aria-hidden="true" style={{ marginRight: 8 }} />
          ) : (
            <Heart size={16} aria-hidden="true" style={{ marginRight: 8 }} />
          )}
          {following ? "Following" : "Follow"}
        </button>
        <button
          type="button"
          className="btn oneMusic-btn levi-btn-on-dark"
          onClick={() => setOpen(true)}
        >
          <Heart size={16} aria-hidden="true" style={{ marginRight: 8 }} />
          Support artist
        </button>
      </div>
      <SupportModal artist={artist} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
