import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { artistStats, earningsHistory } from "@/lib/repository";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (session.user.role !== "artist") {
    return NextResponse.json({ error: "Artist account required" }, { status: 403 });
  }

  const stats = await artistStats(session.user.username);
  const history = await earningsHistory(session.user.username);

  return NextResponse.json({
    artist: {
      username: session.user.username,
      name: session.user.name,
    },
    stats,
    history,
  });
}
