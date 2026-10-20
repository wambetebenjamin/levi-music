import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { auth } from "@/lib/auth";
import { artistDiscography, artistStats, earningsHistory } from "@/lib/repository";
import { formatPlays, genreName } from "@/lib/data";
import { formatDate, formatKes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Artist dashboard",
  description:
    "Track plays, followers and estimated earnings from your Levi Music artist dashboard.",
};

export default async function ArtistDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?next=/dashboard/artist");
  if (session.user.role !== "artist") redirect("/dashboard/listener");

  const username = session.user.username;
  const stats = await artistStats(username);
  const discography = await artistDiscography(username);
  const history = await earningsHistory(username);

  return (
    <div className="levi-page">
      <PageHero eyebrow="Artist workspace" title="Your dashboard" image="/images/cover-5.jpg" small />

      <section className="levi-dash">
        <div className="container">
          <div className="levi-dash-head">
            <div>
              <h1>{session.user.name}</h1>
              <p>
                {username} / {discography.length} published tracks / play rate KES{" "}
                {stats.playRateKes.toFixed(3)} per stream
              </p>
            </div>
            <Link href="/upload" className="btn oneMusic-btn">
              Upload New Track
            </Link>
          </div>

          <div className="levi-stat-grid">
            <div className="levi-stat">
              <span>Plays this month</span>
              <strong>{formatPlays(stats.playsThisMonth)}</strong>
              <small>Across all published tracks</small>
            </div>
            <div className="levi-stat">
              <span>Plays all time</span>
              <strong>{formatPlays(stats.playsAllTime)}</strong>
              <small>Since you joined Levi Music</small>
            </div>
            <div className="levi-stat">
              <span>Followers</span>
              <strong>{formatPlays(stats.followers)}</strong>
              <small>Listeners following your profile</small>
            </div>
            <div className="levi-stat">
              <span>Estimated earnings</span>
              <strong>{formatKes(stats.estimatedEarningsKes)}</strong>
              <small>This month, before withholding</small>
            </div>
          </div>

          <div className="levi-panel">
            <div className="levi-panel-head">
              <h2>Your tracks</h2>
              <span className="levi-note">Play counts update as listeners stream</span>
            </div>
            <div className="levi-table-scroll">
              <table className="levi-table">
                <thead>
                  <tr>
                    <th scope="col">Track</th>
                    <th scope="col">Genre</th>
                    <th scope="col">Plays</th>
                    <th scope="col">Uploaded</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {discography.map((track) => (
                    <tr key={track.id}>
                      <td>
                        <div className="levi-row-title">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={track.cover} alt="" width={42} height={42} />
                          <div>
                            <Link href={`/music/${track.slug}`}>
                              <strong>{track.title}</strong>
                            </Link>
                            <div className="levi-note" style={{ fontSize: 12 }}>
                              {track.duration} {track.explicit ? " / Explicit" : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{genreName(track.genre)}</td>
                      <td>{formatPlays(track.plays)}</td>
                      <td>{formatDate(track.releaseDate)}</td>
                      <td>
                        <span className={`levi-status ${track.status}`}>{track.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="levi-panel">
            <div className="levi-panel-head">
              <h2>Earnings history</h2>
              <span className="levi-note">
                Estimated at KES {stats.playRateKes.toFixed(3)} per stream
              </span>
            </div>
            <div className="levi-table-scroll">
              <table className="levi-table">
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Plays</th>
                    <th scope="col">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{row.plays.toLocaleString("en-KE")}</td>
                      <td>{formatKes(row.earningsKes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="levi-note">
            Payouts run at the end of each month to the M-Pesa number on your artist profile.
            Earnings are estimates until the statement is issued. Read the{" "}
            <Link href="/legal/terms">terms of service</Link> for the full payout policy.
          </p>
        </div>
      </section>
    </div>
  );
}
