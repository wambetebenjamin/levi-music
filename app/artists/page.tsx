import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ArtistFilters } from "@/components/ArtistFilters";
import { ArtistCard } from "@/components/ArtistCard";
import { listArtists } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Artist directory",
  description:
    "Discover East African artists on Levi Music. Search and filter by genre and country across Kenya, Tanzania, Uganda, Rwanda and Ethiopia.",
};

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; country?: string; q?: string }>;
}) {
  const params = await searchParams;
  const artists = await listArtists(params);

  return (
    <div className="levi-page">
      <PageHero
        eyebrow="The people behind the sound"
        title="Artist directory"
        image="/images/artist-zawadi.jpg"
      />

      <section className="levi-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Suspense fallback={<div className="levi-filter-bar">Loading filters</div>}>
                <ArtistFilters />
              </Suspense>
            </div>
          </div>

          <p className="levi-results-count" role="status">
            {artists.length} {artists.length === 1 ? "artist" : "artists"} found
          </p>

          {artists.length === 0 ? (
            <div className="levi-empty">
              <h3>No artists match that search</h3>
              <p>Try a different country or genre, or browse the full directory.</p>
            </div>
          ) : (
            <div className="row">
              {artists.map((artist, index) => (
                <div className="col-12 col-sm-6 col-lg-3" key={artist.id}>
                  <ArtistCard artist={artist} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
