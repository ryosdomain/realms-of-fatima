import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChapterEditor from "@/components/ChapterEditor";

export default function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="grid h-screen place-items-center text-sm text-[#87908b]">Loading editor…</div>}
    >
      <Loader searchParams={searchParams} />
    </Suspense>
  );
}

async function Loader({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  await connection();
  const { chapter: id } = await searchParams;
  if (!id) redirect("/admin/studio/books");

  const supabase = await createClient();
  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, book_id, title, content, text_color, page_color, position, status")
    .eq("id", id)
    .maybeSingle();
  if (!chapter) notFound();

  const [{ data: book }, { data: chapters }] = await Promise.all([
    supabase.from("books").select("id, title").eq("id", chapter.book_id).single(),
    supabase.from("chapters").select("id, title, position, status").eq("book_id", chapter.book_id).order("position"),
  ]);
  if (!book) notFound();

  // key = chapter id: switching chapters gives a fresh editor
  return <ChapterEditor key={chapter.id} book={book} chapter={chapter} chapters={chapters ?? []} />;
}