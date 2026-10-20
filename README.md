# Levi Music

**Stream East Africa. Support your artists.**

Levi Music is an East African music streaming and artist discovery platform. Listeners stream tracks free, follow artists and send M-Pesa tips. Artists upload music, watch their plays and track earnings in Kenyan shillings.

The product is built directly on top of the uploaded **One Music** template (`one-music-gh-pages`). The template's structure, palette, typography, spacing, button styles, section headings, breadcrumb band, preloader, footer and image language are preserved. Nothing was redesigned.

---

## Template audit (from the uploaded zip)

**Full file tree:** 127 files, preserved at `/public` exactly as shipped (`index.html`, `albums-store.html`, `blog.html`, `contact.html`, `elements.html`, `event.html`, `login.html`, `css/`, `js/`, `fonts/`, `img/`, `audio/`, `scss/`, `.sass-cache/`, `style.css`, `style.css.map`).

| Audit item | Finding |
| --- | --- |
| CSS custom properties | None defined in the template. The palette is hard coded in `scss/_theme_color.scss`: heading `#232323`, text `#5f5f5f`, default background `#000000`, gray background `#f5f9fa`, primary `#232323`, white `#ffffff`, dark `#000000`, border `#eaeaea`, hover `#232323`, footer `#000000`, secondary `#838383`. These are mirrored as `--levi-*` tokens in `app/globals.css`. |
| @font-face rules | None in `style.css`. Icon fonts are declared in `css/font-awesome.min.css` (FontAwesome, `../fonts/fontawesome-webfont.*`) and `css/one-music-icon.css` (icomoon), both reproduced verbatim with `url()` paths re-pointed at `/fonts/`. Body copy uses the template's Google import: `Archivo Narrow:400,400i,500,500i,600,600i,700,700i`. No font was swapped or added. |
| API routes | None. All API routes in this build are new. |
| Environment variables | None referenced anywhere in the template. |
| Loading screen | Present: `index.html` preloader with the `.lds-ellipsis` four dot animation. Reproduced exactly in `components/Preloader.tsx`. |
| Cookie consent | Absent. Built in `components/CookieConsent.tsx` per Step 11. |
| CAPTCHA | Absent. Google reCAPTCHA v3 with a v2 fallback, server verification in `lib/recaptcha.ts`. |
| `/legal/*` pages | Absent. Built (`privacy-policy`, `terms`, `cookie-policy`). |
| `/404`, `/500` | Absent. Built (`app/not-found.tsx`, `app/error.tsx`). |

**Template stylesheet handling.** `style.css` and its imports are copied into `app/vendor/` and imported by `app/globals.css` so the bundler can process them. Asset URLs inside those files were rewritten from `../fonts/…` to `/fonts/…` so the original icon fonts continue to load. No rule, colour, or font was changed. Levi Music additions sit in `app/globals.css` after the template rules and reuse template classes (`.oneMusic-btn`, `.section-heading`, `.breadcumb-area`, `.preloader`, `.bg-overlay`, `.single-album-area`, `.footer-area`) wherever possible.

---

## Stack

Exact versions, no carets or tildes. See `package.json`.

next 16.4.2 · react 19.2.0 · react-dom 19.2.0 · typescript 5.8.3 · @types/node 24.0.10 · @types/react 19.1.6 · @types/react-dom 19.1.6 · tailwindcss 4.1.10 · postcss 8.5.30 · autoprefixer 10.4.21 · next-auth (see note) · framer-motion 12.18.0 · lucide-react 0.523.0 · @vercel/kv 3.0.0 · @vercel/blob (see note) · nodemailer (see note) · @types/nodemailer 6.4.17 · react-hook-form 7.57.0 · zod 3.25.67 · zustand 5.0.6 · gsap 3.12.7 · lenis 1.3.4 · qrcode 1.5.4 · jspdf (see note) · html2canvas 1.4.1 · @vercel/analytics 1.5.0 · @vercel/speed-insights 1.2.0.

Overrides: `postcss 8.5.30`, `sharp 0.35.5`, `sprintf-js 1.1.3`. Engines: Node `>=24`. `.nvmrc`: `24`.

### Security driven version notes

Step 18 requires `npm audit` to report **zero critical and zero high** findings. Four pinned versions could not meet that, so they are the only deviations from the requested stack:

