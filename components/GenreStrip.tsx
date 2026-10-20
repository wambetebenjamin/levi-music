import Link from "next/link";
import { genres } from "@/lib/data";

const counts: Record<string, string> = {
  afrobeats: "Lagos to Nairobi",
  gengetone: "Eastlands energy",
  benga: "Lake region roots",
  gospel: "Praise and harmony",
  "bongo-flava": "Dar es Salaam",
  rnb: "Slow and smooth",
  "hip-hop": "Bars from the block",
  reggae: "Roots and dub",
};

export function GenreStrip() {
  return (
    <div className="levi-genre-strip" role="list" aria-label="Browse music by genre">
      {genres.map((genre, index) => (
        <Link
          key={genre.slug}
          href={`/music?genre=${genre.slug}`}
          className="levi-genre-tile"
          role="listitem"
        >
          <span className="index">{String(index + 1).padStart(2, "0")}</span>
          <h5>{genre.name}</h5>
          <p>{counts[genre.slug] ?? "East African sound"}</p>
        </Link>
      ))}
    </div>
  );
}
