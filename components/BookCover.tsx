import React from "react";
type Book = {
  title: string;
  genre: string;
  chapters: number;
  readTime: string;
  synopsis: string;
  color: string;
  accent: string;
  status: string;
};
const BookCover = ({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) => {
  return (
    <div
      className={`book-cover relative overflow-hidden rounded-[3px_12px_12px_3px] bg-gradient-to-br ${book.color} text-[#fffaf0] ${compact ? "aspect-[3/4.15]" : "aspect-[3/4.25]"}`}
    >
      <div className="absolute inset-y-0 left-0 w-[7px] border-r border-white/15 bg-black/15" />
      <div className="absolute inset-x-5 top-5 h-px bg-white/25" />
      <div className="absolute left-1/2 top-[26%] h-16 w-px -translate-x-1/2 bg-white/20" />
      <div
        className="absolute left-1/2 top-[31%] size-3 -translate-x-1/2 rotate-45 border"
        style={{ borderColor: book.accent }}
      />
      <div className="absolute inset-x-5 top-[44%] text-center">
        <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.3em] text-white/55">
          A story by E. Rowan
        </p>
        <h3
          className={`${compact ? "text-lg" : "text-2xl"} font-serif leading-[1.06]`}
        >
          {book.title}
        </h3>
      </div>
      <div className="absolute inset-x-5 bottom-5 h-px bg-white/25" />
    </div>
  );
};

export default BookCover;
