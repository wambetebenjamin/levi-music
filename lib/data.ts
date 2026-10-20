import type { Artist, ChartEntry, Genre, Track, TrackFilter } from "@/lib/types";

export const DEMO_AUDIO = "/audio/demo-track.mp3";

export const genres: Genre[] = [
  { slug: "afrobeats", name: "Afrobeats" },
  { slug: "gengetone", name: "Gengetone" },
  { slug: "benga", name: "Benga" },
  { slug: "gospel", name: "Gospel" },
  { slug: "bongo-flava", name: "Bongo Flava" },
  { slug: "rnb", name: "RnB" },
  { slug: "hip-hop", name: "Hip Hop" },
  { slug: "reggae", name: "Reggae" },
];

export const countries = ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia"] as const;

export function genreName(slug: string): string {
  return genres.find((g) => g.slug === slug)?.name ?? slug;
}

export const artists: Artist[] = [
  {
    id: "art_amara",
    username: "amara-njoroge",
    name: "Amara Njoroge",
    genre: "afrobeats",
    country: "Kenya",
    followers: 128400,
    photo: "/images/artist-amara.jpg",
    bio: "Amara writes about Nairobi after dark, the matatu routes that raised her, and the love that keeps the city awake. She records at a small studio in Kilimani and plays every Thursday at a rooftop in Westlands.",
    verified: true,
    joined: "2023-02-11",
  },
  {
    id: "art_zawadi",
    username: "zawadi-mwangi",
    name: "Zawadi Mwangi",
    genre: "gengetone",
    country: "Kenya",
    followers: 96200,
    photo: "/images/artist-zawadi.jpg",
    bio: "Zawadi is a Gengetone force from Dandora. Her bars carry the rhythm of the estate, the boda horns, and the corner shop radio. She tours with a four piece band and mentors young writers in Eastlands.",
    verified: true,
    joined: "2022-08-04",
  },
  {
    id: "art_kenji",
    username: "kenji-otieno",
    name: "Kenji Otieno",
    genre: "benga",
    country: "Kenya",
    followers: 54800,
    photo: "/images/artist-kenji.jpg",
    bio: "A third generation Benga guitarist from Kisumu. Kenji learned the nyatiti from his grandfather and the electric guitar from his father. His records keep the seven note Benga pattern alive and moving.",
    verified: true,
    joined: "2021-05-19",
  },
  {
    id: "art_neema",
    username: "neema-akinyi",
    name: "Neema Akinyi",
    genre: "gospel",
    country: "Kenya",
    followers: 210300,
    photo: "/images/artist-neema.jpg",
    bio: "Neema leads worship in Nairobi and writes songs for the community choir she founded in Kibera. Her music blends Swahili praise with modern gospel arrangements and a whole lot of harmony.",
    verified: true,
    joined: "2020-11-02",
  },
  {
    id: "art_baraka",
    username: "baraka-juma",
    name: "Baraka Juma",
    genre: "bongo-flava",
    country: "Tanzania",
    followers: 143700,
    photo: "/images/artist-baraka.jpg",
    bio: "Baraka is a Dar es Salaam songwriter with a soft spot for slow Bongo Flava. He produces his own beats and has spent the last decade moving between Kariakoo and Morogoro Road studios.",
    verified: true,
    joined: "2022-01-27",
  },
  {
    id: "art_sauti",
    username: "sauti-uwase",
    name: "Sauti Uwase",
    genre: "rnb",
    country: "Rwanda",
    followers: 38900,
    photo: "/images/artist-sauti.jpg",
    bio: "Sauti sings quiet RnB from Kigali. She studied jazz piano for four years before turning to songwriting, and her record Kigali Sky was made in a bedroom studio overlooking the hills.",
    verified: false,
    joined: "2023-09-15",
  },
  {
    id: "art_dawit",
    username: "dawit-bekele",
    name: "Dawit Bekele",
    genre: "hip-hop",
    country: "Ethiopia",
    followers: 61500,
    photo: "/images/artist-dawit.jpg",
    bio: "Dawit is an Addis Ababa rapper who writes in Amharic and English. He runs a weekly cypher in Merkato and builds most of his instrumentals from sampled krar and masenqo records.",
    verified: true,
    joined: "2023-04-08",
  },
  {
    id: "art_jah",
    username: "jah-kalani",
    name: "Jah Kalani",
    genre: "reggae",
    country: "Uganda",
    followers: 77400,
    photo: "/images/artist-jah.jpg",
    bio: "Jah Kalani has been holding down roots reggae in Kampala since 2014. His band plays live dubs, records on tape, and never leaves a show without a long version of Kampala Dub.",
    verified: true,
    joined: "2021-12-21",
  },
];

const LYRICS_PLACEHOLDER = `Lyrics for this record are being finalised by the artist.

Full lyric text, translations, and credits will appear here once the artist publishes them.`;

