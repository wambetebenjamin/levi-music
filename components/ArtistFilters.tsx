"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { countries, genres } from "@/lib/data";

export function ArtistFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const genre = params.get("genre") ?? "";
  const country = params.get("country") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      router.push(`/artists${next.toString() ? `?${next.toString()}` : ""}`, { scroll: false });
    },
    [params, router],
  );

  return (
    <div className="levi-filter-bar">
      <div className="levi-field" style={{ flex: "2 1 240px" }}>
        <label htmlFor="artist-search">Search artists</label>
        <input
          id="artist-search"
          className="form-control"
          type="search"
          value={query}
          placeholder="Name or country"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", query);
          }}
        />
      </div>

      <div className="levi-field">
        <label htmlFor="artist-genre">Genre</label>
        <select
          id="artist-genre"
          className="form-control"
          value={genre}
          onChange={(e) => update("genre", e.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="levi-field">
        <label htmlFor="artist-country">Country</label>
        <select
          id="artist-country"
          className="form-control"
          value={country}
          onChange={(e) => update("country", e.target.value)}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="levi-filter-actions">
        <button type="button" className="btn oneMusic-btn levi-btn-sm" onClick={() => update("q", query)}>
          Search
        </button>
        <button
          type="button"
          className="btn oneMusic-btn levi-btn-sm"
          onClick={() => {
            setQuery("");
            router.push("/artists", { scroll: false });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
