"use client";

import {
  Copy,
  Eye,
  EyeOff,
  FilePenLine,
  Globe,
  Lock,
  MoreHorizontal,
  PencilLine,
  Search,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useState, useTransition } from "react";
import BookCreationForm, { type BookData } from "@/components/BookCreationForm";
import {
  deleteBook,
  setBookFeatured,
  setBookStatus,
  setBookVisibility,
} from "@/app/admin/studio/books/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  genre: string;
  chapters: number;
  status: "Published" | "Draft";
  visibility: "Public" | "Private";
  edited: string;
  from: string;
  to: string;
  featured: boolean;
};

type DbBook = BookData & {
  status: "draft" | "published";
  featured: boolean;
  updated_at: string;
  chapters: { count: number }[];
};

const toUi = (b: DbBook): Book => ({
  id: b.id,
  title: b.title,
  genre: b.genre ?? "No genre",
  chapters: b.chapters?.[0]?.count ?? 0,
  status: b.status === "published" ? "Published" : "Draft",
  visibility: b.visibility === "public" ? "Public" : "Private",
  edited: new Date(b.updated_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }),
  from: b.cover_from,
  to: b.cover_to,
  featured: b.featured,
});

const filters = ["All", "Published", "Draft", "Private"];

// one solid color for every line in the table
const line = "border-[#d6cfbf]";
const cell = `items-center border-r ${line} px-4 last:border-r-0`;

// md: Book | Status | Visibility | Actions
// lg: + Chapters      xl: + Last edited
const grid =
  "md:grid-cols-[minmax(0,1fr)_110px_110px_72px] lg:grid-cols-[minmax(0,1fr)_80px_110px_110px_150px] xl:grid-cols-[minmax(0,1fr)_80px_110px_110px_120px_150px]";

const iconBtn = `grid size-9 place-items-center rounded-lg border ${line} bg-white text-[#69766f] transition hover:bg-[#eae4d8] hover:text-[#183a31]`;
const menuItem =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#32453f] hover:bg-[#f4f1ea]";

type Actions = {
  visibility: (id: string) => void;
  chapters: (id: string) => void;
  status: (id: string) => void;
  featured: (id: string) => void;
  duplicate: (id: string) => void;
  remove: (book: Book) => void;
  edit: (id: string) => void;
};

/* ---------- small pieces ---------- */

function Cover({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="h-16 w-12 shrink-0 rounded-[2px_5px_5px_2px] shadow-sm"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${from}, ${to})`,
      }}
    />
  );
}

function StatusBadge({ status }: { status: Book["status"] }) {
  const published = status === "Published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        published
          ? "border-[#2c6a4a]/30 bg-[#e5f0e9] text-[#2c6a4a]"
          : "border-[#966226]/30 bg-[#f4ead5] text-[#966226]"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${published ? "bg-[#2c6a4a]" : "bg-[#966226]"}`}
      />
      {status}
    </span>
  );
}

