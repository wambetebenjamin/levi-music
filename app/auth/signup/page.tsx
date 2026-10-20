import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a free Levi Music listener account or an artist account to upload music and earn from every play.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === "artist" ? "artist" : "listener";

  return (
    <div className="levi-page">
      <PageHero
        eyebrow="Free to join"
        title="Create account"
        image="/images/artist-amara.jpg"
        small
      />
      <section className="levi-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <AuthForm mode="signup" initialRole={role} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
