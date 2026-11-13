import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ChaptersTable, { type ChapterRow } from "./ChaptersTable";

export default async function ChaptersData({ bookId }: { bookId?: string }) {
  await connection();
  const supabase = await createClient();

  const { data: books } = await supabase.from("books").select("id, title").order("title");

  let query = supabase
    .from("chapters")
    .select("id, book_id, title, position, status, content, updated_at");
  if (bookId) query = query.eq("book_id", bookId);
  const { data } = await query;

  const titleOf = new Map((books ?? []).map((b) => [b.id, b.title]));

  const chapters: ChapterRow[] = (data ?? [])
    .map(({ content, ...c }) => ({
      ...c,
      status: c.status as ChapterRow["status"],
      book_title: titleOf.get(c.book_id) ?? "",
      words: content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length,
    }))
    // by book, then by chapter number
    .sort((a, b) => a.book_title.localeCompare(b.book_title) || a.position - b.position);

  return <ChaptersTable chapters={chapters} books={books ?? []} bookId={bookId} />;
}