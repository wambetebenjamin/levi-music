"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/lib/player-store";
import { formatPlays, genreName } from "@/lib/data";
import type { ChartEntry } from "@/lib/types";

export function ChartList({ entries }: { entries: ChartEntry[] }) {
  const { current, isPlaying, playTrack, toggle } = usePlayer();
  const queue = entries.map((entry) => entry.track);

  return (
    <div className="levi-chart">
      {entries.map(({ rank, track }) => {
        const isCurrent = current?.id === track.id;
        return (
          <div className="levi-chart-row" key={track.id}>
            <span className="levi-chart-rank">{String(rank).padStart(2, "0")}</span>
            <Link href={`/music/${track.slug}`} className="levi-chart-cover" tabIndex={-1} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={track.cover} alt="" width={60} height={60} />
            </Link>
            <div className="levi-chart-info">
              <h6>
                <Link href={`/music/${track.slug}`}>{track.title}</Link>
              </h6>
              <p>
                <Link
                  href={`/artists/${track.artistUsername}`}
                  style={{ fontSize: 13, fontWeight: 400, color: "inherit" }}
                >
                  {track.artistName}
                </Link>{" "}
                <span aria-hidden="true">/</span> {genreName(track.genre)}
              </p>
            </div>
            <span className="levi-chart-plays">{formatPlays(track.plays)} plays</span>
            <button
              type="button"
              className={`levi-chart-play ${isCurrent && isPlaying ? "is-active" : ""}`}
              aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${track.title}`}
              onClick={() => {
                if (isCurrent) {
                  toggle();
                } else {
                  playTrack(track, queue);
                }
              }}
            >
              {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}
