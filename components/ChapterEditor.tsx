"use client";

import Link from "next/link";
import {
  TextStyleExtras,
  Quote,
  applyTextStyle,
} from "@/lib/tiptap-extensions";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  saveChapter,
  addChapter,
  deleteChapter,
} from "@/app/admin/editor/actions";
import {
  ArrowLeft,
  BookCopy,
  Check,
  ChevronDown,
  Eye,
  Image as ImageIcon,
  Plus,
  Save,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
type ChapterRow = {
  id: string;
  title: string;
  position: number;
  status: string;
};
type Props = {
  book: { id: string; title: string };
  chapter: {
    id: string;
    book_id: string;
    title: string;
    content: string;
    text_color: string;
    page_color: string;
    position: number;
    status: string;
  };
  chapters: ChapterRow[];
};
const chapters = [
  ["01", "The Last Train North", "8 min read"],
  ["02", "A Light in the Valley", "11 min read"],
  ["03", "Things We Left Behind", "9 min read"],
  ["04", "The Shape of Morning", "13 min read"],
];

const fontSizes = [14, 16, 18, 20, 24, 28, 32, 40];
const fontWeights = [
  ["Light", "300"],
  ["Regular", "400"],
  ["Medium", "500"],
  ["Semibold", "600"],
  ["Bold", "700"],
];

const textColorOptions = [
  "#32453f",
  "#20262d",
  "#5b4036",
  "#284b63",
  "#FFA500",
];
const pageColorOptions = [
  "#fffdf7",
  "#00f3ea",
  "#f1f500",
  "#f100f7",
  "#000000",
];

const initialContent = `
<h1>The Last Train North</h1>
<p>The train left the city at six minutes past midnight, carrying twenty-three passengers and one letter that should not have existed.</p>
<p>Mara noticed it somewhere beyond Bellweather, when the lights of the last station had faded into the dark. It sat on the empty seat opposite her—cream paper, blue ink, her name written in a hand she knew as well as her own.</p>
<p><em>Because it was her own.</em></p>
<p>Outside, the northern fields unspooled beneath a moonless sky. Inside, the carriage hummed softly, keeping its small collection of strangers suspended between where they had been and wherever they were going.</p>
<p>She reached for the envelope.</p>
`;

/* ---------- Sub-components (kept outside the page so they don't remount) ---------- */

function FormatButtons({ editor }: { editor: Editor }) {
  const tools = [
    {
      label: "B",
      title: "Bold",
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
      className: "font-bold",
    },
    {
      label: "I",
      title: "Italic",
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
      className: "italic font-serif",
    },
    {
      label: "H1",
      title: "Heading 1",
      active: editor.isActive("heading", { level: 1 }),
      run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      className: "",
    },
    {
      label: "H2",
      title: "Heading 2",
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      className: "",
    },
    // {
    //   label: "“",
    //   title: "Quote",
    //   active: editor.isActive("quote"),
    //   run: () => editor.chain().focus().toggleNode("quote", "paragraph").run(),
    //   className: "font-serif text-base",
    // },
  ];

  return (
    <>
      {tools.map((t) => (
        <button
          key={t.label}
          type="button"
          title={t.title}
          aria-pressed={t.active}
          onMouseDown={(e) => e.preventDefault()}
          onClick={t.run}
          className={`grid h-8  min-w-8 place-items-center rounded-md px-2 text-xs font-semibold transition ${t.className} ${
            t.active ? "bg-[#183a31] text-white" : "hover:bg-[#eae4d8]"
          }`}
        >
          {t.label}
        </button>
      ))}

      <span className="mx-1 h-5 w-px shrink-0 bg-[#18382f]/10" />

      {/* <select
        aria-label="Font size"
        title="Font size"
        value={editor.getAttributes("textStyle").fontSize ?? ""}
        onChange={(e) =>
          applyTextStyle(editor, { fontSize: e.target.value || null })
        }
        className="h-8 shrink-0 rounded-md border border-[#18382f]/10 bg-white/60 px-2 text-xs font-semibold outline-none"
      >
        <option value="">Size</option>
        {fontSizes.map((s) => (
          <option key={s} value={`${s}px`}>
            {s}
          </option>
        ))}
      </select> */}

      {/* <select
        aria-label="Font weight"
        title="Font weight"
        value={editor.getAttributes("textStyle").fontWeight ?? ""}
        onChange={(e) => applyTextStyle(editor, { fontWeight: e.target.value || null })}
        className="h-8 shrink-0 rounded-md border border-[#18382f]/10 bg-white/60 px-2 text-xs font-semibold outline-none"
      >
        <option value="">Weight</option>
        {fontWeights.map(([label, value]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select> */}
    </>
  );
}

function EditorContents({
  chapters,
  activeId,
  bookId,
  dirty,
}: {
  chapters: ChapterRow[];
  activeId: string;
  bookId: string;
  dirty: boolean;
}) {
  const leave = (e: React.SyntheticEvent) => {
    if (
      dirty &&
      !window.confirm("You have unsaved changes. Leave this chapter anyway?")
    )
      e.preventDefault();
  };

  return (
    <>
      <p className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f8984]">
        Book contents
      </p>
      <div className="mt-3 space-y-1">
        {chapters.map((c, i) => (
          <Link
            key={c.id}
            href={`/admin/editor?chapter=${c.id}`}
            onClick={leave}
            className={`block w-full rounded-xl p-3 text-left ${c.id === activeId ? "bg-[#eae4d8]" : "hover:bg-[#f1ede4]"}`}
          >
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#a45134]">
              Chapter {i + 1} · {c.status}
            </span>
            <span className="mt-1 block text-xs font-semibold leading-5">
              {c.title}
            </span>
          </Link>
        ))}
      </div>
      <form action={addChapter.bind(null, bookId)} onSubmit={leave}>
        <button className="mt-4 flex w-full items-center gap-2 rounded-xl border border-dashed border-[#18382f]/15 p-3 text-xs font-semibold text-[#66736d] hover:bg-[#f1ede4]">
          <Plus size={15} /> Add chapter
        </button>
      </form>
    </>
  );
}