export const tracks: Track[] = [
  {
    id: "trk_nairobi_nights",
    slug: "nairobi-nights",
    title: "Nairobi Nights",
    artistUsername: "amara-njoroge",
    artistName: "Amara Njoroge",
    genre: "afrobeats",
    cover: "/images/cover-1.jpg",
    releaseDate: "2025-11-14",
    plays: 184230,
    duration: "3:42",
    audio: DEMO_AUDIO,
    lyrics: `City lights on Mombasa Road
Matatu horns in stereo
You said meet me after nine
I said baby take it slow

Nairobi nights, we move like water
Nairobi nights, the city knows
Every corner keeps a rhythm
Every rhythm finds a home`,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_sema_nami",
    slug: "sema-nami",
    title: "Sema Nami",
    artistUsername: "amara-njoroge",
    artistName: "Amara Njoroge",
    genre: "afrobeats",
    cover: "/images/cover-4.jpg",
    releaseDate: "2026-03-06",
    plays: 121870,
    duration: "3:18",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_mtaa_anthem",
    slug: "mtaa-anthem",
    title: "Mtaa Anthem",
    artistUsername: "zawadi-mwangi",
    artistName: "Zawadi Mwangi",
    genre: "gengetone",
    cover: "/images/cover-6.jpg",
    releaseDate: "2025-07-22",
    plays: 223410,
    duration: "2:58",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: true,
    status: "published",
  },
  {
    id: "trk_kanjo_beat",
    slug: "kanjo-beat",
    title: "Kanjo Beat",
    artistUsername: "zawadi-mwangi",
    artistName: "Zawadi Mwangi",
    genre: "gengetone",
    cover: "/images/cover-8.jpg",
    releaseDate: "2024-09-30",
    plays: 98760,
    duration: "3:05",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_benga_ya_leo",
    slug: "benga-ya-leo",
    title: "Benga Ya Leo",
    artistUsername: "kenji-otieno",
    artistName: "Kenji Otieno",
    genre: "benga",
    cover: "/images/cover-2.jpg",
    releaseDate: "2023-06-17",
    plays: 64310,
    duration: "4:26",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_wuod_luo",
    slug: "wuod-luo",
    title: "Wuod Luo",
    artistUsername: "kenji-otieno",
    artistName: "Kenji Otieno",
    genre: "benga",
    cover: "/images/cover-7.jpg",
    releaseDate: "2026-01-23",
    plays: 41220,
    duration: "5:02",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_neema_yangu",
    slug: "neema-yangu",
    title: "Neema Yangu",
    artistUsername: "neema-akinyi",
    artistName: "Neema Akinyi",
    genre: "gospel",
    cover: "/images/cover-3.jpg",
    releaseDate: "2025-04-12",
    plays: 305480,
    duration: "4:48",
    audio: DEMO_AUDIO,
    lyrics: `Neema yangu, neema yangu
Imefika mpaka leo
Kila asubuhi naona uzima
Nasimama kwa neema yako

Wewe ndiye nguzo yangu
Wewe ndiye nuru yangu
Kila siku nitakuimbia
Kila siku nitakushukuru`,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_bwana_asifiwe",
    slug: "bwana-asifiwe",
    title: "Bwana Asifiwe",
    artistUsername: "neema-akinyi",
    artistName: "Neema Akinyi",
    genre: "gospel",
    cover: "/images/cover-5.jpg",
    releaseDate: "2024-12-01",
    plays: 178900,
    duration: "5:14",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_dar_es_salaam",
    slug: "dar-es-salaam",
    title: "Dar Es Salaam",
    artistUsername: "baraka-juma",
    artistName: "Baraka Juma",
    genre: "bongo-flava",
    cover: "/images/cover-2.jpg",
    releaseDate: "2026-02-14",
    plays: 156780,
    duration: "4:07",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_moyo_wangu",
    slug: "moyo-wangu",
    title: "Moyo Wangu",
    artistUsername: "baraka-juma",
    artistName: "Baraka Juma",
    genre: "bongo-flava",
    cover: "/images/cover-1.jpg",
    releaseDate: "2025-10-09",
    plays: 134220,
    duration: "3:54",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_kigali_sky",
    slug: "kigali-sky",
    title: "Kigali Sky",
    artistUsername: "sauti-uwase",
    artistName: "Sauti Uwase",
    genre: "rnb",
    cover: "/images/cover-5.jpg",
    releaseDate: "2025-08-19",
    plays: 87230,
    duration: "3:36",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_slow_motion",
    slug: "slow-motion",
    title: "Slow Motion",
    artistUsername: "sauti-uwase",
    artistName: "Sauti Uwase",
    genre: "rnb",
    cover: "/images/cover-3.jpg",
    releaseDate: "2026-04-03",
    plays: 64110,
    duration: "3:21",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_addis_flow",
    slug: "addis-flow",
    title: "Addis Flow",
    artistUsername: "dawit-bekele",
    artistName: "Dawit Bekele",
    genre: "hip-hop",
    cover: "/images/cover-4.jpg",
    releaseDate: "2025-05-28",
    plays: 112400,
    duration: "3:12",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: true,
    status: "published",
  },
  {
    id: "trk_habesha_hustle",
    slug: "habesha-hustle",
    title: "Habesha Hustle",
    artistUsername: "dawit-bekele",
    artistName: "Dawit Bekele",
    genre: "hip-hop",
    cover: "/images/cover-8.jpg",
    releaseDate: "2024-03-16",
    plays: 76550,
    duration: "2:49",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_kampala_dub",
    slug: "kampala-dub",
    title: "Kampala Dub",
    artistUsername: "jah-kalani",
    artistName: "Jah Kalani",
    genre: "reggae",
    cover: "/images/cover-6.jpg",
    releaseDate: "2025-09-05",
    plays: 92340,
    duration: "6:11",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_roots_and_fire",
    slug: "roots-and-fire",
    title: "Roots and Fire",
    artistUsername: "jah-kalani",
    artistName: "Jah Kalani",
    genre: "reggae",
    cover: "/images/cover-7.jpg",
    releaseDate: "2023-11-11",
    plays: 58020,
    duration: "5:33",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_nakupenda",
    slug: "nakupenda",
    title: "Nakupenda",
    artistUsername: "amara-njoroge",
    artistName: "Amara Njoroge",
    genre: "rnb",
    cover: "/images/cover-1.jpg",
    releaseDate: "2024-08-08",
    plays: 143900,
    duration: "3:58",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_jenga_beat",
    slug: "jenga-beat",
    title: "Jenga Beat",
    artistUsername: "zawadi-mwangi",
    artistName: "Zawadi Mwangi",
    genre: "afrobeats",
    cover: "/images/cover-5.jpg",
    releaseDate: "2026-05-30",
    plays: 45100,
    duration: "3:09",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_shangwe",
    slug: "shangwe",
    title: "Shangwe",
    artistUsername: "kenji-otieno",
    artistName: "Kenji Otieno",
    genre: "benga",
    cover: "/images/cover-3.jpg",
    releaseDate: "2025-02-20",
    plays: 39270,
    duration: "4:15",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
  {
    id: "trk_baraka_zote",
    slug: "baraka-zote",
    title: "Baraka Zote",
    artistUsername: "neema-akinyi",
    artistName: "Neema Akinyi",
    genre: "gospel",
    cover: "/images/cover-4.jpg",
    releaseDate: "2026-06-12",
    plays: 168300,
    duration: "4:33",
    audio: DEMO_AUDIO,
    lyrics: LYRICS_PLACEHOLDER,
    explicit: false,
    status: "published",
  },
];

export function getArtistByUsername(username: string): Artist | undefined {
  return artists.find((a) => a.username === username);
}

export function getTrackBySlug(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}

export type TrackSort = "newest" | "most-played" | "trending";

export function sortTracks(list: Track[], sort: TrackSort | string = "newest"): Track[] {
  const copy = [...list];
  if (sort === "most-played") {
    return copy.sort((a, b) => b.plays - a.plays);
  }
  if (sort === "trending") {
    const weight = (t: Track) =>
      t.plays / (1 + (2026 - Number(t.releaseDate.slice(0, 4))));
    return copy.sort((a, b) => weight(b) - weight(a));
  }
  return copy.sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );
}

