"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/lib/player-store";
import { formatPlays, genreName } from "@/lib/data";
import type { Track } from "@/lib/types";

export function TrackCard({
  track,
  queue,
  showGenre = true,
}: {
  track: Track;
  queue?: Track[];
  showGenre?: boolean;
}) {
  const { current, isPlaying, playTrack, toggle } = usePlayer();
  const isCurrent = current?.id === track.id;

  const onPlay = () => {
    if (isCurrent) {
      toggle();
      return;
    }
    playTrack(track, queue ?? [track]);
  };

  return (
    <motion.article
      className="levi-track-card"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="levi-track-thumb">
        {showGenre && <span className="levi-track-genre">{genreName(track.genre)}</span>}
        <Link href={`/music/${track.slug}`} aria-label={`Open ${track.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={track.cover} alt={`${track.title} cover art`} width={400} height={400} />
          <span className="levi-thumb-overlay" aria-hidden="true" />
        </Link>
        <button
          type="button"
          className={`levi-play-btn ${isCurrent && isPlaying ? "is-active" : ""}`}
          onClick={onPlay}
          aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title} by ${track.artistName}`}
        >
          {isCurrent && isPlaying ? (
            <Pause size={18} aria-hidden="true" />
          ) : (
            <Play size={18} aria-hidden="true" />
          )}
        </button>
      </div>
      <div className="levi-track-body">
        <h5>
          <Link href={`/music/${track.slug}`}>{track.title}</Link>
        </h5>
        <p className="levi-track-artist">
          <Link
            href={`/artists/${track.artistUsername}`}
            style={{ fontSize: 14, fontWeight: 400, color: "inherit" }}
          >
            {track.artistName}
          </Link>
        </p>
        <div className="levi-track-meta">
          <span>{formatPlays(track.plays)} plays</span>
          <span className="levi-duration-tag">{track.duration}</span>
        </div>
      </div>
    </motion.article>
  );
}
