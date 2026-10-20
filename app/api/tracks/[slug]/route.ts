import { NextResponse } from "next/server";
import { findTrack, relatedTo } from "@/lib/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const track = await findTrack(slug);
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }
  const related = await relatedTo(track);
  return NextResponse.json({ track, related });
}
