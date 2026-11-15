import React from "react";

import {
  ArrowRight,
  FilePenLine,
  MoreHorizontal,
  PencilLine,
  Upload,
} from "lucide-react";

import BookCreationForm from "@/components/BookCreationForm";
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import BooksTable from "@/components/BooksTable";

// inside page, where the table was:

async function BookList() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select(
      "id, title, description, genre, status, visibility, featured, cover_from, cover_to, cover_shape, updated_at, chapters(count)",
    )
    .order("updated_at", { ascending: false });

  return <BooksTable books={data ?? []} />;
}
// const books = [
//   {
//     title: "The Quiet Between Stars",
//     genre: "Literary fiction",
//     chapters: 12,
//     readTime: "1 hr 48 min",
//     synopsis:
//       "A letter from twenty years ahead sends Mara north toward a past she thought she had left behind.",
//     color: "from-[#1a3c35] to-[#31594e]",
//     accent: "#d8a651",
//     status: "Published",
//   },
//   {
//     title: "A Map of Small Things",
//     genre: "Short stories",
//     chapters: 8,
//     readTime: "54 min",
//     synopsis:
//       "Eight intimate stories about the ordinary objects that quietly hold a lifetime of memory.",
//     color: "from-[#a8583c] to-[#71372a]",
//     accent: "#f1d8b5",
//     status: "Published",
//   },
//   {
//     title: "Letters from Elsewhere",
//     genre: "Magical realism",
//     chapters: 5,
//     readTime: "42 min",
//     synopsis:
//       "Letters begin arriving from a town that exists on no map—and each one knows her name.",
//     color: "from-[#53657d] to-[#2e394c]",
//     accent: "#e4c982",
//     status: "Draft",
//   },
//   {
//     title: "The Winter Orchard",
//     genre: "Novella",
//     chapters: 14,
//     readTime: "2 hr 10 min",
//     synopsis:
//       "An abandoned orchard, a family promise, and one last winter to uncover what was buried.",
//     color: "from-[#5f4238] to-[#372823]",
//     accent: "#dba66f",
//     status: "Published",
//   },
// ];
const page = () => {
  return (
    <div>
      <main className="mx-auto max-w-295 p-5 md:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-4xl tracking-[-0.035em] text-[#183a31]">
              Your books
            </h2>
          </div>
          <BookCreationForm />
        </div>

        <div className="mt-7 grid gap-7 ">
          <section className=" rounded-2xl border border-[#18382f]/10 bg-white">
            <div className="mt-6">
              <Suspense
                fallback={
                  <p className="text-sm text-[#87908b]">Loading books…</p>
                }
              >
                <BookList />
              </Suspense>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default page;
