import { NextResponse } from "next/server";
import { z } from "zod";
import { registerPlay } from "@/lib/repository";

const schema = z.object({
  trackId: z.string().min(1, "trackId is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "trackId is required" }, { status: 400 });
    }

    const plays = await registerPlay(parsed.data.trackId);
    return NextResponse.json({ ok: true, trackId: parsed.data.trackId, plays });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not record play";
    const status = message === "Track not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
