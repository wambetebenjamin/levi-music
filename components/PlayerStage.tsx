"use client";

import Link from "next/link";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player-store";
import { formatTime } from "@/lib/utils";
import { formatPlays, genreName } from "@/lib/data";
import type { Track } from "@/lib/types";

export function PlayerStage({ tracks }: { tracks: Track[] }) {
  const {
    current,
    queue,
    isPlaying,
    progress,
    duration,
    playTrack,
    toggle,
    next,
    previous,
  } = usePlayer();

  const active = current ?? tracks[0];
  const list = queue.length ? queue : tracks;

  return (
    <>
      <div className="levi-player-stage">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.cover} alt={`${active.title} cover art`} width={280} height={280} />
        </div>
        <div>
          <p className="levi-eyebrow">{current ? "Now playing" : "Ready when you are"}</p>
          <h1 className="levi-player-title">{active.title}</h1>
          <p style={{ fontSize: 15, marginBottom: 24 }}>
            <Link href={`/artists/${active.artistUsername}`}>{active.artistName}</Link> /{" "}
            {genreName(active.genre)} / {formatPlays(active.plays)} plays
          </p>

          <input
            className="levi-range"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(progress, duration || 0)}
            readOnly
            aria-label="Track progress"
            aria-valuetext={`${formatTime(progress)} of ${formatTime(duration)}`}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              letterSpacing: 1,
              color: "var(--levi-secondary)",
              marginTop: 8,
            }}
          >
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="levi-detail-actions" style={{ marginTop: 26, marginBottom: 0 }}>
            <button type="button" className="levi-icon-btn" onClick={previous} aria-label="Previous track">
              <SkipBack size={17} />
            </button>
            <button
              type="button"
              className="btn oneMusic-btn"
              onClick={() => {
                if (!current) {
                  playTrack(active, list);
                } else {
                  toggle();
                }
              }}
            >
              {isPlaying ? (
                <Pause size={16} aria-hidden="true" style={{ marginRight: 8 }} />
              ) : (
                <Play size={16} aria-hidden="true" style={{ marginRight: 8 }} />
              )}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button type="button" className="levi-icon-btn" onClick={next} aria-label="Next track">
              <SkipForward size={17} />
            </button>
          </div>
          <p className="levi-note mt-30">
            Audio streams from Vercel Blob through a plain HTML5 audio element. Controls here stay
            in sync with the mini player on every page.
          </p>
        </div>
      </div>

      <div className="levi-queue">
        {list.slice(0, 10).map((track) => (
          <button
            key={track.id}
            type="button"
            className={`levi-queue-row ${current?.id === track.id ? "is-active" : ""}`}
            onClick={() => playTrack(track, list)}
            aria-label={`Play ${track.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={track.cover} alt="" width={44} height={44} />
            <div className="levi-queue-info">
              <h6>{track.title}</h6>
              <p>{track.artistName}</p>
            </div>
            <span className="levi-disc-plays">{formatPlays(track.plays)} plays</span>
            <span className="levi-disc-plays">{track.duration}</span>
          </button>
        ))}
      </div>
    </>
  );
}
