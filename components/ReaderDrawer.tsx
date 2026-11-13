"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownUp, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { LibraryBook } from "@/lib/reader";

// which side the drawer opens from
const SIDE: "left" | "right" = "left";
const GOLD = "#d2a55f";

const sides = {
  left: {
    pos: "left-0",
    hidden: "-translate-x-full",
    grad: "bg-linear-to-r from-black/90 via-black/75 to-transparent",
    mask: "[-webkit-mask-image:linear-gradient(to_right,#000_70%,transparent)] [mask-image:linear-gradient(to_right,#000_70%,transparent)]",
    tintAt: "0% 0%",
    tab: "left-0 rounded-r-2xl border-l-0",
  },
  right: {
    pos: "right-0",
    hidden: "translate-x-full",
    grad: "bg-linear-to-l from-black/90 via-black/75 to-transparent",
    mask: "[-webkit-mask-image:linear-gradient(to_left,#000_70%,transparent)] [mask-image:linear-gradient(to_left,#000_70%,transparent)]",
    tintAt: "100% 0%",
    tab: "right-0 rounded-l-2xl border-r-0",
  },
}[SIDE];

const OpenIcon = SIDE === "left" ? ChevronRight : ChevronLeft;

const coverBg = (b: { cover_from: string; cover_to: string }) => ({
  backgroundImage: `linear-gradient(to bottom right, ${b.cover_from}, ${b.cover_to})`,
});

/* ---------- small book cover for the strip ---------- */

