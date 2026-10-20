import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "listener" | "artist";
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "listener" | "artist";
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "listener" | "artist";
    username?: string;
    uid?: string;
  }
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (id?: number) => void;
    };
    __leviRecaptchaV2Ready?: () => void;
  }
}
