import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { MusicFilters } from "@/components/MusicFilters";
import { TrackCard } from "@/components/TrackCard";
import { listTracks } from "@/lib/repository";
import { genreName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Music catalogue",
  description:
    "Browse the full Levi Music catalogue. Filter East African tracks by genre, artist and release year, then sort by newest, most played or trending.",
};

interface SearchParams {
  genre?: string;
  artist?: string;
  year?: string;
  sort?: string;
  q?: string;
}

export default async function MusicPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tracks = await listTracks(params);

  const context = [
    params.genre ? genreName(params.genre) : null,
    params.year ? `${params.year} releases` : null,
    params.q ? `matching ${params.q}` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="levi-page">
      <PageHero
        eyebrow={context || "Every East African sound in one place"}
        title="Music catalogue"
        image="/images/cover-7.jpg"
      />

      <section className="levi-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Suspense fallback={<div className="levi-filter-bar">Loading filters</div>}>
                <MusicFilters />
              </Suspense>
            </div>
          </div>

          <p className="levi-results-count" role="status">
            {tracks.length} {tracks.length === 1 ? "track" : "tracks"} found
            {params.sort === "most-played"
              ? " / sorted by most played"
              : params.sort === "trending"
                ? " / sorted by trending"
                : " / sorted by newest"}
          </p>

          {tracks.length === 0 ? (
            <div className="levi-empty">
              <h3>No tracks match those filters</h3>
              <p>Try another genre or clear the filters to see the whole catalogue.</p>
              <Link href="/music" className="btn oneMusic-btn levi-btn-sm mt-30">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="row">
              {tracks.map((track) => (
                <div className="col-12 col-sm-6 col-lg-3" key={track.id}>
                  <TrackCard track={track} queue={tracks} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