function ColorChoice({
  color,
  selected,
  onClick,
  label,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full border transition ${
        selected
          ? "border-[#18382f] ring-2 ring-[#18382f]/12 ring-offset-2"
          : "border-[#18382f]/12 hover:scale-105"
      }`}
      aria-label={label}
      aria-pressed={selected}
    >
      <span
        className="size-6 rounded-full border border-black/10"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}

function ColorRow({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold">{title}</span>
        <label className="relative flex cursor-pointer items-center gap-2 text-[10px] font-semibold text-[#69766f]">
          Custom
          <span
            className="size-5 rounded-md border border-black/10"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            aria-label={`Choose a custom ${title.toLowerCase()}`}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((color) => (
          <ColorChoice
            key={color}
            color={color}
            selected={value === color}
            onClick={() => onChange(color)}
            label={`Use ${color} for ${title.toLowerCase()}`}
          />
        ))}
      </div>
    </div>
  );
}

function EditorSettings({
  textColor,
  pageColor,
  setTextColor,
  setPageColor,
  status,
  setStatus,
  onDelete,
}: {
  textColor: string;
  pageColor: string;
  setTextColor: (color: string) => void;
  setPageColor: (color: string) => void;
  status: string;
  setStatus: (status: string) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <h3 className="font-serif text-lg text-[#183a31]">Chapter settings</h3>
      <div className="mt-6 space-y-6">
        <section className="rounded-2xl border border-[#18382f]/10 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7d8782]">
            Page appearance
          </p>
          <div className="mt-4">
            <ColorRow
              title="Text color"
              value={textColor}
              options={textColorOptions}
              onChange={setTextColor}
            />
          </div>
          <div className="mt-5 border-t border-[#18382f]/8 pt-5">
            <ColorRow
              title="Page background"
              value={pageColor}
              options={pageColorOptions}
              onChange={setPageColor}
            />
          </div>
        </section>

        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">
            Status
          </span>
          <span className="flex h-11 items-center rounded-xl border border-[#18382f]/10 bg-white px-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none bg-transparent text-xs font-semibold outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none" />
          </span>
          <span className="mt-2 block text-[10px] leading-4 text-[#8a928e]">
            Readers only see a published chapter inside a published, public
            book.
          </span>
        </label>

        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-xl border border-[#a45134]/30 bg-[#fff5f1] py-3 text-xs font-semibold text-[#a45134] hover:bg-[#ffe9e1]"
        >
          Delete chapter
        </button>
      </div>
    </>
  );
}

/* ---------- Page ---------- */

export default function ChapterEditor({ book, chapter, chapters }: Props) {
  const [title, setTitle] = useState(chapter.title);
  const [status, setStatus] = useState(chapter.status);
  const [textColor, setTextColor] = useState(chapter.text_color);
  const [pageColor, setPageColor] = useState(chapter.page_color);
  const [mobilePanel, setMobilePanel] = useState<
    "contents" | "settings" | null
  >(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  // setters that also mark "unsaved changes"
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };
  const changeTitle = edit(setTitle);
  const changeStatus = edit(setStatus);
  const changeTextColor = edit(setTextColor);
  const changePageColor = edit(setPageColor);
  const pastingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
        // only bold, italic, H1 and H2 stay: everything else is off
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: false,
      }),
    ],
    content: chapter.content || "<p></p>",
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: () => setDirty(true),
    editorProps: {
      attributes: {
        class:
          "editor-copy min-h-[560px] outline-none font-serif text-[19px] leading-[1.9] md:text-[22px]",
        "aria-label": "Chapter content",
      },
      handlePaste: (view, event) => {
        // guard: view.pasteText calls handlePaste again
        if (pastingRef.current) return false;

        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        event.preventDefault();
        pastingRef.current = true;
        try {
          view.pasteText(text, event);
        } finally {
          pastingRef.current = false;
        }
        return true;
      },
    },
  });

  // warn if the tab is closed with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const words = editor
    ? editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  const number = chapters.findIndex((c) => c.id === chapter.id) + 1;
  const [numberText, setNumberText] = useState(String(chapter.position));
  const changeNumber = (v: string) => {
    setNumberText(v);
    setDirty(true);
  };
  const save = (nextStatus = status) => {
    if (!editor) return;
    setMessage("");
    startTransition(async () => {
      const res = await saveChapter({
        id: chapter.id,
        book_id: book.id,
        title,
        position: parseInt(numberText, 10) || chapter.position,
        content: editor.getHTML(),
        text_color: textColor,
        page_color: pageColor,
        status: nextStatus,
      });
      if (res?.error) {
        setMessage(res.error);
        return;
      }
      setStatus(nextStatus);
      setDirty(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    });
  };

  const remove = () => {
    if (!window.confirm("Delete this chapter? This can't be undone.")) return;
    startTransition(async () => {
      setDirty(false);
      await deleteChapter(chapter.id, book.id);
    });
  };
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f3ec] text-[#263832]">
      <header className="flex h-17 shrink-0 items-center justify-between border-b border-[#18382f]/10 bg-white px-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (
                dirty &&
                !window.confirm(
                  "You have unsaved changes. Leave this chapter anyway?",
                )
              ) {
                return; // stay on the page
              }

              if (window.history.length > 1) router.back();
              else router.push(`/admin/studio/books/${book.id}`);
            }}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#18382f]/10"
            aria-label="Go back"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="min-w-0">
            <p className="truncate font-serif text-base text-[#183a31]">
              {book.title}
            </p>
            <p
              className={`text-[10px] ${message ? "text-[#a45134]" : "text-[#8c938f]"}`}
            >
              {message ||
                `Chapter ${number} · ${dirty ? "Unsaved changes" : "All changes saved"}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="hidden h-10 items-center gap-2 rounded-lg border border-[#18382f]/10 px-4 text-xs font-semibold sm:flex">
            <Eye size={15} /> Preview
          </button> */}
          <button
            onClick={() => save()}
            disabled={pending}
            className="flex h-10 items-center gap-2 rounded-lg border border-[#18382f]/12 bg-white px-3 text-xs font-semibold text-[#183a31] disabled:opacity-50 sm:px-4"
            aria-label="Save chapter"
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            <span className="hidden min-[430px]:inline">
              {pending ? "Saving…" : saved ? "Saved" : "Save"}
            </span>
          </button>
          <button
            onClick={() => save("published")}
            disabled={pending}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#183a31] px-3 text-xs font-semibold text-white transition hover:bg-[#234c41] disabled:opacity-50 sm:px-4"
            aria-label="Publish chapter"
          >
            <Upload size={15} />
            <span className="hidden min-[430px]:inline">
              {status === "published" ? "Update published" : "Publish chapter"}
            </span>
          </button>
        </div>
      </header>

      <div className="flex shrink-0 border-b border-[#18382f]/10 bg-[#fbfaf6]/95 p-2 backdrop-blur-md xl:hidden">
        <button
          onClick={() => setMobilePanel("contents")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold hover:bg-[#18382f]/5"
        >
          <BookCopy size={16} /> Chapters
        </button>
        <span className="my-2 w-px bg-[#18382f]/10" />
        <button
          onClick={() => setMobilePanel("settings")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold hover:bg-[#18382f]/5"
        >
          <Settings size={16} /> Appearance & settings
        </button>
        <span className="my-2 w-px bg-[#18382f]/10 sm:hidden" />
        {/* <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold hover:bg-[#18382f]/5 sm:hidden">
          <Eye size={16} /> Preview
        </button> */}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] xl:grid-cols-[250px_1fr_290px]">
        <aside className="hidden overflow-y-auto border-r border-[#18382f]/10 bg-[#fbfaf6] p-4 xl:block">
          <EditorContents
            chapters={chapters}
            activeId={chapter.id}
            bookId={book.id}
            dirty={dirty}
          />
          {/* <pre className="mt-6 whitespace-pre-wrap text-xs text-black/60">
            {editor?.getHTML()}
          </pre> */}
        </aside>

        <main
          className="overflow-y-auto px-5 py-8 transition-colors duration-300 md:px-10 md:py-12"
          style={{ backgroundColor: pageColor }}
        >
          <article className="mx-auto max-w-180">
            <div className="mb-6 flex items-end gap-3">
              <label className="shrink-0">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">
                  Chapter no.
                </span>
                <input
                  value={numberText}
                  onChange={(e) =>
                    changeNumber(e.target.value.replace(/\D/g, ""))
                  }
                  inputMode="numeric"
                  aria-label="Chapter number"
                  className="h-12 w-20 rounded-xl border border-[#18382f]/25 bg-white/70 px-3 text-center font-serif text-xl outline-none focus:border-[#a45134]"
                />
              </label>
              <label className="min-w-0 flex-1">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">
                  Chapter title
                </span>
                <input
                  value={title}
                  onChange={(e) => changeTitle(e.target.value)}
                  placeholder="Untitled chapter"
                  aria-label="Chapter title"
                  className="h-12 w-full rounded-xl border border-[#18382f]/25 bg-white/70 px-4 font-serif text-2xl tracking-[-0.02em] outline-none focus:border-[#a45134]"
                />
              </label>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#8a928e]">
              <span>{words.toLocaleString()} words</span>
              <span className="size-1 rounded-full bg-[#b8bbb7]" />
              <span>{minutes} min read</span>
            </div>

            <div
              className="sticky backdrop-blur-3xl top-0 z-10 mt-4 flex items-center gap-1 overflow-x-auto border-y border-[#18382f]/25 py-2 text-[#61706a]"
              style={{ backgroundColor: pageColor }}
            >
              {editor && <FormatButtons editor={editor} />}
              <span className="mx-1 h-5 w-px shrink-0 bg-[#18382f]/10" />
              <label
                className="relative flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md px-2 text-[10px] font-semibold hover:bg-[#eae4d8]"
                title="Text color"
              >
                <span className="font-serif text-sm font-bold">A</span>
                <span
                  className="h-1.5 w-5 rounded-full"
                  style={{ backgroundColor: textColor }}
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => changeTextColor(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  aria-label="Text color"
                />
              </label>
              <label
                className="relative flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md px-2 text-[10px] font-semibold hover:bg-[#eae4d8]"
                title="Page background"
              >
                <span
                  className="size-4 rounded border border-black/10"
                  style={{ backgroundColor: pageColor }}
                />
                Page
                <input
                  type="color"
                  value={pageColor}
                  onChange={(e) => changePageColor(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  aria-label="Page background color"
                />
              </label>
            </div>

            <div
              className="mt-8 transition-colors"
              style={{ color: textColor }}
            >
              <EditorContent editor={editor} />
            </div>
          </article>
        </main>

        <aside className="hidden overflow-y-auto border-l border-[#18382f]/10 bg-[#fbfaf6] p-5 xl:block">
          <EditorSettings
            textColor={textColor}
            pageColor={pageColor}
            setTextColor={changeTextColor}
            setPageColor={changePageColor}
            status={status}
            setStatus={changeStatus}
            onDelete={remove}
          />
        </aside>
      </div>

      {mobilePanel && (
        <div
          className="fixed inset-0 z-50 bg-[#11251f]/35 backdrop-blur-[2px] xl:hidden"
          onMouseDown={() => setMobilePanel(null)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[#fbfaf6] p-5 shadow-2xl sm:left-auto sm:top-0 sm:w-07.5 sm:rounded-none sm:rounded-l-3xl sm:p-7"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#18382f]/10 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a45134]">
                  Editor tools
                </p>
                <h2 className="mt-1 font-serif text-2xl text-[#183a31]">
                  {mobilePanel === "contents"
                    ? "Book contents"
                    : "Appearance & settings"}
                </h2>
              </div>
              <button
                onClick={() => setMobilePanel(null)}
                className="grid size-10 place-items-center rounded-full border border-[#18382f]/10"
                aria-label="Close editor panel"
              >
                <X size={18} />
              </button>
            </div>
            {mobilePanel === "contents" ? (
              <EditorContents
                chapters={chapters}
                activeId={chapter.id}
                bookId={book.id}
                dirty={dirty}
              />
            ) : (
              <EditorSettings
                textColor={textColor}
                pageColor={pageColor}
                setTextColor={changeTextColor}
                setPageColor={changePageColor}
                status={status}
                setStatus={changeStatus}
                onDelete={remove}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
