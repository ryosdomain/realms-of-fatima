import { connection } from "next/server";
import MordernBookCard from "@/components/MordernBookCard";
import { getLibrary } from "@/lib/reader";

const duration = (minutes: number) =>
  minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;

export default async function LibrarySection() {
  await connection();
  const library = await getLibrary();

  return (
    <section id="library" className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-310 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a45134]">From the library</p>
        <h2 className="mx-auto mt-4 max-w-xl font-serif text-4xl tracking-[-0.035em] text-[#183a31] md:text-5xl">
          More places to lose yourself
        </h2>

        {library.length === 0 ? (
          <p className="mt-12 text-sm text-[#87908b]">New stories will appear here as soon as they're published.</p>
        ) : (
          <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {library.map((b) => (
              <MordernBookCard
                key={b.id}
                href={`/?book=${b.id}&chapter=${b.chapters[0].id}#reader`}
                book={{
                  title: b.title,
                  genre: b.genre ?? "Story",
                  chapters: b.chapters.length,
                  readTime: duration(b.chapters.reduce((sum, c) => sum + c.minutes, 0)),
                  synopsis: b.description ?? "",
                  cover_from: b.cover_from,
                  cover_to: b.cover_to,
                  cover_shape: b.cover_shape,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}