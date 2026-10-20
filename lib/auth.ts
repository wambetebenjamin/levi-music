import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { SessionUser } from "@/lib/types";

/**
 * Auth is wired for Google OAuth in production and falls back to a demo
 * credentials provider so the platform can be reviewed without secrets.
 */
const isConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const demoUsers: Record<string, SessionUser> = {
  "listener@levi.music": {
    id: "usr_listener_demo",
    name: "Wanjiku Mwende",
    email: "listener@levi.music",
    role: "listener",
    username: "wanjiku",
  },
  "artist@levi.music": {
    id: "usr_artist_demo",
    name: "Amara Njoroge",
    email: "artist@levi.music",
    role: "artist",
    username: "amara-njoroge",
    image: "/images/artist-amara.jpg",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? "levi-music-development-secret",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "credentials",
      name: "Levi Music account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        if (!email || !email.includes("@")) return null;
        const requestedRole = credentials?.role === "artist" ? "artist" : "listener";
        const demo = demoUsers[email];

        if (demo) {
          return { ...demo, role: requestedRole };
        }

        const name = String(credentials?.name ?? email.split("@")[0]);
        return {
          id: `usr_${email.replace(/[^a-z0-9]/g, "")}`,
          name,
          email,
          role: requestedRole,
          username: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as SessionUser).role ?? "listener";
        token.username = (user as SessionUser).username ?? "listener";
        token.uid = user.id;
      }
      if (account?.provider === "google" && token.email) {
        const demo = demoUsers[token.email.toLowerCase()];
        token.role = demo?.role ?? token.role ?? "listener";
        token.username = demo?.username ?? token.username ?? "listener";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "listener" | "artist") ?? "listener";
        session.user.username = (token.username as string) ?? "listener";
        session.user.id = (token.uid as string) ?? "usr_unknown";
      }
      return session;
    },
  },
});

export { isConfigured };