function VisibilityBadge({ visibility }: { visibility: Book["visibility"] }) {
  const isPrivate = visibility === "Private";
  return (
    <button
      title="Click to switch public / private"
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold transition hover:opacity-80 ${
        isPrivate
          ? "border-[#563d5c]/30 bg-[#f1ecf3] text-[#563d5c]"
          : "border-[#18382f]/20 bg-[#f4f1ea] text-[#4f5f58]"
      }`}
    >
      {isPrivate ? <Lock size={11} /> : <Globe size={11} />}
      {visibility}
    </button>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#a45134]/30 bg-[#fff5f1] px-2 py-0.5 text-[9px] font-bold text-[#a45134]">
      <Star size={9} fill="currentColor" /> Featured
    </span>
  );
}

function RowMenu({
  book,
  dropUp,
  a,
}: {
  book: Book;
  dropUp: boolean;
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
        aria-label={`More options for ${book.title}`}
        aria-expanded={open}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <>
          {/* invisible layer: clicking outside closes the menu */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div
            className={`absolute right-0 z-20 w-60 max-w-[calc(100vw-2rem)] rounded-xl border ${line} bg-white p-1.5 shadow-xl ${
              dropUp ? "bottom-11" : "top-11"
            }`}
          >
            <button
              className={menuItem}
              onClick={run(() => a.chapters(book.id))}
            >
              <FilePenLine size={14} className="text-[#a45134]" /> Write
              chapters
            </button>
            <button className={menuItem} onClick={run(() => a.edit(book.id))}>
              <PencilLine size={14} className="text-[#a45134]" /> Edit details
            </button>
            <button className={menuItem} onClick={run(() => {})}>
              <Eye size={14} className="text-[#a45134]" /> View on site
            </button>

            <div className="my-1 h-px bg-[#d6cfbf]" />

            <button className={menuItem} onClick={run(() => a.status(book.id))}>
              {book.status === "Published" ? (
                <EyeOff size={14} className="text-[#a45134]" />
              ) : (
                <Upload size={14} className="text-[#a45134]" />
              )}
              {book.status === "Published"
                ? "Unpublish (back to draft)"
                : "Publish"}
            </button>
            <button
              className={menuItem}
              onClick={run(() => a.visibility(book.id))}
            >
              {book.visibility === "Private" ? (
                <Globe size={14} className="text-[#a45134]" />
              ) : (
                <Lock size={14} className="text-[#a45134]" />
              )}
              Make {book.visibility === "Private" ? "public" : "private"}
            </button>
            <button
              className={menuItem}
              onClick={run(() => a.featured(book.id))}
            >
              <Star size={14} className="text-[#a45134]" />
              {book.featured ? "Remove from homepage" : "Feature on homepage"}
            </button>
            <button
              className={menuItem}
              onClick={run(() => a.duplicate(book.id))}
            >
              <Copy size={14} className="text-[#a45134]" /> Duplicate
            </button>

            <div className="my-1 h-px bg-[#d6cfbf]" />

            <button
              className={`${menuItem} text-[#a45134] hover:bg-[#fff5f1]`}
              onClick={run(() => a.remove(book))}
            >
              <Trash2 size={14} /> Delete book
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- the table ---------- */

export default function BooksTable({ books }: { books: DbBook[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const [editing, setEditing] = useState<DbBook | null>(null);
  const [, startTransition] = useTransition();

  const items = books.map(toUi);
  const find = (id: string) => items.find((b) => b.id === id)!;
  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
    });

  const actions: Actions = {
    visibility: (id) =>
      run(() =>
        setBookVisibility(
          id,
          find(id).visibility === "Public" ? "private" : "public",
        ),
      ),
    chapters: (id) => router.push(`/admin/studio/books/${id}`),
    status: (id) =>
      run(() =>
        setBookStatus(
          id,
          find(id).status === "Published" ? "draft" : "published",
        ),
      ),
    featured: (id) => run(() => setBookFeatured(id, !find(id).featured)),
    duplicate: () => {}, // later
    remove: (book) => setToDelete(book),
    edit: (id) => setEditing(books.find((b) => b.id === id) ?? null),
  };

  const rows = items.filter(
    (b) =>
      (filter === "All" ||
        b.status === filter ||
        (filter === "Private" && b.visibility === "Private")) &&
      b.title.toLowerCase().includes(query.toLowerCase()),
  );

  const dropUp = (index: number) => rows.length > 2 && index >= rows.length - 2;

  return (
    <section className={`rounded-2xl border ${line} bg-white shadow-sm`}>
      {/* toolbar: tabs on the left, search at the far right */}
      <div
        className={`flex flex-wrap items-center gap-3 border-b ${line} p-4 md:px-5`}
      >
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

        <label className="relative ml-auto w-full sm:w-64">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books"
            className="h-10 w-full rounded-xl border border-[#18382f]/10 bg-[#1d3318] pl-9 pr-3 text-xs text-[#fffefd] outline-none transition placeholder:text-white/60 focus:border-[#a45134]"
          />
        </label>
      </div>

      {/* ===== table (md and up) ===== */}
      <div
        className={`hidden border-b ${line} bg-[#f1ede4] text-[10px] font-bold uppercase tracking-[0.14em] text-[#6d7872] md:grid ${grid}`}
      >
        <span className={`${cell} flex py-3`}>Book</span>
        <span className={`${cell} hidden justify-center py-3 lg:flex`}>
          Chapters
        </span>
        <span className={`${cell} flex py-3`}>Status</span>
        <span className={`${cell} flex py-3`}>Visibility</span>
        <span className={`${cell} hidden py-3 xl:flex`}>Last edited</span>
        <span className={`${cell} flex justify-end py-3`}>
          <span className="hidden lg:inline">Actions</span>
          <span className="lg:hidden">More</span>
        </span>
      </div>

      {rows.map((book, index) => (
        <div
          key={book.id}
          className={`hidden border-b ${line} transition hover:bg-[#faf8f3] md:grid ${grid}`}
        >
          <div className={`${cell} flex min-w-0 gap-4 py-4`}>
            <Link
              href={`/admin/studio/books/${book.id}`}
              aria-label={`Open ${book.title}`}
              className="shrink-0"
            >
              <Cover from={book.from} to={book.to} />
            </Link>
            <div className="min-w-0">
              <Link
                href={`/admin/studio/books/${book.id}`}
                className="block truncate font-serif text-[17px] text-[#243b34] transition hover:text-[#a45134] hover:underline"
              >
                {book.title}
              </Link>
              <p className="mt-0.5 truncate text-[11px] text-[#87908b]">
                {book.genre}
                <span className="lg:hidden"> · {book.chapters} chapters</span>
              </p>
              {book.featured && (
                <div className="mt-1.5">
                  <FeaturedBadge />
                </div>
              )}
            </div>
          </div>

          <div
            className={`${cell} hidden justify-center py-4 text-sm font-semibold text-[#243b34] lg:flex`}
          >
            {book.chapters}
          </div>
          <div className={`${cell} flex py-4`}>
            <StatusBadge status={book.status} />
          </div>
          <div className={`${cell} flex py-4`}>
            <VisibilityBadge visibility={book.visibility} />
          </div>
          <div className={`${cell} hidden py-4 text-xs text-[#74807a] xl:flex`}>
            {book.edited}
          </div>

          <div className={`${cell} flex justify-end gap-1.5 py-4`}>
            {/* quick buttons only on large screens; everything is also in the menu */}
            <button
              onClick={() => actions.edit(book.id)}
              className={`${iconBtn} hidden lg:grid`}
              aria-label={`Edit ${book.title}`}
              title="Edit"
            >
              <PencilLine size={15} />
            </button>
            <button
              className={`${iconBtn} hidden lg:grid`}
              aria-label={`View ${book.title}`}
              title="View on site"
            >
              <Eye size={15} />
            </button>
            <RowMenu book={book} dropUp={dropUp(index)} a={actions} />
          </div>
        </div>
      ))}

      {/* ===== cards (phones) ===== */}
      <div className={`divide-y divide-[#d6cfbf] md:hidden`}>
        {rows.map((book, index) => (
          <div key={book.id} className="flex items-start gap-3 p-4">
            <Link
              href={`/admin/studio/books/${book.id}`}
              aria-label={`Open ${book.title}`}
              className="shrink-0"
            >
              <Cover from={book.from} to={book.to} />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/studio/books/${book.id}`}
                className="block truncate font-serif text-[17px] text-[#243b34] transition hover:text-[#a45134] hover:underline"
              >
                {book.title}
              </Link>
              <p className="mt-0.5 truncate text-[11px] text-[#87908b]">
                {book.genre} · {book.chapters} chapters
              </p>
              <p className="text-[11px] text-[#87908b]">Edited {book.edited}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusBadge status={book.status} />
                <VisibilityBadge visibility={book.visibility} />
                {book.featured && <FeaturedBadge />}
              </div>
            </div>
            <RowMenu book={book} dropUp={dropUp(index)} a={actions} />
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="px-5 py-12 text-center text-sm text-[#87908b]">
          No books match your search.
        </p>
      )}

      {/* footer */}
      <div
        className={`rounded-b-2xl bg-[#faf8f3] px-5 py-3 text-[11px] text-[#87908b] ${rows.length ? "" : `border-t ${line}`}`}
      >
        Showing {rows.length} of {items.length} books
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
            <h3 className="font-serif text-xl text-[#183a31]">
              Delete this book?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#66736d]">
              "{toDelete.title}" and all its chapters will be removed. This
              can't be undone.
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
                  run(() => deleteBook(toDelete.id));
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
      {editing && (
        <BookCreationForm
          key={editing.id}
          book={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}
