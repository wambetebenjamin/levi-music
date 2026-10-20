import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { TrackActions } from "@/components/TrackActions";
import { TrackCard } from "@/components/TrackCard";
import { findTrack, relatedTo } from "@/lib/repository";
import { formatDate } from "@/lib/site";
import { formatPlays, genreName, tracks as catalogue } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = await findTrack(slug);
  if (!track) return { title: "Track not found" };
  return {
    title: `${track.title} by ${track.artistName}`,
    description: `Stream ${track.title} by ${track.artistName}, ${genreName(track.genre)} from East Africa, on Levi Music.`,
    openGraph: {
      title: `${track.title} by ${track.artistName}`,
      images: [{ url: track.cover }],
    },
  };
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = await findTrack(slug);
  if (!track) notFound();

  const related = await relatedTo(track, 4);
  const queue = [track, ...related];

  return (
    <div className="levi-page">
      <PageHero eyebrow={genreName(track.genre)} title="Track" image="/images/cover-8.jpg" small />

      <section className="levi-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-5">
              <div className="levi-detail-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.cover}
                  alt={`${track.title} cover art`}
                  width={600}
                  height={600}
                />
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="levi-track-detail">
                <p className="levi-eyebrow">
                  {genreName(track.genre)} {track.explicit ? <span> / Explicit</span> : null}
                </p>
                <h1 className="levi-detail-title">{track.title}</h1>
                <Link href={`/artists/${track.artistUsername}`} className="levi-detail-artist">
                  {track.artistName}
                </Link>

                <div className="levi-detail-meta">
                  <div>
                    <span>Released</span>
                    <strong>{formatDate(track.releaseDate)}</strong>
                  </div>
                  <div>
                    <span>Plays</span>
                    <strong>{formatPlays(track.plays)}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{track.duration}</strong>
                  </div>
                  <div>
                    <span>Genre</span>
                    <strong>
                      <Link href={`/music?genre=${track.genre}`} style={{ fontSize: 15 }}>
                        {genreName(track.genre)}
                      </Link>
                    </strong>
                  </div>
                </div>

                <TrackActions track={track} queue={queue} />

                <div className="levi-lyrics">
                  <h4>Lyrics</h4>
                  {track.lyrics ? (
                    <pre>{track.lyrics}</pre>
                  ) : (
                    <pre>
                      Lyrics for this record have not been published yet. The artist can add
                      them from the upload form at any time.
                    </pre>
                  )}
                </div>

                <p className="levi-note mt-30">
                  Audio on this preview is a royalty-free demo clip. There is no licensed music
                  in the catalogue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="levi-section gray">
        <div className="container">
          <div className="section-heading levi-left">
            <p>Keep the session going</p>
            <h2>Related tracks</h2>
          </div>
          <div className="row">
            {related.map((item) => (
              <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
                <TrackCard track={item} queue={[track, ...catalogue]} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