function MiniCover({ book, selected }: { book: LibraryBook; selected: boolean }) {
  const shape = book.cover_shape;
  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded-[2px_6px_6px_2px] shadow-lg transition duration-300 ${
        selected ? "ring-2 ring-offset-2 ring-offset-black" : ""
      }`}
      style={{ ...coverBg(book), ["--tw-ring-color" as string]: GOLD }}
    >
      {shape === "circle" && <div className="absolute -right-3 -top-3 size-12 rounded-full bg-white/20" />}
      {shape === "ring" && <div className="absolute -right-4 -top-4 size-14 rounded-full border-[5px] border-white/25" />}
      {shape === "diamond" && <div className="absolute -right-2 top-1.5 size-10 rotate-45 bg-white/20" />}
      {shape === "lines" && (
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 7px)" }}
        />
      )}
      <div className="absolute inset-y-0 left-0 w-[9%] bg-linear-to-r from-black/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/30" />
    </div>
  );
}

/* ---------- the drawer ---------- */

export default function ReaderDrawer({
  library,
  activeBookId,
  activeChapterId,
  children,
}: {
  library: LibraryBook[];
  activeBookId?: string;
  activeChapterId?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(activeBookId ?? library[0]?.id);
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(true);
  const strip = useRef<HTMLDivElement>(null);

  const book = library.find((b) => b.id === selected) ?? library[0];

  const q = query.trim().toLowerCase();
  const filtered = (book?.chapters ?? []).filter((c) => !q || `${c.position} ${c.title}`.toLowerCase().includes(q));
  const list = ascending ? filtered : [...filtered].reverse();

  const openDrawer = () => {
    setSelected(activeBookId ?? library[0]?.id); // start on the story you're reading
    setQuery("");
    setOpen(true);
  };

  // mouse wheel scrolls the book strip sideways
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, library.length]);

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    // everything below is positioned inside this box, which is just the reader
    <div className="relative isolate min-h-[560px] overflow-x-clip">
      {children}

      {/* click outside to close (covers only the reader) */}
      {open && <div className="absolute inset-0 z-40 bg-black/30 md:bg-transparent" onClick={close} />}

      {/* the tab that opens the library: on the reader's edge, centered vertically */}
      <button
        onClick={openDrawer}
        aria-label="Open library"
        className={`absolute ${sides.tab} top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-3 border border-white/20 bg-black/60 px-2.5 py-5 text-white shadow-lg backdrop-blur-xl transition duration-300 hover:bg-black/80 ${
          open ? "pointer-events-none opacity-0" : ""
        }`}
      >
        <OpenIcon size={16} style={{ color: GOLD }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] [writing-mode:vertical-rl]">
          Library
        </span>
      </button>

      <aside
        aria-label="Library"
        inert={!open}
        className={`absolute inset-y-0 ${sides.pos} z-50 w-[min(440px,100%)] text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "translate-x-0" : sides.hidden
        }`}
      >
        {/* backdrop: blurred and fading out toward the reader, tinted by the book's color */}
        <div className={`absolute inset-0 backdrop-blur-2xl ${sides.mask}`} />
        <div className={`absolute inset-0 ${sides.grad}`} />
        {book && (
          <div
            className="absolute inset-0 transition-[background] duration-700"
            style={{
              backgroundImage: `radial-gradient(120% 55% at ${sides.tintAt}, ${book.cover_from}cc, transparent 65%)`,
            }}
          />
        )}

        <div className="relative z-10 flex h-full flex-col px-5 pb-4 pt-5">
          {/* top controls */}
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold"
              style={{ color: GOLD, borderColor: `${GOLD}55`, backgroundColor: `${GOLD}1f` }}
            >
              Library
            </span>
            <label className="relative min-w-0 flex-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chapters"
                className="h-9 w-full rounded-full border border-white/10 bg-white/8 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/45 focus:border-white/30"
              />
            </label>
            <button
              onClick={() => setAscending(!ascending)}
              aria-label={ascending ? "Newest chapter first" : "Oldest chapter first"}
              title={ascending ? "Showing 1 → last" : "Showing last → 1"}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
            >
              <ArrowDownUp size={15} />
            </button>
            <button
              onClick={close}
              aria-label="Close library"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/15 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {!book ? (
            <p className="mt-10 text-center text-sm text-white/55">No stories published yet.</p>
          ) : (
            <>
              {/* book strip: scrolls sideways, never closes the chapters */}
              <div
                ref={strip}
                className="mt-4 flex shrink-0 gap-3 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {library.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelected(b.id)}
                    aria-pressed={b.id === book.id}
                    title={b.title}
                    className={`w-14 shrink-0 transition duration-300 hover:-translate-y-0.5 ${
                      b.id === book.id ? "" : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    <MiniCover book={b} selected={b.id === book.id} />
                  </button>
                ))}
              </div>

              {/* book header */}
              <div className="mt-3 shrink-0 text-center">
                <h2 className="font-serif text-2xl tracking-tight">{book.title}</h2>
                <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
                  {book.chapters.length} {book.chapters.length === 1 ? "chapter" : "chapters"}
                  {book.genre && <span className="text-white/40">· {book.genre}</span>}
                </p>
                {book.description && (
                  <p className="mx-auto mt-2 line-clamp-2 max-w-sm text-xs leading-5 text-white/55">{book.description}</p>
                )}
              </div>

              {/* chapters: all the same size */}
              <ol className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-1 pb-4 pt-1 [mask-image:linear-gradient(to_bottom,transparent,#000_3%,#000_94%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {list.length === 0 && (
                  <li className="py-10 text-center text-sm text-white/50">No chapters match your search.</li>
                )}
                {list.map((c) => {
                  const current = c.id === activeChapterId;
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/?book=${book.id}&chapter=${c.id}`}
                        scroll={false}
                        onClick={close}
                        aria-current={current ? "true" : undefined}
                        className={`group flex min-h-[68px] items-center gap-4 rounded-2xl border px-4 py-3 transition duration-200 ${
                          current
                            ? "border-white/40 bg-white/15"
                            : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                        }`}
                      >
                        <span className="w-7 shrink-0 text-center font-serif text-lg" style={{ color: GOLD }}>
                          {c.position}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-serif text-[15px] text-white">{c.title}</span>
                          <span className="mt-0.5 block text-[11px] text-white/50">{c.minutes} min read</span>
                        </span>
                        {current ? (
                          <span
                            className="shrink-0 rounded-md px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#1a1208]"
                            style={{ backgroundColor: GOLD }}
                          >
                            Reading
                          </span>
                        ) : (
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-white/0 transition group-hover:text-white/60"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}