import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";

export type CardBook = {
  title: string;
  genre: string;
  chapters: number;
  readTime: string;
  synopsis: string;
  cover_from: string;
  cover_to: string;
  cover_shape: string | null;
};


/* the cover: gradient + shape from the cover creator, with the title centered in a gold frame */
function CoverArt({ book }: { book: CardBook }) {
  const shape = book.cover_shape;

  const ornament = (
    <span className="flex w-full items-center justify-center gap-2" aria-hidden>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#d9b36c]/70" />
      <span className="size-1.5 rotate-45 bg-[#d9b36c]" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#d9b36c]/70" />
    </span>
  );

  return (
    <div
      className="relative aspect-[2/3] w-full overflow-hidden"
      style={{ backgroundImage: `linear-gradient(to bottom right, ${book.cover_from}, ${book.cover_to})` }}
    >
      {shape === "circle" && <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/20" />}
      {shape === "ring" && <div className="absolute -right-12 -top-12 size-48 rounded-full border-14 border-white/25" />}
      {shape === "diamond" && <div className="absolute -right-8 top-6 size-32 rotate-45 bg-white/20" />}
      {shape === "lines" && (
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 16px)" }}
        />
      )}

      {/* spine + sheen */}
      <div className="absolute inset-y-0 left-0 w-[8%] bg-linear-to-r from-black/40 to-transparent" />
      <div className="absolute inset-y-0 left-[8%] w-px bg-white/25" />
      <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/30" />

      {/* gold double frame */}
      <div className="pointer-events-none absolute inset-y-4 left-[12%] right-4 rounded-[2px_8px_8px_2px] border border-[#d9b36c]/45" />
      <div className="pointer-events-none absolute inset-y-[22px] left-[calc(12%+6px)] right-[22px] rounded-[1px_6px_6px_1px] border border-white/15" />

      {/* the title, in the middle */}
      <div className="absolute inset-y-0 left-[8%] right-0 flex flex-col items-center justify-center gap-5 px-[15%] text-center">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d9b36c]">{book.genre}</span>
        {ornament}
        <p className="line-clamp-4 text-balance font-serif text-[clamp(1.35rem,2.1vw,1.9rem)] leading-[1.1] tracking-[-0.01em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
          {book.title}
        </p>
        {ornament}
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/55">
          {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
        </span>
      </div>
    </div>
  );
}

const MordernBookCard = ({ book, href }: { book: CardBook; href: string }) => {
  return (
    <Link
      href={href}
      className="modern-book-card group block w-full text-left"
      aria-label={`Read ${book.title}`}
    >
      <div className="modern-book-frame relative block overflow-hidden rounded-[5px_18px_18px_5px]">
        <CoverArt book={book} />
        <span className="book-reveal pointer-events-none absolute inset-0 z-10 overflow-hidden text-white">
          <span className="book-reveal-half book-reveal-top absolute inset-x-0 top-0 h-1/2" />
          <span className="book-reveal-half book-reveal-bottom absolute inset-x-0 bottom-0 h-1/2" />
          <span className="book-reveal-details absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-6">
            <span className="book-reveal-content flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">
                {book.genre}
              </span>
              <span className="text-[10px] font-semibold text-white/55">{book.readTime}</span>
            </span>
            <span className="book-reveal-content block">
              <span className="mb-4 block h-px w-9 bg-[#d9b36c]" />
              <span className="block font-serif text-[clamp(1.55rem,2.3vw,2.15rem)] leading-[1.08]">
                {book.title}
              </span>
              <span className="mt-3 block text-[11px] leading-[1.7] text-white/70">{book.synopsis}</span>
              <span className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em]">
                  <BookOpen size={14} /> {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
                </span>
                <span className="grid size-9 place-items-center rounded-full border border-white/30 transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-white group-hover:text-[#18382f]">
                  <ArrowRight size={15} />
                </span>
              </span>
            </span>
          </span>
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <span>
          <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#a45134]">
            {book.genre}
          </span>
          <span className="mt-1.5 block font-serif text-[22px] leading-tight text-[#183a31]">{book.title}</span>
          <span className="mt-2 block text-[11px] text-[#78817b]">
            {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"} · {book.readTime}
          </span>
        </span>
        <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-[#18382f]/15 text-[#18382f] transition duration-300 group-hover:border-[#a45134] group-hover:text-[#a45134]">
          <ChevronRight size={15} />
        </span>
      </div>
    </Link>
  );
};

export default MordernBookCard;