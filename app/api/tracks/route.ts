import { NextResponse } from "next/server";
import { listTracks } from "@/lib/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tracks = await listTracks({
    genre: searchParams.get("genre") ?? undefined,
    artist: searchParams.get("artist") ?? undefined,
    year: searchParams.get("year") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  return NextResponse.json({ count: tracks.length, tracks });
}