| Package | Requested | Installed | Reason |
| --- | --- | --- | --- |
| next-auth | 5.0.0-beta.28 | 5.0.0-beta.32 | beta.28 pulls `@auth/core <= 0.41.2` with critical Auth.js advisories (homoglyph email bypass, malformed Bearer crash, OAuth state cookie mix-up). |
| @vercel/blob | 0.29.4 | 2.8.2 | 0.29.4 does not exist on npm; every 0.x/1.x/2.0.x release depends on vulnerable `undici`/`@fastify/busboy` (high: CRLF injection and DoS in multipart parsing). |
| nodemailer | 6.10.1 | 10.1.7 | 6.10.1 has three critical and three high advisories (SMTP command injection, header injection, address parser DoS). |
| jspdf | 3.0.1 | 4.2.1 | 3.0.1 has critical PDF injection advisories; 3.0.4 is still affected. |

Two transitive helpers, `motion-dom 12.18.2` and `motion-utils 12.12.1`, are pinned as direct dependencies because framer-motion 12.18.0 breaks when npm resolves the newer 12.43 line. This keeps `framer-motion` itself at the exact requested 12.18.0.

`npm audit --audit-level=high` now returns **0 vulnerabilities**.

---

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero with GSAP parallax, genre strip, 4 featured tracks, 3 artist spotlight cards, two column how it works, top 10 chart. |
| `/music` | Catalogue with genre chips, artist/year filters, sort by newest, most played, trending, live search. |
| `/music/[slug]` | Cover, title, artist link, genre, release date, plays, lyrics, play, add to playlist, WhatsApp share and copy link, related tracks. |
| `/artists` | Directory with search, genre and country filters for Kenya, Tanzania, Uganda, Rwanda and Ethiopia. |
| `/artists/[username]` | Artist hero, follow, support modal (KES 50, 100, 250, 500, custom, M-Pesa), latest upload highlight, discography, about. |
| `/upload` | Session and artist role required. Title, genre, cover and audio upload to Vercel Blob, lyrics, release date, explicit toggle, react-hook-form with zod validation, reCAPTCHA v3. |
| `/player` | Full player view with scrubbable progress, volume, queue. The fixed mini player runs on every page. |
| `/dashboard/artist` | Monthly and all time plays, followers, estimated KES earnings, per track table, earnings history, upload CTA. |
| `/dashboard/listener` | Recently played, saved tracks, followed artists. |
| `/auth/signin`, `/auth/signup` | Listener and artist flows, Google OAuth, credentials demo access, reCAPTCHA v3 with v2 fallback. |
| `/contact` | Template contact form restyled with react-hook-form and zod, reCAPTCHA verification, nodemailer delivery. |
| `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy` | Kenya Data Protection Act 2019 aligned legal copy. |
| `/404`, `/500` | Music note 404 and Try Again error page with the WhatsApp number. |

## API

`/api/tracks` (genre, artist, year, sort, q) · `/api/tracks/[slug]` · `/api/tracks/play` · `/api/artists` (genre, country, q) · `/api/artists/[username]` · `/api/upload/track` · `/api/support/artist` · `/api/dashboard/artist/stats` · `/api/contact` · `/api/recaptcha/verify` · `/api/auth/[...nextauth]`.

Play counts and uploads persist in Vercel KV when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are present and fall back to an in-memory store otherwise so the preview still works. Uploads go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, and fall back to the bundled demo clip.

## Demo accounts

`artist@levi.music` and `listener@levi.music`, any password of six characters or more. Google OAuth appears when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured.

## Experience details

- **Preloader**: the template's four dot `lds-ellipsis` loader, dismissed after hydration with a 3 second ceiling, `role="status"`, reduced motion respected.
- **Cookie consent**: full width bottom banner, Accept All, Necessary only, and Manage preferences with Necessary (locked), Functional, Analytics and Marketing toggles. Stored under `levi_music_consent`.
- **Voice tour**: fixed bottom left, 56 by 56, `Volume2` / `VolumeX`, pulsing ring while speaking, tooltip, accessible name changes to "Replay tour" after the first run. Rate 0.97, pitch 1.12, `en-KE`. Starts on the first scroll or click, never before.
- **WhatsApp**: fixed bottom right, `#25D366`, pre-filled message, z-index 9998.
- **Docking**: the mini player sits above both floating buttons, the cookie banner pushes the dock up, and nothing overlaps at any width.
- **Animation**: Lenis smooth scroll, template loader animation, Framer Motion card hover lift, artist card stagger in view, mini player slide up, CSS scroll snap on the genre strip, scrub transition on progress, WhatsApp entrance pulse, GSAP hero parallax. All of it respects `prefers-reduced-motion`.

## Local development

```bash
cp .env.example .env.local
npm ci
npm run dev
```

```bash
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

All three pass in this repository.

## Assets

Pexels photography in `/public/images/`, credits in `image-credits.md`. Demo audio ships with the template. No licensed music is hosted.
