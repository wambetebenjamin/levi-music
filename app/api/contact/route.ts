import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
  recaptchaToken: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the form details" }, { status: 400 });
    }

    const verified = await verifyRecaptcha(parsed.data.recaptchaToken, "contact");
    if (!verified.success) {
      return NextResponse.json(
        {
          error: verified.fallback
            ? "We need an extra security check. Please try again."
            : "reCAPTCHA verification failed",
          fallback: Boolean(verified.fallback),
        },
        { status: 400 },
      );
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT ?? 587),
        secure: Number(SMTP_PORT ?? 587) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: SMTP_FROM ?? SMTP_USER,
        to: SMTP_FROM ?? SMTP_USER,
        replyTo: parsed.data.email,
        subject: `Levi Music contact: ${parsed.data.subject}`,
        text: `${parsed.data.name} (${parsed.data.email})\n\n${parsed.data.message}`,
      });
    }

    return NextResponse.json({
      ok: true,
      message: SMTP_HOST
        ? "Message sent. The Levi Music team will reply soon."
        : "Message received. The team will reply soon, email delivery is not configured in this preview.",
    });
  } catch {
    return NextResponse.json({ error: "Could not send your message" }, { status: 500 });
  }
}
