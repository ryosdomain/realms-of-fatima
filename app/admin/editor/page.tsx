"use client";

import { useState } from "react";
import Link from "next/link";
import { TextStyleExtras, Quote, applyTextStyle } from "@/lib/tiptap-extensions";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";

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

const textColorOptions = ["#32453f", "#20262d", "#5b4036", "#284b63", "#563d5c"];
const pageColorOptions = ["#fffdf7", "#f7f3ea", "#f1f5f2", "#f1f3f7", "#fff5f1"];

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
    { label: "B", title: "Bold", active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run(), className: "font-bold" },
    { label: "I", title: "Italic", active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run(), className: "italic font-serif" },
    { label: "H1", title: "Heading 1", active: editor.isActive("heading", { level: 1 }), run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), className: "" },
    { label: "H2", title: "Heading 2", active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), className: "" },
    { label: "“", title: "Quote", active: editor.isActive("quote"), run: () => editor.chain().focus().toggleNode("quote", "paragraph").run(), className: "font-serif text-base" },  ];

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
          className={`grid h-8 min-w-8 place-items-center rounded-md px-2 text-xs font-semibold transition ${t.className} ${
            t.active ? "bg-[#183a31] text-white" : "hover:bg-[#eae4d8]"
          }`}
        >
          {t.label}
        </button>
      ))}

      <span className="mx-1 h-5 w-px shrink-0 bg-[#18382f]/10" />

      <select
        aria-label="Font size"
        title="Font size"
        value={editor.getAttributes("textStyle").fontSize ?? ""}
        onChange={(e) => applyTextStyle(editor, { fontSize: e.target.value || null })}
        className="h-8 shrink-0 rounded-md border border-[#18382f]/10 bg-white/60 px-2 text-xs font-semibold outline-none"
      >
        <option value="">Size</option>
        {fontSizes.map((s) => (
          <option key={s} value={`${s}px`}>{s}</option>
        ))}
      </select>

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

