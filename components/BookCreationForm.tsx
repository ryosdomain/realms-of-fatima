"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Globe, Lock, Plus, X } from "lucide-react";
import { createBook, updateBook } from "@/app/admin/studio/books/actions";

export type BookData = {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  visibility: "public" | "private";
  cover_from: string;
  cover_to: string;
  cover_shape: string | null;
};

const palettes = [
  ["#1a3c35", "#31594e"],
  ["#a8583c", "#71372a"],
  ["#53657d", "#2e394c"],
  ["#5f4238", "#372823"],
  ["#563d5c", "#2b1f33"],
  ["#d8a651", "#a45134"],
];

const shapes = [
  ["none", "None"],
  ["circle", "Circle"],
  ["ring", "Ring"],
  ["diamond", "Diamond"],
  ["lines", "Lines"],
];

const genres = [
  "Fictional Scenarios",
  "Literary fiction",
  "Short stories",
  "Magical realism",
  "Memoir",
];

const field =
  "h-12 w-full rounded-xl border border-[#18382f]/12 bg-white px-4 text-sm outline-none focus:border-[#a45134]";

/* ---------- live cover preview ---------- */

function CoverPreview({
  from,
  to,
  shape,
  title,
}: {
  from: string;
  to: string;
  shape: string;
  title: string;
}) {
  return (
    <div
      className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-[3px_8px_8px_3px] shadow-md"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${from}, ${to})`,
      }}
    >
      {shape === "circle" && (
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/20" />
      )}
      {shape === "ring" && (
        <div className="absolute -right-8 -top-8 size-28 rounded-full border-[10px] border-white/25" />
      )}
      {shape === "diamond" && (
        <div className="absolute -right-5 top-3 size-20 rotate-45 bg-white/20" />
      )}
      {shape === "lines" && (
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 14px)",
          }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-3 font-serif text-sm leading-tight text-white/95">
          {title || "Untitled story"}
        </p>
      </div>
    </div>
  );
}

/* ---------- buttons (must live inside the <form> to know when it's saving) ---------- */