export function filterTracks(list: Track[], filter: TrackFilter): Track[] {
  let result = list;
  if (filter.genre) {
    result = result.filter((t) => t.genre === filter.genre);
  }
  if (filter.artist) {
    result = result.filter(
      (t) => t.artistUsername === filter.artist || t.artistName === filter.artist,
    );
  }
  if (filter.year) {
    result = result.filter((t) => t.releaseDate.startsWith(filter.year as string));
  }
  if (filter.q) {
    const q = filter.q.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q),
    );
  }
  return sortTracks(result, filter.sort);
}

export function relatedTracks(track: Track, limit = 4): Track[] {
  const sameGenre = tracks.filter((t) => t.id !== track.id && t.genre === track.genre);
  const others = tracks.filter((t) => t.id !== track.id && t.genre !== track.genre);
  return [...sortTracks(sameGenre, "most-played"), ...sortTracks(others, "most-played")].slice(
    0,
    limit,
  );
}

export function chart(count = 10): ChartEntry[] {
  return sortTracks(tracks, "most-played")
    .slice(0, count)
    .map((track, i) => ({ rank: i + 1, track }));
}

export function releaseYears(): string[] {
  const years = new Set(tracks.map((t) => t.releaseDate.slice(0, 4)));
  return [...years].sort((a, b) => Number(b) - Number(a));
}

export function tracksByArtist(username: string): Track[] {
  return sortTracks(
    tracks.filter((t) => t.artistUsername === username),
    "newest",
  );
}

export function followerCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  }
  return String(n);
}

export function formatPlays(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
