
import {
  artists,
  filterTracks,
  getArtistByUsername,
  getTrackBySlug,
  sortTracks,
  tracks as baseTracks,
} from "@/lib/data";
import type {
  Artist,
  ArtistStats,
  ChartEntry,
  EarningsRow,
  Track,
  TrackFilter,
} from "@/lib/types";

/**
 * Lightweight storage layer. When KV_REST_API_URL and KV_REST_API_TOKEN are
 * present the platform persists play counts and uploads in Vercel KV.
 * Without them the demo runs on an in-memory store so the site still works.
 */

const playKey = (id: string) => `plays:${id}`;
const uploadKey = "tracks:uploads";

const memoryPlays = new Map<string, number>();
let memoryUploads: Track[] = [];

let kvClient: null | {
  incr: (key: string) => Promise<number>;
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<unknown>;
} = null;

async function kv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  if (kvClient) return kvClient;
  try {
    const mod = await import("@vercel/kv");
    kvClient = mod.kv as unknown as typeof kvClient;
    return kvClient;
  } catch {
    return null;
  }
}

async function playDelta(id: string): Promise<number> {
  const store = await kv();
  if (store) {
    try {
      const raw = await store.get<number>(playKey(id));
      return Number(raw ?? 0);
    } catch {
      return memoryPlays.get(id) ?? 0;
    }
  }
  return memoryPlays.get(id) ?? 0;
}

async function allTracks(): Promise<Track[]> {
  const store = await kv();
  let uploads: Track[] = memoryUploads;
  if (store) {
    try {
      uploads = (await store.get<Track[]>(uploadKey)) ?? [];
    } catch {
      uploads = memoryUploads;
    }
  }
  const merged = await Promise.all(
    [...baseTracks, ...uploads].map(async (track) => {
      const delta = await playDelta(track.id);
      return delta ? { ...track, plays: track.plays + delta } : track;
    }),
  );
  return merged;
}

export async function listTracks(filter: TrackFilter = {}): Promise<Track[]> {
  return filterTracks(await allTracks(), filter);
}

export async function findTrack(slug: string): Promise<Track | undefined> {
  const all = await allTracks();
  return all.find((t) => t.slug === slug) ?? getTrackBySlug(slug);
}

export async function listArtists(filter: {
  genre?: string;
  country?: string;
  q?: string;
} = {}): Promise<Artist[]> {
  let list = [...artists];
  if (filter.genre) list = list.filter((a) => a.genre === filter.genre);
  if (filter.country) list = list.filter((a) => a.country === filter.country);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q),
    );
  }
  return list.sort((a, b) => b.followers - a.followers);
}

export async function findArtist(usernameOrId: string): Promise<Artist | undefined> {
  return (
    getArtistByUsername(usernameOrId) ??
    artists.find((a) => a.username === usernameOrId || a.id === usernameOrId)
  );
}

export async function artistDiscography(username: string): Promise<Track[]> {
  const all = await allTracks();
  return sortTracks(all.filter((t) => t.artistUsername === username), "newest");
}

export async function relatedTo(track: Track, limit = 4): Promise<Track[]> {
  const all = await allTracks();
  const same = all.filter((t) => t.id !== track.id && t.genre === track.genre);
  const others = all.filter((t) => t.id !== track.id && t.genre !== track.genre);
  return [...sortTracks(same, "most-played"), ...sortTracks(others, "most-played")].slice(
    0,
    limit,
  );
}

export async function topChart(count = 10): Promise<ChartEntry[]> {
  const all = await allTracks();
  return sortTracks(all, "most-played")
    .slice(0, count)
    .map((track, i) => ({ rank: i + 1, track }));
}

export async function registerPlay(trackId: string): Promise<number> {
  const all = await allTracks();
  const track = all.find((t) => t.id === trackId || t.slug === trackId);
  if (!track) throw new Error("Track not found");

  const store = await kv();
  let delta: number;
  if (store) {
    try {
      delta = await store.incr(playKey(track.id));
    } catch {
      delta = (memoryPlays.get(track.id) ?? 0) + 1;
      memoryPlays.set(track.id, delta);
    }
  } else {
    delta = (memoryPlays.get(track.id) ?? 0) + 1;
    memoryPlays.set(track.id, delta);
  }
  return track.plays + delta;
}

export async function saveTrack(track: Track): Promise<Track> {
  const store = await kv();
  if (store) {
    try {
      const existing = (await store.get<Track[]>(uploadKey)) ?? [];
      await store.set(uploadKey, [track, ...existing]);
    } catch {
      memoryUploads = [track, ...memoryUploads];
    }
  } else {
    memoryUploads = [track, ...memoryUploads];
  }
  return track;
}

export function playRate(): number {
  const rate = Number(process.env.PLAY_RATE_KES_PER_STREAM);
  return Number.isFinite(rate) && rate > 0 ? rate : 0.035;
}

export async function artistStats(username: string): Promise<ArtistStats> {
  const artist = await findArtist(username);
  const discography = await artistDiscography(username);
  const playsAllTime = discography.reduce((sum, t) => sum + t.plays, 0);
  const playsThisMonth = Math.round(playsAllTime * 0.164);
  const rate = playRate();
  return {
    playsThisMonth,
    playsAllTime,
    followers: artist?.followers ?? 0,
    estimatedEarningsKes: Math.round(playsThisMonth * rate),
    playRateKes: rate,
  };
}

export async function earningsHistory(username: string): Promise<EarningsRow[]> {
  const discography = await artistDiscography(username);
  const total = discography.reduce((sum, t) => sum + t.plays, 0);
  const rate = playRate();
  const months = [
    "May 2026",
    "June 2026",
    "July 2026",
    "August 2026",
    "September 2026",
    "October 2026",
  ];
  const shares = [0.129, 0.141, 0.152, 0.160, 0.171, 0.164];
  return months.map((month, i) => {
    const plays = Math.round(total * shares[i]);
    return { month, plays, earningsKes: Math.round(plays * rate) };
  });
}

