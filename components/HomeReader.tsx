import Link from "next/link";
import { connection } from "next/server";
import HeroSection from "@/components/HeroSection";
import ReaderDrawer from "@/components/ReaderDrawer";
import { getAuthorBook, getChapter, getLibrary, plain, toPages } from "@/lib/reader";

function Notice({ title, text, link }: { title: string; text: string; link?: boolean }) {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-[#17352d] px-5 py-24 text-center text-[#f7f2e8]">
      <div className="max-w-md">
        <h2 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{text}</p>
        {link && (
          <Link
            href="/library"
            className="mt-8 inline-block rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Browse the library
          </Link>
        )}
      </div>
    </section>
  );
}

// the first paragraph of the first page gets the drop cap
const dropCap = (blocks: string[]) => {
  const i = blocks.findIndex((b) => b.startsWith("<p>"));
  return blocks.map((b, j) => (j === i ? b.replace("<p>", '<p class="opening-paragraph">') : b));
};

export default async function HomeReader({
  searchParams,
}: {
  searchParams: Promise<{ book?: string; chapter?: string }>;
}) {
  await connection();
  const { book: bookParam, chapter: chapterParam } = await searchParams;

  // everyone gets the public library
  let library = await getLibrary();
  let book = bookParam ? library.find((b) => b.id === bookParam) : library[0];

  // not in the public library: if she's signed in and it's hers, open it for her
  // (this is what the dashboard "View" button uses; for a visitor it returns nothing)
  if (!book && bookParam) {
    const mine = await getAuthorBook(bookParam);
    if (mine) {
      book = mine;
      library = [mine, ...library];
    }
  }

  if (!book) {
    return bookParam ? (
      <Notice link title="This story isn't available" text="It may be private, or it hasn't been published yet." />
    ) : (
      <Notice title="No stories yet" text="Stories will appear here as soon as they're published." />
    );
  }

  if (book.chapters.length === 0) {
    return <Notice link title="No chapters yet" text="This story doesn't have a published chapter yet." />;
  }

  const pick = book.chapters.find((c) => c.id === chapterParam) ?? book.chapters[0];
  const chapter = await getChapter(pick.id);
  if (!chapter) {
    return (
      <Notice link title="This chapter isn't available" text="It may be private, or it hasn't been published yet." />
    );
  }

  const note = book.tag === "Private" ? " · Private: only you can see this" : "";
  const parts = toPages(chapter.content);

  const pages = parts.length
    ? parts.map((blocks, i) => ({
        chapter: `Chapter ${chapter.position}`,
        title: chapter.title,
        kicker: `${book.title} · Page ${i + 1} of ${parts.length}${note}`,
        paragraphs: blocks.map((b) => plain(b)), // plain text, as before
        html: (i === 0 ? dropCap(blocks) : blocks).join(""), // with headings, bold and italic
      }))
    : [
        {
          chapter: `Chapter ${chapter.position}`,
          title: chapter.title,
          kicker: book.title,
          paragraphs: ["This chapter is empty so far."],
          html: "<p>This chapter is empty so far.</p>",
        },
      ];

  const text = plain(chapter.content);
  const words = text ? text.split(" ").length : 0;

  const meta = {
    bookTitle: book.title,
    chapterLabel: `Chapter ${chapter.position}`,
    chapterTitle: chapter.title,
    minutes: words ? Math.max(1, Math.round(words / 200)) : 0,
  };

  return (
    <ReaderDrawer library={library} activeBookId={book.id} activeChapterId={chapter.id}>
      <HeroSection key={chapter.id} storyPages={pages} meta={meta} />
    </ReaderDrawer>
  );
}