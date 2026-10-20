"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/lib/player-store";
import { formatPlays, genreName } from "@/lib/data";
import { formatDate } from "@/lib/site";
import type { Track } from "@/lib/types";

export function DiscographyList({ tracks }: { tracks: Track[] }) {
  const { current, isPlaying, playTrack, toggle } = usePlayer();

  if (!tracks.length) {
    return (
      <div className="levi-empty">
        <h3>No uploads yet</h3>
        <p>This artist has not published a track on Levi Music yet.</p>
      </div>
    );
  }

  return (
    <div className="levi-discography">
      {tracks.map((track) => {
        const isCurrent = current?.id === track.id;
        return (
          <div className="levi-disc-row" key={track.id}>
            <button
              type="button"
              className={`levi-chart-play ${isCurrent && isPlaying ? "is-active" : ""}`}
              onClick={() => (isCurrent ? toggle() : playTrack(track, tracks))}
              aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title}`}
            >
              {isCurrent && isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <div>
              <h6>
                <Link href={`/music/${track.slug}`}>{track.title}</Link>
              </h6>
              <p>
                {genreName(track.genre)} / {formatDate(track.releaseDate)}
                {track.explicit ? " / Explicit" : ""}
              </p>
            </div>
            <span className="levi-disc-plays">{formatPlays(track.plays)} plays</span>
            <span className="levi-disc-plays">{track.duration}</span>
            <Link href={`/music/${track.slug}`} className="levi-icon-btn" aria-label={`Open ${track.title}`}>
              <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
                &rarr;
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
