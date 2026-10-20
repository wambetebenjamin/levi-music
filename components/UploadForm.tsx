"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UploadCloud } from "lucide-react";
import { getRecaptchaToken } from "@/components/recaptcha";
import { RecaptchaChallenge } from "@/components/RecaptchaChallenge";
import { genres } from "@/lib/data";
import type { GenreSlug } from "@/lib/types";

const schema = z.object({
  title: z.string().min(2, "Add the track title"),
  genre: z.string().min(1, "Choose a genre"),
  lyrics: z.string().optional(),
  releaseDate: z.string().min(1, "Choose a release date"),
  explicit: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/wave"];
const MAX_AUDIO = 20 * 1024 * 1024;
const MAX_COVER = 5 * 1024 * 1024;

export function UploadForm() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [challenge, setChallenge] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<{ slug: string; title: string } | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", genre: "", lyrics: "", releaseDate: today, explicit: false },
  });

  const validateFiles = () => {
    if (!cover) return "Add cover art for your release";
    if (cover.size > MAX_COVER) return "Cover art must be 5MB or smaller";
    if (!cover.type.startsWith("image/")) return "Cover art must be an image file";
    if (!audio) return "Add your audio file";
    if (!AUDIO_TYPES.includes(audio.type) && !/\.(mp3|wav)$/i.test(audio.name))
      return "Audio must be an MP3 or WAV file";
    if (audio.size > MAX_AUDIO) return "Audio must be 20MB or smaller";
    return "";
  };

  const onSubmit = async (values: FormValues) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as keyof FormValues, { message: issue.message });
      }
      return;
    }

    const fileMessage = validateFiles();
    if (fileMessage) {
      setFileError(fileMessage);
      return;
    }
    setFileError("");
    setStatus("uploading");
    setFeedback("");

    try {
      const recaptchaToken = challengeToken || (await getRecaptchaToken("upload"));
      const body = new FormData();
      body.append("title", parsed.data.title);
      body.append("genre", parsed.data.genre);
      body.append("lyrics", parsed.data.lyrics ?? "");
      body.append("releaseDate", parsed.data.releaseDate);
      body.append("explicit", String(parsed.data.explicit));
      body.append("recaptchaToken", recaptchaToken);
      body.append("cover", cover as File);
      body.append("audio", audio as File);

      const response = await fetch("/api/upload/track", { method: "POST", body });
      const data = (await response.json()) as {
        track?: { slug: string; title: string };
        error?: string;
        fallback?: boolean;
      };
      if (!response.ok || !data.track) {
        if (data.fallback) {
          setChallenge(true);
          setStatus("idle");
          setFeedback("Complete the security check, then upload again.");
          return;
        }
        throw new Error(data.error ?? "Upload failed");
      }

      setResult({ slug: data.track.slug, title: data.track.title });
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Upload failed");
    }
  };

  if (status === "done" && result) {
    return (
      <div className="levi-form-card">
        <h2>Upload received</h2>
        <p className="levi-form-sub">
          {result.title} is now in your discography and will appear in the catalogue once
          processing finishes. Plays and earnings start counting immediately.
        </p>
        <div className="levi-detail-actions">
          <Link href={`/music/${result.slug}`} className="btn oneMusic-btn">
            View track
          </Link>
          <Link href="/dashboard/artist" className="btn oneMusic-btn levi-btn-sm">
            Artist dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="levi-form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Upload a track</h2>
      <p className="levi-form-sub">
        MP3 or WAV, up to 20MB. Add square cover art and confirm your release details. By
        uploading you confirm you own or control all rights to the recording.
      </p>

      {status === "error" && (
        <div className="levi-form-status error" role="alert">
          {feedback}
        </div>
      )}
      {fileError && (
        <div className="levi-form-status error" role="alert">
          {fileError}
        </div>
      )}

      <div className="levi-form-grid">
        <div className="levi-input-group full">
          <label htmlFor="upload-title">Track title</label>
          <input
            id="upload-title"
            className="form-control"
            {...register("title")}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && <span className="levi-error-text">{errors.title.message}</span>}
        </div>

        <div className="levi-input-group">
          <label htmlFor="upload-genre">Genre</label>
          <select
            id="upload-genre"
            className="form-control"
            {...register("genre")}
            aria-invalid={Boolean(errors.genre)}
          >
            <option value="">Choose a genre</option>
            {genres.map((genre: { slug: GenreSlug; name: string }) => (
              <option key={genre.slug} value={genre.slug}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genre && <span className="levi-error-text">{errors.genre.message}</span>}
        </div>

        <div className="levi-input-group">
          <label htmlFor="upload-date">Release date</label>
          <input
            id="upload-date"
            className="form-control"
            type="date"
            {...register("releaseDate")}
            aria-invalid={Boolean(errors.releaseDate)}
          />
          {errors.releaseDate && (
            <span className="levi-error-text">{errors.releaseDate.message}</span>
          )}
        </div>

        <div className="levi-input-group">
          <label htmlFor="upload-cover">Cover art</label>
          <input
            id="upload-cover"
            ref={coverRef}
            className="form-control"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setCover(e.target.files?.[0] ?? null);
              setFileError("");
            }}
          />
          <span className="levi-hint">
            {cover ? `${cover.name} selected` : "Square image, JPG or PNG, up to 5MB."}
          </span>
        </div>

        <div className="levi-input-group">
          <label htmlFor="upload-audio">Audio file</label>
          <input
            id="upload-audio"
            ref={audioRef}
            className="form-control"
            type="file"
            accept=".mp3,audio/mpeg,.wav,audio/wav"
            onChange={(e) => {
              setAudio(e.target.files?.[0] ?? null);
              setFileError("");
            }}
          />
          <span className="levi-hint">
            {audio
              ? `${audio.name} (${(audio.size / (1024 * 1024)).toFixed(1)}MB)`
              : "MP3 or WAV, up to 20MB."}
          </span>
        </div>

        <div className="levi-input-group full">
          <label htmlFor="upload-lyrics">Lyrics (optional)</label>
          <textarea
            id="upload-lyrics"
            className="form-control"
            rows={6}
            placeholder="Paste the full lyrics, including translations if you have them."
            {...register("lyrics")}
          />
        </div>

        <div className="levi-input-group full">
          <div className="levi-checkbox-row">
            <input id="upload-explicit" type="checkbox" {...register("explicit")} />
            <label htmlFor="upload-explicit">
              This track contains explicit content. We will label it so listeners and family
              filters are informed.
            </label>
          </div>
        </div>
      </div>

      <p className="levi-note mt-30">
        Cover art and audio are stored in Vercel Blob. Files are validated again on the server
        before your track is published.
      </p>

      {challenge && (
        <div className="mt-30">
          <RecaptchaChallenge onToken={setChallengeToken} />
        </div>
      )}

      <button type="submit" className="btn oneMusic-btn mt-30" disabled={status === "uploading"}>
        <UploadCloud size={16} aria-hidden="true" style={{ marginRight: 8 }} />
        {status === "uploading" ? "Uploading" : "Upload track"}
      </button>
      <p className="levi-note mt-30" style={{ fontSize: 12 }}>
        Protected by reCAPTCHA v3. Payouts are calculated from the play rate set by the Levi
        Music team.
      </p>
    </form>
  );
}
