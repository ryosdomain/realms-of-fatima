import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type Tag = "Private" | null;

export type LibraryChapter = {
  id: string;
  title: string;
  position: number;
  minutes: number;
  excerpt: string;
  tag?: Tag;
};
export type LibraryBook = {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  cover_from: string;
  cover_to: string;
  cover_shape: string | null;
  featured: boolean;
  tag?: Tag;
  chapters: LibraryChapter[];
};

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// html -> plain text
export const plain = (html: string) =>
  decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

// keeps only <strong>, <em> and <br>; every other tag is dropped and any stray "<" is escaped
const cleanInline = (html: string) =>
  html
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag: string) => {
      const t = tag.toLowerCase();
      if (t === "br") return "<br>";
      if (t === "strong" || t === "em") return m.startsWith("</") ? `</${t}>` : `<${t}>`;
      return "";
    })
    .replace(/<(?!\/?(?:strong|em)>|br>)/gi, "&lt;");

type Row = Omit<LibraryBook, "chapters" | "tag"> & {
  visibility: string;
  chapters: {
    id: string;
    title: string;
    position: number;
    visibility: string;
    content: string;
  }[];
};

// database row -> what the pages need (the full text stays on the server)
const shape = (b: Row): LibraryBook => {
  const bookTag: Tag = b.visibility !== "public" ? "Private" : null;

  return {
    ...b,
    tag: bookTag,
    chapters: b.chapters.map(({ content, visibility, ...c }) => {
      const text = plain(content);
      const words = text ? text.split(" ").length : 0;
      return {
        ...c,
        tag: bookTag ?? (visibility !== "public" ? ("Private" as const) : null),
        minutes: Math.max(1, Math.round(words / 200)),
        excerpt: text.slice(0, 120) + (text.length > 120 ? "…" : ""),
      };
    }),
  };
};

// The public library: published + public books, only their published + public chapters.
// This is what visitors see, and what the home page, library page and drawer list.
export const getLibrary = cache(async (): Promise<LibraryBook[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select(
      "id, title, description, genre, cover_from, cover_to, cover_shape, featured, visibility, chapters!inner(id, title, position, visibility, content)"
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .eq("chapters.status", "published")
    .eq("chapters.visibility", "public")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .order("position", { referencedTable: "chapters", ascending: true });

  return ((data ?? []) as unknown as Row[]).map(shape);
});

// One published book for a signed-in author, even if it's private (the dashboard "View" button).
// Signed out: nothing. Signed in as someone else: the database rules return nothing too.
export async function getAuthorBook(id: string): Promise<LibraryBook | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: book } = await supabase
    .from("books")
    .select("id, title, description, genre, cover_from, cover_to, cover_shape, featured, visibility")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (!book) return null;

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, title, position, visibility, content")
    .eq("book_id", id)
    .eq("status", "published")
    .order("position");

  return shape({ ...book, chapters: chapters ?? [] } as unknown as Row);
}

export async function getChapter(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("chapters")
    .select("id, book_id, title, position, content")
    .eq("id", id)
    .eq("status", "published");
  if (!user) query = query.eq("visibility", "public");

  const { data } = await query.maybeSingle();
  return data;
}

type Block = { tag: string; html: string; words: number };

// chapter HTML -> pages (about 170 words each). Each page is a list of blocks like
// "<p>text with <strong>bold</strong></p>", "<h1>…</h1>", "<h2>…</h2>".
export function toPages(html: string, wordsPerPage = 170): string[][] {
  const blocks: Block[] = [...html.matchAll(/<(p|h1|h2|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => {
      const tag = m[1].toLowerCase();
      const text = plain(m[2]);
      return {
        tag,
        html: `<${tag}>${cleanInline(m[2]).trim()}</${tag}>`,
        words: text ? text.split(" ").length : 0,
      };
    })
    .filter((b) => b.words > 0);

  const pages: Block[][] = [];
  let current: Block[] = [];
  let count = 0;

  for (const b of blocks) {
    if (current.length && count + b.words > wordsPerPage) {
      // never leave a heading alone at the bottom of a page: it moves to the next one
      const last = current[current.length - 1];
      const carry = current.length > 1 && (last.tag === "h1" || last.tag === "h2") ? [current.pop()!] : [];
      pages.push(current);
      current = carry;
      count = carry.reduce((n, x) => n + x.words, 0);
    }
    current.push(b);
    count += b.words;
  }
  if (current.length) pages.push(current);

  return pages.map((p) => p.map((b) => b.html));
}