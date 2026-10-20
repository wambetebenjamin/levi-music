import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistActions } from "@/components/ArtistActions";
import { DiscographyList } from "@/components/DiscographyList";
import { TrackActions } from "@/components/TrackActions";
import { artistDiscography, findArtist } from "@/lib/repository";
import { followerCount, formatPlays, genreName } from "@/lib/data";
import { formatDate } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const artist = await findArtist(username);
  if (!artist) return { title: "Artist not found" };
  return {
    title: artist.name,
    description: `${artist.name}, ${genreName(artist.genre)} from ${artist.country}. Stream the full discography on Levi Music.`,
    openGraph: { images: [{ url: artist.photo }] },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const artist = await findArtist(username);
  if (!artist) notFound();

  const discography = await artistDiscography(username);
  const latest = discography[0];
  const totalPlays = discography.reduce((sum, track) => sum + track.plays, 0);

  return (
    <div className="levi-page">
      <section className="levi-artist-hero">
        <div className="levi-artist-hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artist.photo} alt="" width={1200} height={800} />
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-3 col-lg-2">
              <div className="levi-artist-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artist.photo}
                  alt={`${artist.name} portrait`}
                  width={168}
                  height={168}
                />
              </div>
            </div>
            <div className="col-12 col-md-9 col-lg-10">
              <p className="levi-artist-sub">
                {genreName(artist.genre)} / {artist.country}
                {artist.verified ? " / Verified" : ""}
              </p>
              <h1>{artist.name}</h1>
              <div className="levi-artist-stats">
                <div>
                  <strong>{followerCount(artist.followers)}</strong>
                  <span>Followers</span>
                </div>
                <div>
                  <strong>{formatPlays(totalPlays)}</strong>
                  <span>Total plays</span>
                </div>
                <div>
                  <strong>{discography.length}</strong>
                  <span>Tracks</span>
                </div>
                <div>
                  <strong>{formatDate(artist.joined)}</strong>
                  <span>Joined Levi</span>
                </div>
              </div>
              <ArtistActions artist={artist} />
            </div>
          </div>
        </div>
      </section>

      <section className="levi-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="section-heading levi-left">
                <p>Full catalogue</p>
                <h2>Discography</h2>
              </div>
              <DiscographyList tracks={discography} />
            </div>

            <div className="col-12 col-lg-4">
              <div className="section-heading levi-left">
                <p>Newest release</p>
                <h2>Latest upload</h2>
              </div>

              {latest ? (
                <div className="levi-latest-upload">
                  <span className="levi-label">Out now</span>
                  <Link href={`/music/${latest.slug}`} aria-hidden="true" tabIndex={-1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={latest.cover} alt="" width={400} height={400} />
                  </Link>
                  <h4>
                    <Link href={`/music/${latest.slug}`}>{latest.title}</Link>
                  </h4>
                  <p>
                    {genreName(latest.genre)} / {formatDate(latest.releaseDate)} /{" "}
                    {formatPlays(latest.plays)} plays
                  </p>
                  <div style={{ marginTop: 20 }}>
                    <TrackActions track={latest} queue={discography} />
                  </div>
                </div>
              ) : (
                <p className="levi-note">No uploads yet.</p>
              )}

              <div className="levi-about-box mt-50">
                <h3>About</h3>
                <p>{artist.bio}</p>
                <p className="levi-note lev-note-last">
                  Based in {artist.country}. {genreName(artist.genre)} artist on Levi Music.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
