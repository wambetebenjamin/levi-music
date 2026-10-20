"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { getRecaptchaToken } from "@/components/recaptcha";
import { RecaptchaChallenge } from "@/components/RecaptchaChallenge";

type Role = "listener" | "artist";

const signinSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = signinSchema.extend({
  name: z.string().min(2, "Tell us your name"),
});

type FormValues = z.infer<typeof signupSchema>;

export function AuthForm({
  mode,
  initialRole = "listener",
}: {
  mode: "signin" | "signup";
  initialRole?: Role;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [challenge, setChallenge] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const destination = role === "artist" ? "/dashboard/artist" : "/dashboard/listener";

  const onSubmit = async (values: FormValues) => {
    const parsed = (mode === "signup" ? signupSchema : signinSchema).safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as keyof FormValues, { message: issue.message });
      }
      return;
    }

    setStatus("working");
    setFeedback("");

    try {
      const token =
        challengeToken || (await getRecaptchaToken(mode === "signup" ? "signup" : "signin"));
      const verified = await fetch("/api/recaptcha/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: mode }),
      }).then((r) => r.json() as Promise<{ success: boolean; fallback?: boolean }>);

      if (!verified.success) {
        setStatus("error");
        setChallenge(true);
        setFeedback(
          verified.fallback
            ? "Please complete the security check below, then continue."
            : "We could not verify this request. Please complete the security check and try again.",
        );
        return;
      }

      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        role,
        name: "name" in parsed.data ? parsed.data.name : "",
        redirect: false,
      });

      if (result?.error) {
        setStatus("error");
        setFeedback(
          "Those details did not work. Use your Levi Music account or continue with Google.",
        );
        return;
      }

      router.push(destination);
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="levi-form-card">
      <h2>{mode === "signin" ? "Welcome back" : "Join Levi Music"}</h2>
      <p className="levi-form-sub">
        {mode === "signin"
          ? "Sign in to stream your playlists, follow artists, and pick up where you left off."
          : "Create a listener or artist account. Artists can upload music and earn from plays."}
      </p>

      <div className="levi-auth-roles" role="radiogroup" aria-label="Account type">
        <button
          type="button"
          role="radio"
          aria-checked={role === "listener"}
          className={`levi-role-card ${role === "listener" ? "is-active" : ""}`}
          onClick={() => setRole("listener")}
        >
          <strong>Listener</strong>
          <span>Stream free, save tracks, follow artists.</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={role === "artist"}
          className={`levi-role-card ${role === "artist" ? "is-active" : ""}`}
          onClick={() => setRole("artist")}
        >
          <strong>Artist</strong>
          <span>Upload music, track plays, earn revenue.</span>
        </button>
      </div>

      {status === "error" && (
        <div className="levi-form-status error" role="alert">
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {mode === "signup" && (
          <div className="levi-input-group mb-30">
            <label htmlFor="auth-name">Full name</label>
            <input
              id="auth-name"
              className="form-control"
              autoComplete="name"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="levi-error-text">{errors.name.message}</span>}
          </div>
        )}

        <div className="levi-input-group mb-30">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="form-control"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="levi-error-text">{errors.email.message}</span>}
        </div>

        <div className="levi-input-group mb-30">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="form-control"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            {...register("password")}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <span className="levi-error-text">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="btn oneMusic-btn"
          style={{ width: "100%" }}
          disabled={status === "working"}
        >
          {status === "working"
            ? "Please wait"
            : mode === "signin"
              ? `Sign in as ${role}`
              : `Create ${role} account`}
        </button>
      </form>

      {challenge && (
        <div className="mt-30">
          <RecaptchaChallenge onToken={setChallengeToken} />
        </div>
      )}

      <div className="levi-divider">or</div>

      <button
        type="button"
        className="levi-google-btn"
        onClick={() => signIn("google", { callbackUrl: destination })}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.35 11.1H12v3.2h5.35c-.25 1.5-1.75 4.4-5.35 4.4a6.1 6.1 0 0 1 0-12.2c1.75 0 2.95.75 3.65 1.4l2.5-2.4A9.6 9.6 0 0 0 12 2.4a9.6 9.6 0 1 0 0 19.2c5.55 0 9.25-3.9 9.25-9.4 0-.65-.05-1.1-.15-1.6Z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="levi-note mt-30">
        {mode === "signin" ? (
          <>
            New to Levi Music? <Link href={`/auth/signup?role=${role}`}>Create an account</Link>.
          </>
        ) : (
          <>
            Already have an account? <Link href={`/auth/signin?role=${role}`}>Sign in</Link>.
          </>
        )}
      </p>
      <p className="levi-note" style={{ fontSize: 12 }}>
        Protected by reCAPTCHA v3. By continuing you agree to the{" "}
        <Link href="/legal/terms">terms of service</Link> and{" "}
        <Link href="/legal/privacy-policy">privacy policy</Link>.
      </p>
      <p className="levi-note" style={{ fontSize: 12 }}>
        Demo accounts for review: artist@levi.music or listener@levi.music, any password of six
        characters or more.
      </p>
    </div>
  );
}
