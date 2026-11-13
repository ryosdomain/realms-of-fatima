import { Suspense } from "react";
import ChaptersData from "@/components/ChaptersData";

export default function ChaptersPage() {
  return (
    <main className="mx-auto max-w-295 p-5 md:p-8">
      <h2 className="font-serif text-4xl tracking-[-0.035em] text-[#183a31]">Your chapters</h2>
      <p className="mt-2 text-sm text-[#74807a]">Every chapter from every book, in one place.</p>

      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-[#87908b]">Loading chapters…</p>}>
          <ChaptersData />
        </Suspense>
      </div>
    </main>
  );
}