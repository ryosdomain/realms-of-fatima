"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  EyeOff,
  FilePenLine,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import {
  addChapter,
  moveChapter,
  removeChapter,
  setChapterStatus,
} from "@/app/admin/editor/actions";

export type ChapterRow = {
  id: string;
  book_id: string;
  book_title: string;
  title: string;
  position: number;
  status: "draft" | "published";
  words: number;
  updated_at: string;
};
type BookOption = { id: string; title: string };

const filters = ["All", "Published", "Draft"];

const line = "border-[#d6cfbf]";
const cell = `items-center border-r ${line} px-4 last:border-r-0`;
// md: # | Chapter | Status | menu     lg: + Words + buttons     xl: + Last edited
const grid =
  "md:grid-cols-[72px_minmax(0,1fr)_110px_72px] lg:grid-cols-[72px_minmax(0,1fr)_110px_90px_150px] xl:grid-cols-[72px_minmax(0,1fr)_110px_90px_120px_150px]";

const iconBtn = `grid size-9 place-items-center rounded-lg border ${line} bg-white text-[#69766f] transition hover:bg-[#eae4d8] hover:text-[#183a31]`;
const menuItem =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#32453f] hover:bg-[#f4f1ea] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";
const selectCls =
  "h-10 rounded-xl border border-[#d6cfbf] bg-white px-3 text-xs font-semibold text-[#32453f] outline-none focus:border-[#a45134]";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

type Actions = {
  status: (c: ChapterRow) => void;
  move: (c: ChapterRow, d: "up" | "down") => void;
  remove: (c: ChapterRow) => void;
};

/* ---------- small pieces ---------- */

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eae4d8] font-serif text-sm font-semibold text-[#a45134]">
      {n}
    </span>
  );
}

function StatusBadge({ status }: { status: ChapterRow["status"] }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        published
          ? "border-[#2c6a4a]/30 bg-[#e5f0e9] text-[#2c6a4a]"
          : "border-[#966226]/30 bg-[#f4ead5] text-[#966226]"
      }`}
    >
      <span className={`size-1.5 rounded-full ${published ? "bg-[#2c6a4a]" : "bg-[#966226]"}`} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function RowMenu({
  chapter,
  dropUp,
  isFirst,
  isLast,
  a,
}: {
  chapter: ChapterRow;
  dropUp: boolean;
  isFirst: boolean;
  isLast: boolean;
  a: Actions;
}) {
  const [open, setOpen] = useState(false);
  const run = (fn: () => void) => () => {
    fn();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={iconBtn}
        aria-label={`More options for ${chapter.title}`}
        aria-expanded={open}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute right-0 z-20 w-56 max-w-[calc(100vw-2rem)] rounded-xl border ${line} bg-white p-1.5 shadow-xl ${
              dropUp ? "bottom-11" : "top-11"
            }`}
          >
            <Link href={`/admin/editor?chapter=${chapter.id}`} className={menuItem}>
              <FilePenLine size={14} className="text-[#a45134]" /> Write
            </Link>
            <button className={menuItem} onClick={run(() => a.status(chapter))}>
              {chapter.status === "published" ? (
                <EyeOff size={14} className="text-[#a45134]" />
              ) : (
                <Upload size={14} className="text-[#a45134]" />
              )}
              {chapter.status === "published" ? "Unpublish (back to draft)" : "Publish"}
            </button>

            <div className="my-1 h-px bg-[#d6cfbf]" />

            <button className={menuItem} disabled={isFirst} onClick={run(() => a.move(chapter, "up"))}>
              <ArrowUp size={14} className="text-[#a45134]" /> Move up
            </button>
            <button className={menuItem} disabled={isLast} onClick={run(() => a.move(chapter, "down"))}>
              <ArrowDown size={14} className="text-[#a45134]" /> Move down
            </button>

            <div className="my-1 h-px bg-[#d6cfbf]" />

            <button
              className={`${menuItem} text-[#a45134] hover:bg-[#fff5f1]`}
              onClick={run(() => a.remove(chapter))}
            >
              <Trash2 size={14} /> Delete chapter
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- the table ---------- */

