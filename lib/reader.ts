import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type LibraryChapter = {
  id: string;
  title: string;
  position: number;
  minutes: number;
  excerpt: string;
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
  chapters: LibraryChapter[];
};

// books that are published + public, with only their published + public chapters
export const getLibrary = cache(async (): Promise<LibraryBook[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select(
      "id, title, description, genre, cover_from, cover_to, cover_shape, featured, chapters!inner(id, title, position, content)"
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .eq("chapters.status", "published")
    .eq("chapters.visibility", "public")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .order("position", { referencedTable: "chapters", ascending: true });

  type Row = Omit<LibraryBook, "chapters"> & {
    chapters: { id: string; title: string; position: number; content: string }[];
  };

  // the full text stays on the server: the drawer only gets a read time and a short excerpt
  return ((data ?? []) as Row[]).map((b) => ({
    ...b,
    chapters: b.chapters.map(({ content, ...c }) => {
      const text = plain(content);
      const words = text ? text.split(" ").length : 0;
      return {
        ...c,
        minutes: Math.max(1, Math.round(words / 200)),
        excerpt: text.slice(0, 120) + (text.length > 120 ? "…" : ""),
      };
    }),
  }));
});

export async function getChapter(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapters")
    .select("id, book_id, title, position, content")
    .eq("id", id)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();
  return data;
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const plain = (html: string) =>
  decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
// chapter HTML -> pages of paragraphs (about 170 words per page)
export function toPages(html: string, wordsPerPage = 170): string[][] {
  const blocks = [...html.matchAll(/<(p|h1|h2|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => decode(m[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, "")).trim())
    .filter(Boolean);

  const pages: string[][] = [];
  let current: string[] = [];
  let count = 0;

  for (const block of blocks) {
    const words = block.split(/\s+/).length;
    if (current.length && count + words > wordsPerPage) {
      pages.push(current);
      current = [];
      count = 0;
    }
    current.push(block);
    count += words;
  }
  if (current.length) pages.push(current);

  return pages;
}