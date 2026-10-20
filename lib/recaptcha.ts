export interface RecaptchaResult {
  success: boolean;
  score?: number;
  fallback?: boolean;
  error?: string;
}

/**
 * Server side verification for Google reCAPTCHA v3.
 * When RECAPTCHA_SECRET_KEY is not configured the local review build allows
 * the request so forms remain testable without secrets.
 */
export async function verifyRecaptcha(
  token: string | undefined | null,
  action?: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { success: true, score: 1, fallback: false };
  }
  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return {
        success: false,
        error: (data["error-codes"] ?? ["Verification failed"]).join(", "),
      };
    }

    if (action && data.action && data.action !== action) {
      return { success: false, error: "Action mismatch" };
    }

    // v2 tokens return no score, so only score v3 responses.
    if (typeof data.score === "number" && data.score < 0.5) {
      // Low confidence traffic falls back to an interactive reCAPTCHA v2 check.
      return {
        success: false,
        score: data.score,
        fallback: true,
        error: "Low score, challenge required",
      };
    }

    return { success: true, score: data.score };
  } catch {
    return { success: false, error: "Verification service unavailable" };
  }
}
