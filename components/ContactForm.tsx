"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getRecaptchaToken } from "@/components/recaptcha";
import { RecaptchaChallenge } from "@/components/RecaptchaChallenge";

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "Add a little more detail"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [challenge, setChallenge] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: "", email: "", subject: "", message: "" } });

  const onSubmit = async (values: FormValues) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as keyof FormValues, { message: issue.message });
      }
      return;
    }

    setStatus("sending");
    setFeedback("");
    try {
      const recaptchaToken = challengeToken || (await getRecaptchaToken("contact"));
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, recaptchaToken }),
      });
      const data = (await response.json()) as {
        message?: string;
        error?: string;
        fallback?: boolean;
      };
      if (!response.ok) {
        if (data.fallback) {
          setChallenge(true);
          setStatus("idle");
          setFeedback("Please complete the security check, then send again.");
          return;
        }
        throw new Error(data.error ?? "Message could not be sent");
      }
      setStatus("done");
      setChallenge(false);
      setFeedback(data.message ?? "Message sent. We will reply shortly.");
      reset();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Message could not be sent");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {status === "done" && (
        <div className="levi-form-status success" role="status">
          {feedback}
        </div>
      )}
      {status === "error" && (
        <div className="levi-form-status error" role="alert">
          {feedback}
        </div>
      )}

      <div className="levi-form-grid">
        <div className="levi-input-group">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            className="form-control"
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="levi-error-text">{errors.name.message}</span>}
        </div>

        <div className="levi-input-group">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            className="form-control"
            type="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="levi-error-text">{errors.email.message}</span>}
        </div>

        <div className="levi-input-group full">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            className="form-control"
            {...register("subject")}
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject && <span className="levi-error-text">{errors.subject.message}</span>}
        </div>

        <div className="levi-input-group full">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            className="form-control"
            rows={6}
            {...register("message")}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && <span className="levi-error-text">{errors.message.message}</span>}
        </div>
      </div>

      {challenge && (
        <div className="mt-30">
          <RecaptchaChallenge onToken={setChallengeToken} />
        </div>
      )}

      <button type="submit" className="btn oneMusic-btn mt-30" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send message"}
      </button>
      <p className="levi-note mt-30">
        This form is protected by reCAPTCHA v3. We only use your details to reply to this message.
      </p>
    </form>
  );
}
