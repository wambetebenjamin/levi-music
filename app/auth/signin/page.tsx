import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Levi Music to stream East African music, follow artists and save tracks.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === "artist" ? "artist" : "listener";

  return (
    <div className="levi-page">
      <PageHero eyebrow="Welcome back" title="Sign in" image="/images/hero-performer.jpg" small />
      <section className="levi-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <AuthForm mode="signin" initialRole={role} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
