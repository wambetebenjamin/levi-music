import { NextResponse } from "next/server";
import { artistDiscography, findArtist } from "@/lib/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const artist = await findArtist(username);
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
  const tracks = await artistDiscography(username);
  return NextResponse.json({ artist, tracks });
}
