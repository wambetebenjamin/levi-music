"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { genreName, followerCount } from "@/lib/data";
import type { Artist } from "@/lib/types";

export function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) {
  return (
    <motion.article
      className="levi-artist-card"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4), ease: "easeOut" }}
    >
      <Link href={`/artists/${artist.username}`} className="levi-artist-photo" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artist.photo} alt="" width={118} height={118} />
      </Link>
      <div className="levi-artist-eyebrow">
        {genreName(artist.genre)} <span aria-hidden="true">/</span> {artist.country}
      </div>
      <h5>
        <Link href={`/artists/${artist.username}`}>{artist.name}</Link>
      </h5>
      <p className="levi-artist-meta">{followerCount(artist.followers)} followers</p>
      <div className="levi-artist-foot">
        <span>{artist.verified ? "Verified artist" : "New artist"}</span>
        <Link
          href={`/artists/${artist.username}`}
          className="btn oneMusic-btn levi-btn-sm"
          aria-label={`Listen to ${artist.name}`}
        >
          Listen
        </Link>
      </div>
    </motion.article>
  );
}
