"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { usePlayer } from "@/lib/player-store";
import { formatTime } from "@/lib/utils";

export function MiniPlayer() {
  const {
    current,
    isPlaying,
    volume,
    queue,
    toggle,
    next,
    previous,
    setVolume,
    setProgress,
    setDuration,
    close,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reportedRef = useRef<string | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setLocalDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  // Element is mounted once; the source follows the selected track.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;

    if (audio.src !== new URL(current.audio, window.location.origin).href) {
      audio.src = current.audio;
      audio.load();
      setTime(0);
      setLocalDuration(0);
    }
    if (isPlaying) {
      void audio.play().catch(() => {
        /* autoplay may be blocked until a gesture, the play button remains */
      });
    }
  }, [current, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!current) return;
    document.documentElement.setAttribute("data-player", "open");
    document.body.classList.add("levi-with-player");
    return () => {
      document.documentElement.removeAttribute("data-player");
      document.body.classList.remove("levi-with-player");
    };
  }, [current]);

  const reportPlay = (trackId: string) => {
    if (reportedRef.current === trackId) return;
    reportedRef.current = trackId;
    try {
      const raw = window.localStorage.getItem("levi_music_recent_plays");
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [trackId, ...list.filter((id) => id !== trackId)].slice(0, 12);
      window.localStorage.setItem("levi_music_recent_plays", JSON.stringify(next));
    } catch {
      /* storage blocked */
    }
    void fetch("/api/tracks/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId }),
    }).catch(() => undefined);
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!scrubbing) {
      setTime(audio.currentTime);
      setProgress(audio.currentTime);
    }
  };

  const onLoaded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number.isFinite(audio.duration) ? audio.duration : 0;
    setLocalDuration(value);
    setDuration(value);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(value)) return;
    audio.currentTime = value;
    setTime(value);
    setProgress(value);
  };

  const progressMax = duration || 0;
  const progressValue = scrubbing ? scrubValue : Math.min(time, progressMax || time);

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoaded}
        onEnded={next}
        onPlay={() => {
          if (current) reportPlay(current.id);
        }}
      />

      <AnimatePresence>
        {current && (
          <motion.div
            className="levi-mini-player"
            role="region"
            aria-label="Mini player"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <span className="levi-player-pulse" aria-hidden="true" />
            <Link href={`/music/${current.slug}`} className="levi-mp-cover" tabIndex={-1} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.cover} alt="" width={56} height={56} />
            </Link>

            <div className="levi-mp-info">
              <h6>
                <Link href={`/music/${current.slug}`} style={{ color: "inherit" }}>
                  {current.title}
                </Link>
              </h6>
              <p>
                <Link
                  href={`/artists/${current.artistUsername}`}
                  style={{ color: "inherit", fontSize: 12, fontWeight: 400 }}
                >
                  {current.artistName}
                </Link>
              </p>
            </div>

            <div className="levi-mp-controls">
              <button
                type="button"
                className="levi-mp-btn levi-skip-btn"
                onClick={previous}
                aria-label="Previous track"
                disabled={queue.length < 2}
              >
                <SkipBack size={16} />
              </button>
              <button
                type="button"
                className="levi-mp-btn main"
                onClick={toggle}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                type="button"
                className="levi-mp-btn levi-skip-btn"
                onClick={next}
                aria-label="Next track"
                disabled={queue.length < 2}
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="levi-mp-progress">
              <span className="levi-mp-time">{formatTime(scrubbing ? scrubValue : time)}</span>
              <input
                className="levi-range"
                type="range"
                min={0}
                max={progressMax || 0}
                step={0.1}
                value={progressValue}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setScrubbing(true);
                  setScrubValue(value);
                  seek(value);
                }}
                onPointerUp={() => setScrubbing(false)}
                onKeyUp={() => setScrubbing(false)}
                onBlur={() => setScrubbing(false)}
                aria-label="Seek in track"
                aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
              />
              <span className="levi-mp-time">{formatTime(duration)}</span>
            </div>

            <div className="levi-mp-volume">
              <Volume2 size={16} aria-hidden="true" />
              <input
                className="levi-range levi-volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
              />
            </div>

            <button type="button" className="levi-mp-close" onClick={close} aria-label="Close player">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
