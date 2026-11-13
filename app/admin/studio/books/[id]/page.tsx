import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ChaptersData from "@/components/ChaptersData";

export default function BookChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto max-w-295 p-5 md:p-8">
      <Suspense fallback={<p className="text-sm text-[#87908b]">Loading…</p>}>
        <Loader params={params} />
      </Suspense>
    </main>
  );
}

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("id, title, genre")
    .eq("id", id)
    .maybeSingle();
  if (!book) notFound();

  return (
    <>
      <Link
        href="/admin/studio/books"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#66736d] hover:text-[#183a31]"
      >
        <ArrowLeft size={14} /> All books
      </Link>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a45134]">
        {book.genre ?? "Book"}
      </p>
      <h1 className="mt-1 font-serif text-4xl tracking-[-0.035em] text-[#183a31]">{book.title}</h1>
      <p className="mt-2 text-sm text-[#74807a]">Write, order and publish this book’s chapters.</p>

      <div className="mt-8">
        <ChaptersData bookId={book.id} />
      </div>
    </>
  );
}