import { NextResponse } from "next/server";
import { listArtists } from "@/lib/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artists = await listArtists({
    genre: searchParams.get("genre") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  return NextResponse.json({ count: artists.length, artists });
}
