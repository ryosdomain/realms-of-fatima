import { connection } from "next/server";
import HeroSection from "@/components/HeroSection";
import ReaderDrawer from "@/components/ReaderDrawer";
import { getChapter, getLibrary, toPages } from "@/lib/reader";

const emptyPage = {
  chapter: "Coming soon",
  title: "Nothing here yet",
  kicker: "",
  paragraphs: ["The first story will appear here as soon as it's published."],
};

export default async function HomeReader({
  searchParams,
}: {
  searchParams: Promise<{ book?: string; chapter?: string }>;
}) {
  await connection();
  const { book: bookParam, chapter: chapterParam } = await searchParams;
  const library = await getLibrary();

  const book = library.find((b) => b.id === bookParam) ?? library[0];
  const pick = book?.chapters.find((c) => c.id === chapterParam) ?? book?.chapters[0];
  const chapter = pick ? await getChapter(pick.id) : null;

  const pages =
    chapter && book
      ? toPages(chapter.content).map((paragraphs, i, all) => ({
          chapter: `Chapter ${chapter.position}`,
          title: chapter.title,
          kicker: `${book.title} · Page ${i + 1} of ${all.length}`,
          paragraphs,
        }))
      : [];

  const text = chapter ? chapter.content.replace(/<[^>]*>/g, " ").trim() : "";
  const words = text ? text.split(/\s+/).length : 0;

  const meta = {
    bookTitle: book?.title ?? "Library",
    chapterLabel: chapter ? `Chapter ${chapter.position}` : "",
    chapterTitle: chapter?.title ?? "",
    minutes: words ? Math.max(1, Math.round(words / 200)) : 0,
  };

  return (
    <ReaderDrawer library={library} activeBookId={book?.id} activeChapterId={chapter?.id}>
      <HeroSection
        key={chapter?.id ?? "empty"}
        storyPages={pages.length ? pages : [emptyPage]}
        meta={meta}
      />
    </ReaderDrawer>
  );
}