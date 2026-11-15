"use client";

import React, { useState } from "react";

import { ArrowLeft, ArrowRight, BookMarked, BookOpen } from "lucide-react";
type Page = {
  chapter: string;
  title: string;
  kicker: string;
  paragraphs: string[];
};
type StoryPage = {
  chapter: string;
  title: string;
  kicker: string;
  paragraphs: string[];
};

type Meta = {
  bookTitle: string;
  chapterLabel: string;
  chapterTitle: string;
  minutes: number;
};

// your component signature becomes (keep your existing storyPages type):
const HeroSection = ({ storyPages, meta }: { storyPages: StoryPage[]; meta: Meta }) => {

  const [currentPage, setCurrentPage] = useState(0);

  const changePage = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= storyPages.length) return;
    setCurrentPage(nextPage);
    window.setTimeout(() => {
      document
        .getElementById("reader-page")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };
  

  const page = storyPages[currentPage];
  return (
    <div>
      <section id="reader" className="relative bg-[#17352d] px-3 pb-10 pt-4 text-[#f7f2e8] sm:px-6 md:px-10 md:pb-16 md:pt-7">
        <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto max-w-295">
          <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4.5 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between md:mb-6 md:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d6a75f]/15 text-[#e2ba7a]">
                <BookOpen size={17} />
              </span>
              <div className="min-w-0">
               <p className="truncate font-serif text-[15px]">{meta.bookTitle}</p>
<p className="truncate text-[10px] text-white/45">
  {[meta.chapterLabel, meta.chapterTitle, meta.minutes ? `${meta.minutes} min read` : ""]
    .filter(Boolean)
    .join(" · ")}
</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              {/* <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white">
                <BookMarked size={15} />{" "}
                <span className="hidden min-[400px]:inline">Save place</span>
              </button> */}
              <span className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="Previous page"
                >
                  <ArrowLeft size={16} />
                </button>
                <label className="relative flex h-9 cursor-pointer items-center overflow-hidden rounded-lg border border-white/10 bg-black/10 px-3 text-[11px] text-white/60">
                  <span className="mr-1 text-white">{currentPage + 1}</span> /{" "}
                  {storyPages.length}
                  <select
                    value={currentPage}
                    onChange={(event) => changePage(Number(event.target.value))}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                    aria-label="Choose page"
                  >
                    {storyPages.map((_, index) => (
                      <option key={index} value={index}>
                        Page {index + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === storyPages.length - 1}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="Next page"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <article
            id="reader-page"
            className="reader-sheet relative mx-auto min-h-225 max-w-230 scroll-mt-4 overflow-hidden bg-[#fffdf7] px-7 py-9 text-[#2d332f] sm:px-12 sm:py-12 md:min-h-[1080px] md:px-[clamp(4rem,9vw,7.5rem)] md:py-16"
          >
            <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.09]" />
            <div className="relative flex min-h-screen flex-col ">
              <div className="flex items-center justify-between border-b border-[#2d332f]/10 pb-4 text-[9px] font-bold uppercase tracking-[0.19em] text-[#7d807b] sm:text-[10px]">
                <span>{meta.bookTitle}</span>
                <span>{page.chapter}</span>
              </div>

              <header className="mx-auto max-w-[670px] pb-10 pt-14 text-center md:pb-14 md:pt-20">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a45134]">
                  {page.chapter}
                </p>
                <h1 className="mt-5 font-serif text-[clamp(2.8rem,7vw,5.25rem)] leading-[0.98] tracking-[-0.045em] text-[#173a31]">
                  {page.title}
                </h1>
                <p className="mx-auto mt-5 max-w-[430px] font-serif text-[14px] italic leading-6 text-[#7b7b73] sm:text-[15px]">
                  {page.kicker}
                </p>
                <span className="mx-auto mt-8 block size-1.5 rotate-45 bg-[#a45134]" />
              </header>

              <div className="reader-prose flex-1 mx-auto max-w-[650px]">
                {page.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${currentPage}-${index}`}
                    className={index === 0 ? "opening-paragraph" : ""}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mx-auto mt-auto flex w-full max-w-[650px] items-center justify-between border-t border-[#2d332f]/16 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888a84]">
                <span>Arthur</span>
                <span>{currentPage + 1}</span>
                <span className="hidden sm:block">Realms of Fatima</span>
              </div>
            </div>
          </article>

          <div className="mx-auto mt-5 flex max-w-[920px] items-center justify-between">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              <ArrowLeft size={15} /> Previous page
            </button>
            <div className="hidden items-center gap-1.5 sm:flex">
              {storyPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changePage(index)}
                  className={`h-1.5 rounded-full transition-all ${index === currentPage ? "w-7 bg-[#d6a75f]" : "w-1.5 bg-white/20 hover:bg-white/45"}`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === storyPages.length - 1}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              Next page <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
