"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayer } from "@/lib/player-store";
import { Play, Pause } from "lucide-react";
import { formatPlays, genreName } from "@/lib/data";
import type { Artist, Track } from "@/lib/types";

const SAVED_KEY = "levi_music_saved_tracks";
const FOLLOWED_KEY = "levi_music_followed_artists";
const RECENT_KEY = "levi_music_recent_plays";

interface Props {
  tracks: Track[];
  artists: Artist[];
}

function readList(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function ListenerDashboard({ tracks, artists }: Props) {
  const { current, isPlaying, playTrack, toggle } = usePlayer();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSavedIds(readList(SAVED_KEY));
    setFollowed(readList(FOLLOWED_KEY));
    setRecentIds(readList(RECENT_KEY));
    setReady(true);
  }, []);

  const savedTracks = savedIds
    .map((id) => tracks.find((track) => track.id === id))
    .filter((track): track is Track => Boolean(track));

  const recentTracks = recentIds
    .map((id) => tracks.find((track) => track.id === id))
    .filter((track): track is Track => Boolean(track));

  const followedArtists = followed
    .map((username) => artists.find((artist) => artist.username === username))
    .filter((artist): artist is Artist => Boolean(artist));

  const play = (track: Track) => {
    if (current?.id === track.id) {
      toggle();
    } else {
      playTrack(track, tracks);
    }
  };

  if (!ready) {
    return <p className="levi-note">Loading your listening history.</p>;
  }

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="levi-panel">
            <div className="levi-panel-head">
              <h2>Recently played</h2>
              <span className="levi-note">{recentTracks.length} saved on this device</span>
            </div>
            {recentTracks.length ? (
              <ul className="levi-list-simple">
                {recentTracks.slice(0, 6).map((track) => (
                  <li key={track.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={track.cover} alt="" width={44} height={44} />
                    <div className="levi-list-info">
                      <h6>
                        <Link href={`/music/${track.slug}`}>{track.title}</Link>
                      </h6>
                      <p>{track.artistName}</p>
                    </div>
                    <button
                      type="button"
                      className="levi-chart-play"
                      onClick={() => play(track)}
                      aria-label={`Play ${track.title}`}
                    >
                      {current?.id === track.id && isPlaying ? (
                        <Pause size={15} />
                      ) : (
                        <Play size={15} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <p className="levi-note mb-0">
                  Nothing here yet. Start a track and it will show up in your recent history.
                </p>
                <Link href="/music" className="btn oneMusic-btn levi-btn-sm mt-30">
                  Browse music
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="levi-panel">
            <div className="levi-panel-head">
              <h2>Saved tracks</h2>
              <span className="levi-note">{savedTracks.length} in your playlist</span>
            </div>
            {savedTracks.length ? (
              <ul className="levi-list-simple">
                {savedTracks.map((track) => (
                  <li key={track.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={track.cover} alt="" width={44} height={44} />
                    <div className="levi-list-info">
                      <h6>
                        <Link href={`/music/${track.slug}`}>{track.title}</Link>
                      </h6>
                      <p>
                        {genreName(track.genre)} / {formatPlays(track.plays)} plays
                      </p>
                    </div>
                    <button
                      type="button"
                      className="levi-chart-play"
                      onClick={() => play(track)}
                      aria-label={`Play ${track.title}`}
                    >
                      {current?.id === track.id && isPlaying ? (
                        <Pause size={15} />
                      ) : (
                        <Play size={15} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <p className="levi-note mb-0">
                  Save tracks with Add to playlist on any track page, then find them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="levi-panel">
        <div className="levi-panel-head">
          <h2>Artists you follow</h2>
          <span className="levi-note">{followedArtists.length} followed</span>
        </div>
        {followedArtists.length ? (
          <ul className="levi-list-simple">
            {followedArtists.map((artist) => (
              <li key={artist.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artist.photo}
                  alt=""
                  width={44}
                  height={44}
                  style={{ borderRadius: "50%" }}
                />
                <div className="levi-list-info">
                  <h6>
                    <Link href={`/artists/${artist.username}`}>{artist.name}</Link>
                  </h6>
                  <p>
                    {genreName(artist.genre)} / {artist.country}
                  </p>
                </div>
                <Link href={`/artists/${artist.username}`} className="btn oneMusic-btn levi-btn-sm">
                  Listen
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4">
            <p className="levi-note mb-0">
              Follow artists from their profile page and they will appear here.
            </p>
            <Link href="/artists" className="btn oneMusic-btn levi-btn-sm mt-30">
              Find artists
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