export default function ChaptersTable({
  chapters,
  books,
  bookId,
}: {
  chapters: ChapterRow[]; // already sorted: by book, then by chapter number
  books: BookOption[];
  bookId?: string; // set = single-book view, empty = all books
}) {
  const showBook = !bookId;
  const [filter, setFilter] = useState("All");
  const [bookFilter, setBookFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [addTo, setAddTo] = useState(bookId ?? books[0]?.id ?? "");
  const [toDelete, setToDelete] = useState<ChapterRow | null>(null);
  const [, startTransition] = useTransition();

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
    });

  const actions: Actions = {
    status: (c) =>
      run(() => setChapterStatus(c.id, c.book_id, c.status === "published" ? "draft" : "published")),
    move: (c, d) => run(() => moveChapter(c.id, c.book_id, d)),
    remove: (c) => setToDelete(c),
  };

  const rows = chapters.filter(
    (c) =>
      (filter === "All" || c.status === filter.toLowerCase()) &&
      (bookFilter === "all" || c.book_id === bookFilter) &&
      `${c.title} ${c.book_title}`.toLowerCase().includes(query.toLowerCase())
  );

  const isFirst = (c: ChapterRow) => chapters.find((x) => x.book_id === c.book_id)?.id === c.id;
  const isLast = (c: ChapterRow) =>
    [...chapters].reverse().find((x) => x.book_id === c.book_id)?.id === c.id;
  const dropUp = (index: number) => rows.length > 2 && index >= rows.length - 2;

  return (
    <section className={`rounded-2xl border ${line} bg-white shadow-sm`}>
      {/* toolbar */}
      <div className={`flex flex-wrap items-center gap-3 border-b ${line} p-4 md:px-5`}>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#f4f1ea] p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? "bg-[#274b18] text-[#fdfffe] shadow-sm"
                  : "text-[#74807a] hover:text-[#183a31]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {showBook && (
          <select
            value={bookFilter}
            onChange={(e) => setBookFilter(e.target.value)}
            aria-label="Filter by book"
            className={`${selectCls} max-w-48`}
          >
            <option value="all">All books</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        )}

        <label className="relative ml-auto w-full sm:w-56">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters"
            className="h-10 w-full rounded-xl border border-[#18382f]/10 bg-[#1d3318] pl-9 pr-3 text-xs text-[#fffefd] outline-none transition placeholder:text-white/60 focus:border-[#a45134]"
          />
        </label>

        {/* add a chapter (in the all-books view you pick the book first) */}
        <form action={() => addChapter(addTo)} className="flex items-center gap-2">
          {showBook && (
            <select
              value={addTo}
              onChange={(e) => setAddTo(e.target.value)}
              aria-label="Add the chapter to this book"
              className={`${selectCls} max-w-40`}
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          )}
          <button
            disabled={!addTo}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#183a31] px-4 text-xs font-semibold text-white transition hover:bg-[#214a3f] disabled:opacity-40"
          >
            <Plus size={15} /> Add chapter
          </button>
        </form>
      </div>

      {/* ===== table (md and up) ===== */}
      <div
        className={`hidden border-b ${line} bg-[#f1ede4] text-[10px] font-bold uppercase tracking-[0.14em] text-[#6d7872] md:grid ${grid}`}
      >
        <span className={`${cell} flex justify-center py-3`}>No.</span>
        <span className={`${cell} flex py-3`}>Chapter</span>
        <span className={`${cell} flex py-3`}>Status</span>
        <span className={`${cell} hidden justify-center py-3 lg:flex`}>Words</span>
        <span className={`${cell} hidden py-3 xl:flex`}>Last edited</span>
        <span className={`${cell} flex justify-end py-3`}>
          <span className="hidden lg:inline">Actions</span>
          <span className="lg:hidden">More</span>
        </span>
      </div>

      {rows.map((c, index) => (
        <div
          key={c.id}
          className={`hidden border-b ${line} transition hover:bg-[#faf8f3] md:grid ${grid}`}
        >
          <div className={`${cell} flex justify-center py-4`}>
            <NumberBadge n={c.position} />
          </div>
          <div className={`${cell} flex min-w-0 flex-col justify-center py-4`}>
            <p className="truncate font-serif text-[17px] text-[#243b34]">{c.title}</p>
            <p className="mt-0.5 truncate text-[11px] text-[#87908b]">
              {showBook && c.book_title}
              <span className="lg:hidden">
                {showBook ? " · " : ""}
                {c.words} words
              </span>
            </p>
          </div>
          <div className={`${cell} flex py-4`}>
            <StatusBadge status={c.status} />
          </div>
          <div className={`${cell} hidden justify-center py-4 text-sm font-semibold text-[#243b34] lg:flex`}>
            {c.words.toLocaleString()}
          </div>
          <div className={`${cell} hidden py-4 text-xs text-[#74807a] xl:flex`}>{fmt(c.updated_at)}</div>
          <div className={`${cell} flex justify-end gap-1.5 py-4`}>
            <Link
              href={`/admin/editor?chapter=${c.id}`}
              className={`${iconBtn} hidden lg:grid`}
              aria-label={`Write ${c.title}`}
              title="Write"
            >
              <FilePenLine size={15} />
            </Link>
            <RowMenu chapter={c} dropUp={dropUp(index)} isFirst={isFirst(c)} isLast={isLast(c)} a={actions} />
          </div>
        </div>
      ))}

      {/* ===== cards (phones) ===== */}
      <div className="divide-y divide-[#d6cfbf] md:hidden">
        {rows.map((c, index) => (
          <div key={c.id} className="flex items-start gap-3 p-4">
            <NumberBadge n={c.position} />
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/editor?chapter=${c.id}`}
                className="block truncate font-serif text-[17px] text-[#243b34]"
              >
                {c.title}
              </Link>
              <p className="mt-0.5 text-[11px] text-[#87908b]">
                {showBook && `${c.book_title} · `}
                {c.words.toLocaleString()} words · Edited {fmt(c.updated_at)}
              </p>
              <div className="mt-2">
                <StatusBadge status={c.status} />
              </div>
            </div>
            <RowMenu chapter={c} dropUp={dropUp(index)} isFirst={isFirst(c)} isLast={isLast(c)} a={actions} />
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="px-5 py-12 text-center text-sm text-[#87908b]">
          {chapters.length === 0
            ? books.length === 0
              ? "Create a book first, then you can add chapters."
              : "No chapters yet. Click “Add chapter” to start."
            : "No chapters match your filters."}
        </p>
      )}

      {/* footer */}
      <div
        className={`rounded-b-2xl bg-[#faf8f3] px-5 py-3 text-[11px] text-[#87908b] ${rows.length ? "" : `border-t ${line}`}`}
      >
        Showing {rows.length} of {chapters.length} chapters
      </div>

      {/* delete confirmation */}
      {toDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#11251f]/40 p-4 backdrop-blur-[2px]"
          onMouseDown={() => setToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#fbf9f4] p-6 shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-xl text-[#183a31]">Delete this chapter?</h3>
            <p className="mt-2 text-sm leading-6 text-[#66736d]">
              "{toDelete.title}" will be removed. This can't be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="h-11 flex-1 rounded-xl border border-[#d6cfbf] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  run(() => removeChapter(toDelete.id, toDelete.book_id));
                  setToDelete(null);
                }}
                className="h-11 flex-1 rounded-xl bg-[#a45134] text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}