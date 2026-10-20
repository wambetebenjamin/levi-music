import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { GenreStrip } from "@/components/GenreStrip";
import { TrackCard } from "@/components/TrackCard";
import { ArtistCard } from "@/components/ArtistCard";
import { ChartList } from "@/components/ChartList";
import { SectionHeading } from "@/components/SectionHeading";
import { HeroParallax } from "@/components/HeroParallax";
import { artistDiscography, listArtists, listTracks, topChart } from "@/lib/repository";
import { artists } from "@/lib/data";

export const metadata = {
  title: "Levi Music. Stream East Africa. Support your artists.",
  description:
    "Stream Afrobeats, Gengetone, Benga, Gospel and Bongo Flava free. Discover East African artists and support them directly.",
};

export default async function HomePage() {
  const featured = (await listTracks({ sort: "most-played" })).slice(0, 4);
  const charts = await topChart(10);
  const featuredArtists = await listArtists();
  const spotlight = [artists[0], artists[3], artists[1]];
  const latest = await artistDiscography("amara-njoroge");

  return (
    <div className="levi-page">
      <section className="levi-hero">
        <HeroParallax>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-performer.jpg"
            alt="East African musician performing into a microphone under stage light in Nairobi"
            width={1600}
            height={1067}
          />
        </HeroParallax>
        <div className="container">
          <div className="levi-hero-inner">
            <div className="row">
              <div className="col-12 col-lg-8">
                <p className="levi-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Built in East Africa, for East Africa
                </p>
                <h1>
                  Stream East Africa.
                  <span>Support your artists.</span>
                </h1>
                <p className="levi-hero-copy">
                  Afrobeats, Gengetone, Benga, Gospel, Bongo Flava and more, streaming free from
                  Nairobi to Dar es Salaam, Kampala to Kigali and Addis. Every play pays the
                  artist directly.
                </p>
                <div className="levi-hero-ctas">
                  <Link href="/music" className="btn oneMusic-btn levi-btn-solid">
                    <Play size={16} aria-hidden="true" style={{ marginRight: 8 }} />
                    Start Listening Free
                  </Link>
                  <Link href="/auth/signup?role=artist" className="btn oneMusic-btn levi-btn-ghost">
                    Upload Your Music
                    <ArrowRight size={16} aria-hidden="true" style={{ marginLeft: 8 }} />
                  </Link>
                </div>

                <div className="levi-hero-trust">
                  <div>
                    <strong>{featuredArtists.length}</strong>
                    <span>Artists on board</span>
                  </div>
                  <div>
                    <strong>5</strong>
                    <span>Countries</span>
                  </div>
                  <div>
                    <strong>8</strong>
                    <span>Genres</span>
                  </div>
                  <div>
                    <strong>KES 0.035</strong>
                    <span>Per stream to artists</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="levi-section tight">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <SectionHeading eyebrow="Find your sound" title="Browse by genre" align="left" />
            </div>
          </div>
          <GenreStrip />
        </div>
      </section>

      <section className="levi-section gray">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-12 col-md-8">
              <SectionHeading eyebrow="Playing now across the region" title="Featured tracks" align="left" />
            </div>
            <div className="col-12 col-md-4 text-md-right mb-100">
              <Link href="/music" className="levi-link-arrow">
                All music <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="row">
            {featured.map((track) => (
              <div className="col-12 col-sm-6 col-lg-3" key={track.id}>
                <TrackCard track={track} queue={featured} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="levi-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <SectionHeading eyebrow="Fresh voices" title="New artists spotlight" />
            </div>
          </div>
          <div className="row justify-content-center">
            {spotlight.map((artist, index) => (
              <div className="col-12 col-sm-6 col-lg-4" key={artist.id}>
                <ArtistCard artist={artist} index={index} />
              </div>
            ))}
          </div>
          <div className="levi-section-footer">
            <Link href="/artists" className="btn oneMusic-btn">
              Browse all artists
            </Link>
          </div>
        </div>
      </section>

      <section className="levi-section gray">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <SectionHeading eyebrow="Simple by design" title="How Levi Music works" />
            </div>
          </div>

          <div className="levi-how">
            <div className="levi-how-col first">
              <h3>For listeners</h3>
              <p className="levi-how-sub">Free streaming, no card needed</p>
              <div className="levi-step">
                <span className="num">1</span>
                <div>
                  <h6>Sign up free</h6>
                  <p>One account for the whole region. Listen on your phone, laptop or in the matatu.</p>
                </div>
              </div>
              <div className="levi-step">
                <span className="num">2</span>
                <div>
                  <h6>Browse and stream</h6>
                  <p>Follow genres and artists, save tracks to your playlist and pick up where you left off.</p>
                </div>
              </div>
              <div className="levi-step">
                <span className="num">3</span>
                <div>
                  <h6>Support artists</h6>
                  <p>Send a direct M-Pesa tip when a track moves you. Follows and plays also pay.</p>
                </div>
              </div>
              <Link href="/auth/signup?role=listener" className="btn oneMusic-btn levi-btn-sm mt-30">
                Create listener account
              </Link>
            </div>

            <div className="levi-how-col">
              <h3>For artists</h3>
              <p className="levi-how-sub">Own your masters, keep your earnings</p>
              <div className="levi-step">
                <span className="num">1</span>
                <div>
                  <h6>Create an artist account</h6>
                  <p>Set up your profile, add a photo, and tell listeners where your sound comes from.</p>
                </div>
              </div>
              <div className="levi-step">
                <span className="num">2</span>
                <div>
                  <h6>Upload your music</h6>
                  <p>Upload MP3 or WAV with cover art and lyrics. We validate the file and publish it to your discography.</p>
                </div>
              </div>
              <div className="levi-step">
                <span className="num">3</span>
                <div>
                  <h6>Earn from plays and fan support</h6>
                  <p>Track plays in real time. Earnings and tips are shown in your dashboard in Kenyan shillings.</p>
                </div>
              </div>
              <Link href="/upload" className="btn oneMusic-btn levi-btn-sm mt-30">
                Upload your music
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="levi-section" id="charts">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-12 col-md-8">
              <SectionHeading eyebrow="Trending this week" title="Top charts" align="left" />
            </div>
            <div className="col-12 col-md-4 text-md-right mb-100">
              <Link href="/music?sort=trending" className="levi-link-arrow">
                See the full catalogue <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ChartList entries={charts} />
          <p className="levi-note mt-30">
            Charts are ranked on plays across the last seven days. Latest release in the catalogue:{" "}
            <Link href={`/music/${latest[0]?.slug ?? "nairobi-nights"}`}>
              {latest[0]?.title ?? "Nairobi Nights"}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
