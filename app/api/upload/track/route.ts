import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { saveTrack } from "@/lib/repository";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { slugify } from "@/lib/utils";
import { DEMO_AUDIO, genres } from "@/lib/data";
import type { GenreSlug, Track } from "@/lib/types";

const MAX_AUDIO = 20 * 1024 * 1024;
const MAX_COVER = 5 * 1024 * 1024;
const AUDIO_EXT = /\.(mp3|wav)$/i;

const schema = z.object({
  title: z.string().min(2, "Title is too short").max(120),
  genre: z.string().refine((value) => genres.some((g) => g.slug === value), "Unknown genre"),
  lyrics: z.string().max(8000).optional(),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid release date"),
  explicit: z.enum(["true", "false"]),
});

async function uploadToBlob(file: File, folder: string): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { put } = await import("@vercel/blob");
    const safeName = `${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${file.name.match(/\.[^.]+$/)?.[0] ?? ""}`;
    const blob = await put(safeName, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });
    return blob.url;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (session.user.role !== "artist") {
    return NextResponse.json({ error: "Artist account required" }, { status: 403 });
  }

  const form = await request.formData();
  const parsed = schema.safeParse({
    title: String(form.get("title") ?? ""),
    genre: String(form.get("genre") ?? ""),
    lyrics: String(form.get("lyrics") ?? ""),
    releaseDate: String(form.get("releaseDate") ?? ""),
    explicit: String(form.get("explicit") ?? "false"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid upload details" },
      { status: 400 },
    );
  }

  const verified = await verifyRecaptcha(String(form.get("recaptchaToken") ?? ""), "upload");
  if (!verified.success) {
    return NextResponse.json(
      {
        error: verified.fallback
          ? "Security challenge required"
          : "reCAPTCHA verification failed",
        fallback: Boolean(verified.fallback),
      },
      { status: 400 },
    );
  }

  const audio = form.get("audio");
  const cover = form.get("cover");
  if (!(audio instanceof File) || !(cover instanceof File)) {
    return NextResponse.json({ error: "Audio and cover art are both required" }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO) {
    return NextResponse.json({ error: "Audio must be 20MB or smaller" }, { status: 400 });
  }
  if (!AUDIO_EXT.test(audio.name) && !["audio/mpeg", "audio/wav", "audio/x-wav"].includes(audio.type)) {
    return NextResponse.json({ error: "Audio must be MP3 or WAV" }, { status: 400 });
  }
  if (cover.size > MAX_COVER) {
    return NextResponse.json({ error: "Cover art must be 5MB or smaller" }, { status: 400 });
  }
  if (!cover.type.startsWith("image/")) {
    return NextResponse.json({ error: "Cover art must be an image" }, { status: 400 });
  }

  const [audioUrl, coverUrl] = await Promise.all([
    uploadToBlob(audio, "tracks/audio"),
    uploadToBlob(cover, "tracks/covers"),
  ]);

  const slugBase = slugify(parsed.data.title) || "untitled-track";
  const artist = session.user;
  const track: Track = {
    id: `trk_${slugBase}_${Date.now()}`,
    slug: `${slugBase}-${Date.now().toString(36).slice(-4)}`,
    title: parsed.data.title,
    artistUsername: artist.username,
    artistName: artist.name ?? artist.username,
    genre: parsed.data.genre as GenreSlug,
    cover: coverUrl ?? "/images/cover-1.jpg",
    releaseDate: parsed.data.releaseDate,
    plays: 0,
    duration: "3:30",
    audio: audioUrl ?? DEMO_AUDIO,
    lyrics: parsed.data.lyrics?.trim() ? parsed.data.lyrics : null,
    explicit: parsed.data.explicit === "true",
    status: "published",
  };

  await saveTrack(track);

  return NextResponse.json(
    {
      track,
      storage: audioUrl ? "vercel-blob" : "demo",
      message: audioUrl
        ? "Track uploaded to Vercel Blob"
        : "Track saved in demo mode because BLOB_READ_WRITE_TOKEN is not configured",
    },
    { status: 201 },
  );
}
