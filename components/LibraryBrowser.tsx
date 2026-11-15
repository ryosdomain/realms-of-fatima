"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import MordernBookCard from "@/components/MordernBookCard";

export type LibraryItem = {
  id: string;
  title: string;
  genre: string;
  description: string;
  cover_from: string;
  cover_to: string;
  cover_shape: string | null;
  chapters: number;
  minutes: number;
  firstChapterId: string;
};

const sorts = [
  ["featured", "Featured & newest"],
  ["az", "Title A–Z"],
  ["chapters", "Most chapters"],
  ["short", "Shortest read"],
  ["long", "Longest read"],
] as const;

const lengths = [
  ["any", "Any length"],
  ["quick", "Under 30 min"],
  ["medium", "30–90 min"],
  ["long", "Over 90 min"],
] as const;

const duration = (minutes: number) =>
  minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;

const selectCls =
  "h-11 rounded-xl border border-[#18382f]/25 bg-white px-3 text-xs font-semibold text-[#32453f] outline-none transition focus:border-[#a45134]";

export default function LibraryBrowser({ items }: { items: LibraryItem[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [length, setLength] = useState<(typeof lengths)[number][0]>("any");
  const [sort, setSort] = useState<(typeof sorts)[number][0]>("featured");

  // genre chips, with how many books each one has
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((b) => counts.set(b.genre, (counts.get(b.genre) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const q = query.trim().toLowerCase();

  const result = useMemo(() => {
    return items
      .map((b, index) => ({ b, index })) // index = the order the server gave (featured, then newest)
      .filter(
        ({ b }) =>
          (genre === "All" || b.genre === genre) &&
          (!q || `${b.title} ${b.genre} ${b.description}`.toLowerCase().includes(q)) &&
          (length === "any" ||
            (length === "quick" && b.minutes < 30) ||
            (length === "medium" && b.minutes >= 30 && b.minutes <= 90) ||
            (length === "long" && b.minutes > 90))
      )
      .sort((x, y) => {
        switch (sort) {
          case "az":
            return x.b.title.localeCompare(y.b.title);
          case "chapters":
            return y.b.chapters - x.b.chapters;
          case "short":
            return x.b.minutes - y.b.minutes;
          case "long":
            return y.b.minutes - x.b.minutes;
          default:
            return x.index - y.index;
        }
      })
      .map(({ b }) => b);
  }, [items, genre, q, length, sort]);

  const hasFilters = q !== "" || genre !== "All" || length !== "any";
  const clear = () => {
    setQuery("");
    setGenre("All");
    setLength("any");
  };

  return (
    <>
      {/* search + selects */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87908b]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre or what it's about"
            className="h-11 w-full rounded-xl border border-[#18382f]/25 bg-white pl-11 pr-10 text-sm outline-none transition placeholder:text-[#87908b] focus:border-[#a45134]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[#87908b] hover:bg-[#eae4d8]"
            >
              <X size={14} />
            </button>
          )}
        </label>

        <div className="grid grid-cols-2 gap-3 md:flex">
          <select value={length} onChange={(e) => setLength(e.target.value as typeof length)} aria-label="Reading time" className={selectCls}>
            {lengths.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort books" className={selectCls}>
            {sorts.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* genre chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[["All", items.length] as const, ...genres].map(([name, count]) => (
          <button
            key={name}
            onClick={() => setGenre(name)}
            aria-pressed={genre === name}
            className={`shrink-0 rounded-full border border-[#18382f]/25 px-4 py-2 text-xs font-semibold transition ${
              genre === name
                ? "border-[#183a31] bg-[#183a31] text-white"
                : "border-[#18382f]/25 bg-white text-[#32453f] hover:bg-[#eae4d8]"
            }`}
          >
            {name} <span className={genre === name ? "text-white/60" : "text-[#87908b]"}>{count}</span>
          </button>
        ))}
      </div>

      {/* count + clear */}
      <div className="mt-6 flex items-center justify-between text-xs text-[#78817b]">
        <p>
          Showing {result.length} of {items.length} {items.length === 1 ? "story" : "stories"}
        </p>
        {hasFilters && (
          <button onClick={clear} className="font-semibold text-[#a45134] hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* the books */}
      {result.length > 0 ? (
        <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {result.map((b) => (
            <MordernBookCard
              key={b.id}
              href={`/?book=${b.id}&chapter=${b.firstChapterId}#reader`}
              book={{
                title: b.title,
                genre: b.genre,
                chapters: b.chapters,
                readTime: duration(b.minutes),
                synopsis: b.description,
                cover_from: b.cover_from,
                cover_to: b.cover_to,
                cover_shape: b.cover_shape,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-[#18382f]/25 px-6 py-16 text-center">
          <p className="font-serif text-2xl text-[#183a31]">
            {items.length === 0 ? "No stories yet" : "Nothing matches"}
          </p>
          <p className="mt-2 text-sm text-[#78817b]">
            {items.length === 0
              ? "New stories will appear here as soon as they're published."
              : "Try a different word or clear the filters."}
          </p>
          {hasFilters && (
            <button
              onClick={clear}
              className="mt-6 rounded-full border border-[#18382f]/25 px-6 py-2.5 text-sm font-semibold transition hover:bg-[#183a31] hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </>
  );
}