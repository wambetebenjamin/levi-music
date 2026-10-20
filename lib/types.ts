export type GenreSlug =
  | "afrobeats"
  | "gengetone"
  | "benga"
  | "gospel"
  | "bongo-flava"
  | "rnb"
  | "hip-hop"
  | "reggae";

export type Country = "Kenya" | "Tanzania" | "Uganda" | "Rwanda" | "Ethiopia";

export interface Genre {
  slug: GenreSlug;
  name: string;
}

export interface Artist {
  id: string;
  username: string;
  name: string;
  genre: GenreSlug;
  country: Country;
  followers: number;
  photo: string;
  bio: string;
  verified: boolean;
  joined: string;
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  artistUsername: string;
  artistName: string;
  genre: GenreSlug;
  cover: string;
  releaseDate: string;
  plays: number;
  duration: string;
  audio: string;
  lyrics: string | null;
  explicit: boolean;
  status: "published" | "processing" | "draft";
}

export interface TrackFilter {
  genre?: string;
  artist?: string;
  year?: string;
  sort?: string;
  q?: string;
}

export interface ChartEntry {
  rank: number;
  track: Track;
}

export interface ArtistStats {
  playsThisMonth: number;
  playsAllTime: number;
  followers: number;
  estimatedEarningsKes: number;
  playRateKes: number;
}

export interface EarningsRow {
  month: string;
  plays: number;
  earningsKes: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "listener" | "artist";
  username: string;
  image?: string | null;
}
