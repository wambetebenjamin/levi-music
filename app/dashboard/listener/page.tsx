import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ListenerDashboard } from "@/components/ListenerDashboard";
import { auth } from "@/lib/auth";
import { listArtists } from "@/lib/repository";
import { tracks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Listener dashboard",
  description: "Your recently played tracks, saved playlist and the artists you follow on Levi Music.",
};

export default async function ListenerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?next=/dashboard/listener");
  if (session.user.role === "artist") redirect("/dashboard/artist");

  const artists = await listArtists();

  return (
    <div className="levi-page">
      <PageHero eyebrow="Listener workspace" title="Your dashboard" image="/images/cover-3.jpg" small />
      <section className="levi-dash">
        <div className="container">
          <div className="levi-dash-head">
            <div>
              <h1>{session.user.name}</h1>
              <p>Free listener account / stream anything in the catalogue.</p>
            </div>
            <a href="/music" className="btn oneMusic-btn">
              Discover music
            </a>
          </div>

          <ListenerDashboard tracks={tracks} artists={artists} />

          <p className="levi-note mt-30">
            Saved tracks and followed artists are stored on this device and are only shared when
            you allow functional cookies.
          </p>
        </div>
      </section>
    </div>
  );
}