function SubmitButtons({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  if (editing)
    return (
      <div className="mt-8">
        <button
          disabled={pending}
          className="h-12 w-full rounded-xl bg-[#183a31] text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    );
   else
    return (
      <div className="mt-8 space-y-3">
        <div className="flex gap-3">
          <button
            name="intent"
            value="draft"
            disabled={pending}
            className="h-12 flex-1 rounded-xl border border-[#18382f]/12 text-sm font-semibold disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save as draft"}
          </button>
          <button
            name="intent"
            value="publish"
            disabled={pending}
            className="h-12 flex-1 rounded-xl bg-[#183a31] text-sm font-semibold text-white disabled:opacity-50"
          >
            Create & publish
          </button>
        </div>
        <p className="text-center text-[11px] leading-5 text-[#8a918d]">
          Create & publish opens the editor so you can write the first chapter.
        </p>
      </div>
    );
}

/* ---------- the form ---------- */

const BookCreationForm = ({
  book,
  onClose,
}: {
  book?: BookData;
  onClose?: () => void;
}) => {
  const editing = book !== undefined;
  const [open, setOpen] = useState(editing); // edit mode starts open
  const [title, setTitle] = useState(book?.title ?? "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    book?.visibility ?? "public",
  );
  const [from, setFrom] = useState(book?.cover_from ?? palettes[0][0]);
  const [to, setTo] = useState(book?.cover_to ?? palettes[0][1]);
  const [shape, setShape] = useState(book?.cover_shape ?? "circle");
  const [error, setError] = useState("");

  const close = () => {
    setOpen(false);
    setError("");
    onClose?.();
  };

  async function submit(formData: FormData) {
    setError("");
    const res = editing
      ? await updateBook(formData)
      : await createBook(formData);
    if (res?.error) {
      setError(res.error);
      return;
    }
    if (!editing) {
      setTitle("");
      setVisibility("public");
    }
    close();
  }

  return (
    <div>
      {!editing && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#183a31] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#214a3f]"
        >
          <Plus size={17} /> Create new book
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#11251f]/35 backdrop-blur-[2px] sm:p-3 md:justify-end"
          onMouseDown={close}
        >
          <div
            className="h-[94vh] w-full max-w-120 overflow-y-auto rounded-t-3xl bg-[#fbf9f4] p-6 shadow-2xl sm:rounded-3xl md:p-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a45134]">
                  {editing ? "Editing" : "New project"}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-[#183a31]">
                  {editing ? "Edit book" : "Create a book"}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid size-10 place-items-center rounded-full border border-[#18382f]/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form action={submit}>
              {book && <input type="hidden" name="id" value={book.id} />}
              {/* values the server needs that aren't normal inputs */}
              <input type="hidden" name="visibility" value={visibility} />
              <input type="hidden" name="cover_from" value={from} />
              <input type="hidden" name="cover_to" value={to} />
              <input type="hidden" name="cover_shape" value={shape} />

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold">
                    Book title
                  </span>
                  <input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled story"
                    className={field}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold">
                    Short description
                  </span>
                  <textarea
                    name="description"
                    defaultValue={book?.description ?? ""}
                    rows={4}
                    placeholder="What is this story about?"
                    className="w-full resize-none rounded-xl border border-[#18382f]/12 bg-white p-4 text-sm outline-none focus:border-[#a45134]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold">Genre</span>
                  <span className="flex h-12 items-center rounded-xl border border-[#18382f]/12 bg-white px-4">
                    <select
                      name="genre"
                      defaultValue={book?.genre ?? genres[0]}
                      className="w-full bg-transparent text-sm outline-none"
                    >
                      {genres.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </span>
                </label>

                {/* visibility */}
                <div>
                  <span className="mb-2 block text-xs font-bold">
                    Who can read it
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["public", "Public", "Readers, once published", Globe],
                        ["private", "Private", "Only you", Lock],
                      ] as const
                    ).map(([value, label, note, Icon]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setVisibility(value)}
                        className={`rounded-xl border p-3 text-left transition ${
                          visibility === value
                            ? "border-[#183a31] bg-white ring-2 ring-[#183a31]/10"
                            : "border-[#18382f]/12 bg-white hover:bg-[#f5f1e8]"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-xs font-bold">
                          <Icon size={14} className="text-[#a45134]" /> {label}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#8a918d]">
                          {note}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* cover creator */}
                <div>
                  <span className="mb-2 block text-xs font-bold">Cover</span>
                  <div className="flex gap-5 rounded-xl border border-[#18382f]/12 bg-[#f5f1e8] p-4">
                    <CoverPreview
                      from={from}
                      to={to}
                      shape={shape}
                      title={title}
                    />

                    <div className="min-w-0 flex-1 space-y-4">
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">
                          Colors
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {palettes.map(([a, b]) => {
                            const selected = from === a && to === b;
                            return (
                              <button
                                key={a + b}
                                type="button"
                                onClick={() => {
                                  setFrom(a);
                                  setTo(b);
                                }}
                                aria-label={`Use colors ${a} to ${b}`}
                                aria-pressed={selected}
                                className={`size-8 rounded-full border transition ${
                                  selected
                                    ? "border-[#183a31] ring-2 ring-[#183a31]/15 ring-offset-2 ring-offset-[#f5f1e8]"
                                    : "border-black/10 hover:scale-105"
                                }`}
                                style={{
                                  backgroundImage: `linear-gradient(to bottom right, ${a}, ${b})`,
                                }}
                              />
                            );
                          })}
                        </div>

                        <div className="mt-3 flex gap-4">
                          {(
                            [
                              ["Start", from, setFrom],
                              ["End", to, setTo],
                            ] as const
                          ).map(([label, value, set]) => (
                            <label
                              key={label}
                              className="relative flex cursor-pointer items-center gap-2 text-[10px] font-semibold text-[#69766f]"
                            >
                              <span
                                className="size-5 rounded-md border border-black/10"
                                style={{ backgroundColor: value }}
                              />
                              {label}
                              <input
                                type="color"
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                className="absolute inset-0 size-full cursor-pointer opacity-0"
                                aria-label={`${label} color`}
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">
                          Shape
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {shapes.map(([value, label]) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setShape(value)}
                              aria-pressed={shape === value}
                              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                                shape === value
                                  ? "bg-[#183a31] text-white"
                                  : "bg-white text-[#4f5f58] hover:bg-[#eae4d8]"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-5 rounded-xl border border-[#a45134]/30 bg-[#fff5f1] p-3 text-xs text-[#a45134]">
                  {error}
                </p>
              )}

              <SubmitButtons editing={editing} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCreationForm;