function EditorContents() {
  return (
    <>
      <div className="flex items-center justify-between px-2 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f8984]">
          Book contents
        </p>
        <button className="grid size-8 place-items-center rounded-md hover:bg-[#18382f]/5" aria-label="Add chapter">
          <Plus size={15} />
        </button>
      </div>
      <div className="mt-3 space-y-1">
        {chapters.map(([number, title], index) => (
          <button
            key={number}
            className={`w-full rounded-xl p-3 text-left ${index === 0 ? "bg-[#eae4d8]" : "hover:bg-[#f1ede4]"}`}
          >
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#a45134]">
              Chapter {Number(number)}
            </span>
            <span className="mt-1 block text-xs font-semibold leading-5">{title}</span>
          </button>
        ))}
      </div>
      <button className="mt-4 flex w-full items-center gap-2 rounded-xl border border-dashed border-[#18382f]/15 p-3 text-xs font-semibold text-[#66736d]">
        <Plus size={15} /> Add chapter
      </button>
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
        selected ? "border-[#18382f] ring-2 ring-[#18382f]/12 ring-offset-2" : "border-[#18382f]/12 hover:scale-105"
      }`}
      aria-label={label}
      aria-pressed={selected}
    >
      <span className="size-6 rounded-full border border-black/10" style={{ backgroundColor: color }} />
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
          <span className="size-5 rounded-md border border-black/10" style={{ backgroundColor: value }} />
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
}: {
  textColor: string;
  pageColor: string;
  setTextColor: (color: string) => void;
  setPageColor: (color: string) => void;
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
            <ColorRow title="Text color" value={textColor} options={textColorOptions} onChange={setTextColor} />
          </div>
          <div className="mt-5 border-t border-[#18382f]/8 pt-5">
            <ColorRow title="Page background" value={pageColor} options={pageColorOptions} onChange={setPageColor} />
          </div>
        </section>

        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">Status</span>
          <span className="flex h-11 items-center rounded-xl border border-[#18382f]/10 bg-white px-3">
            <select className="w-full appearance-none bg-transparent text-xs font-semibold outline-none">
              <option>Draft</option>
              <option>In review</option>
              <option>Published</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none" />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">Chapter number</span>
          <input
            defaultValue="1"
            inputMode="numeric"
            className="h-11 w-full rounded-xl border border-[#18382f]/10 bg-white px-3 text-xs outline-none"
          />
        </label>

        <div>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#7d8782]">Header image</span>
          <button className="flex h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#18382f]/20 bg-white text-[10px] text-[#7d8782]">
            <ImageIcon size={19} className="mb-2 text-[#a45134]" />
            Upload an image
          </button>
        </div>

        <label className="flex items-start justify-between gap-4 rounded-xl border border-[#18382f]/10 bg-white p-4">
          <span>
            <span className="block text-xs font-semibold">Show on homepage</span>
            <span className="mt-1 block text-[10px] leading-4 text-[#8a928e]">Feature this chapter for readers</span>
          </span>
          <input type="checkbox" defaultChecked className="mt-1 accent-[#183a31]" />
        </label>
      </div>
    </>
  );
}

/* ---------- Page ---------- */

export default function EditorPage() {
  const [saved, setSaved] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"contents" | "settings" | null>(null);
  const [textColor, setTextColor] = useState("#32453f");
  const [pageColor, setPageColor] = useState("#fffdf7");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] }, blockquote: false }),
      TextStyle,
      TextStyleExtras,
      Quote,
    ],
    content: initialContent,
    immediatelyRender: false, // avoids hydration errors in Next.js
    shouldRerenderOnTransaction: true, // keeps toolbar buttons + word count in sync
    editorProps: {
      attributes: {
        class: "editor-copy min-h-[560px] outline-none font-serif text-[19px] leading-[1.9] md:text-[22px]",
        "aria-label": "Chapter content",
      },
    },
  });

  const words = editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));

  const save = () => {
    // later: const html = editor?.getHTML(); send html + textColor + pageColor to a server action
    console.log(editor?.getHTML());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f3ec] text-[#263832]">
      <header className="flex h-17 shrink-0 items-center justify-between border-b border-[#18382f]/10 bg-white px-4 md:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/admin"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#18382f]/10"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={17} />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-serif text-base text-[#183a31]">The Quiet Between Stars</p>
            <p className="text-[10px] text-[#8c938f]">Chapter 1 · Draft saved a moment ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden h-10 items-center gap-2 rounded-lg border border-[#18382f]/10 px-4 text-xs font-semibold sm:flex">
            <Eye size={15} /> Preview
          </button>
          <button
            onClick={save}
            className="flex h-10 items-center gap-2 rounded-lg border border-[#18382f]/12 bg-white px-3 text-xs font-semibold text-[#183a31] sm:px-4"
            aria-label="Save chapter as draft"
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            <span className="hidden min-[430px]:inline">{saved ? "Saved" : "Save draft"}</span>
          </button>
          <button
            className="flex h-10 items-center gap-2 rounded-lg bg-[#183a31] px-3 text-xs font-semibold text-white transition hover:bg-[#234c41] sm:px-4"
            aria-label="Publish chapter"
          >
            <Upload size={15} />
            <span className="hidden min-[430px]:inline">Publish chapter</span>
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
        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold hover:bg-[#18382f]/5 sm:hidden">
          <Eye size={16} /> Preview
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] xl:grid-cols-[250px_1fr_290px]">
        <aside className="hidden overflow-y-auto border-r border-[#18382f]/10 bg-[#fbfaf6] p-4 xl:block">
          <EditorContents />
          <pre className="mt-6 whitespace-pre-wrap text-xs text-black/60">{editor?.getHTML()}</pre>
        </aside>

        <main
          className="overflow-y-auto px-5 py-8 transition-colors duration-300 md:px-10 md:py-12"
          style={{ backgroundColor: pageColor }}
        >
          <article className="mx-auto max-w-180">
            <div className="flex items-center gap-4 text-[11px] text-[#8a928e]">
              <span>{words.toLocaleString()} words</span>
              <span className="size-1 rounded-full bg-[#b8bbb7]" />
              <span>{minutes} min read</span>
            </div>

            <div className="sticky top-0 z-10 mt-4 flex items-center gap-1 overflow-x-auto border-y border-[#18382f]/10 py-2 text-[#61706a]" style={{ backgroundColor: pageColor }}>
              {editor && <FormatButtons editor={editor} />}
              <span className="mx-1 h-5 w-px shrink-0 bg-[#18382f]/10" />
              <label
                className="relative flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md px-2 text-[10px] font-semibold hover:bg-[#eae4d8]"
                title="Text color"
              >
                <span className="font-serif text-sm font-bold">A</span>
                <span className="h-1.5 w-5 rounded-full" style={{ backgroundColor: textColor }} />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  aria-label="Text color"
                />
              </label>
              <label
                className="relative flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md px-2 text-[10px] font-semibold hover:bg-[#eae4d8]"
                title="Page background"
              >
                <span className="size-4 rounded border border-black/10" style={{ backgroundColor: pageColor }} />
                Page
                <input
                  type="color"
                  value={pageColor}
                  onChange={(e) => setPageColor(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  aria-label="Page background color"
                />
              </label>
            </div>

            <div className="mt-8 transition-colors" style={{ color: textColor }}>
              <EditorContent editor={editor} />
            </div>
          </article>
        </main>

        <aside className="hidden overflow-y-auto border-l border-[#18382f]/10 bg-[#fbfaf6] p-5 xl:block">
          <EditorSettings
            textColor={textColor}
            pageColor={pageColor}
            setTextColor={setTextColor}
            setPageColor={setPageColor}
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
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a45134]">Editor tools</p>
                <h2 className="mt-1 font-serif text-2xl text-[#183a31]">
                  {mobilePanel === "contents" ? "Book contents" : "Appearance & settings"}
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
              <EditorContents />
            ) : (
              <EditorSettings
                textColor={textColor}
                pageColor={pageColor}
                setTextColor={setTextColor}
                setPageColor={setPageColor}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}