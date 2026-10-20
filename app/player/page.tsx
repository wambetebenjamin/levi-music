import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PlayerStage } from "@/components/PlayerStage";
import { listTracks } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Player",
  description:
    "The Levi Music player. Stream East African tracks with a scrubable progress bar, volume control and a full queue.",
};

export default async function PlayerPage() {
  const tracks = await listTracks({ sort: "most-played" });

  return (
    <div className="levi-page">
      <PageHero eyebrow="Listen in full" title="Player" image="/images/cover-8.jpg" small />
      <section className="levi-player-page">
        <div className="container">
          <PlayerStage tracks={tracks} />
        </div>
      </section>
    </div>
  );
}
