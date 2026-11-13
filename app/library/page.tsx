import { Suspense } from "react";
import { connection } from "next/server";
import { getLibrary } from "@/lib/reader";
import LibraryBrowser, { type LibraryItem } from "@/components/LibraryBrowser";

export const metadata = { title: "Library" };

async function Books() {
  await connection();
  const library = await getLibrary();

  const items: LibraryItem[] = library.map((b) => ({
    id: b.id,
    title: b.title,
    genre: b.genre ?? "Story",
    description: b.description ?? "",
    cover_from: b.cover_from,
    cover_to: b.cover_to,
    cover_shape: b.cover_shape,
    chapters: b.chapters.length,
    minutes: b.chapters.reduce((sum, c) => sum + c.minutes, 0),
    firstChapterId: b.chapters[0].id,
  }));

  return <LibraryBrowser items={items} />;
}

export default function LibraryPage() {
  return (
    <main className="min-h-screen px-5 pb-24 pt-14 md:px-10 md:pt-20">
      <div className="mx-auto max-w-310">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a45134]">The library</p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl tracking-[-0.035em] text-[#183a31] md:text-6xl">
          Every story, in one place
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#66736d]">
          Search by title or topic, filter by genre or reading time, then pick one and start reading.
        </p>

        <div className="mt-10">
          <Suspense fallback={<p className="text-sm text-[#87908b]">Loading stories…</p>}>
            <Books />
          </Suspense>
        </div>
      </div>
    </main>
  );
}