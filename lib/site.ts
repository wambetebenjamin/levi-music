export const siteConfig = {
  name: "Levi Music",
  tagline: "Stream East Africa. Support your artists.",
  description:
    "Levi Music is an East African music streaming and artist discovery platform. Listeners stream Afrobeats, Gengetone, Benga, Gospel, Bongo Flava and more for free. Artists upload their music and earn from every play.",
  whatsapp: "254112272061",
  whatsappMessage:
    "Hello Levi Music, I would like to ask about streaming or uploading music as an artist.",
  consentKey: "levi_music_consent",
};

export const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
  siteConfig.whatsappMessage,
)}`;

export const voiceTourScript =
  "Welcome to Levi Music. This is where East African music lives. Stream Afrobeats, Gengetone, Gospel, Bongo Flava, and more, completely free. Discover new artists from Kenya, Tanzania, Uganda, and beyond, and support them directly with a tip. If you are an artist, upload your music, build your fanbase, and start earning from every play. This platform is for us, built in East Africa, for East Africa.";

export function formatKes(value: number): string {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
