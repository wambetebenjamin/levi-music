"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { genres, releaseYears, artists } from "@/lib/data";

const sorts = [
  { value: "newest", label: "Newest first" },
  { value: "most-played", label: "Most played" },
  { value: "trending", label: "Trending" },
];

export function MusicFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const current = {
    genre: params.get("genre") ?? "",
    artist: params.get("artist") ?? "",
    year: params.get("year") ?? "",
    sort: params.get("sort") ?? "newest",
    q: params.get("q") ?? "",
  };

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      router.push(`/music${next.toString() ? `?${next.toString()}` : ""}`, { scroll: false });
    },
    [params, router],
  );

  return (
    <>
      <div className="levi-chip-row" role="group" aria-label="Filter by genre">
        <button
          type="button"
          className={`levi-chip ${!current.genre ? "is-active" : ""}`}
          onClick={() => update("genre", "")}
        >
          All genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre.slug}
            type="button"
            className={`levi-chip ${current.genre === genre.slug ? "is-active" : ""}`}
            onClick={() => update("genre", genre.slug)}
            aria-pressed={current.genre === genre.slug}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="levi-filter-bar">
        <div className="levi-field">
          <label htmlFor="filter-artist">Artist</label>
          <select
            id="filter-artist"
            className="form-control"
            value={current.artist}
            onChange={(e) => update("artist", e.target.value)}
          >
            <option value="">All artists</option>
            {artists.map((artist) => (
              <option key={artist.username} value={artist.username}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        <div className="levi-field">
          <label htmlFor="filter-year">Release year</label>
          <select
            id="filter-year"
            className="form-control"
            value={current.year}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="">All years</option>
            {releaseYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="levi-field">
          <label htmlFor="filter-sort">Sort by</label>
          <select
            id="filter-sort"
            className="form-control"
            value={current.sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            {sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>

        <div className="levi-field">
          <label htmlFor="filter-search">Search</label>
          <input
            id="filter-search"
            className="form-control"
            type="search"
            placeholder="Track or artist"
            defaultValue={current.q}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                update("q", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>

        <div className="levi-filter-actions">
          <button
            type="button"
            className="btn oneMusic-btn levi-btn-sm"
            onClick={() => router.push("/music", { scroll: false })}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
