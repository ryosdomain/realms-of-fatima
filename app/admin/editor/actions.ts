"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const hex = /^#[0-9a-fA-F]{6}$/;

async function authed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}

const refresh = (bookId?: string) => {
  revalidatePath("/admin/editor");
  revalidatePath("/admin/studio/books");
  revalidatePath("/admin/studio/chapters");
  if (bookId) revalidatePath(`/admin/studio/books/${bookId}`);
};

export async function saveChapter(input: {
  id: string;
  book_id: string;
  title: string;
  position: number;
  content: string;
  text_color: string;
  page_color: string;
  status: string;
}) {
  const supabase = await authed();

  const { data: current } = await supabase
    .from("chapters")
    .select("position")
    .eq("id", input.id)
    .maybeSingle();
  if (!current) return { error: "Could not save: this chapter wasn't found or isn't yours." };

  const position = Math.max(1, Math.floor(input.position) || current.position);

  // if another chapter already has that number, the two swap places
  if (position !== current.position) {
    await supabase
      .from("chapters")
      .update({ position: current.position })
      .eq("book_id", input.book_id)
      .eq("position", position)
      .neq("id", input.id);
  }

  const { error } = await supabase
    .from("chapters")
    .update({
      title: input.title.trim() || "Untitled chapter",
      position,
      content: input.content,
      text_color: hex.test(input.text_color) ? input.text_color : "#32453f",
      page_color: hex.test(input.page_color) ? input.page_color : "#fffdf7",
      status: input.status === "published" ? "published" : "draft",
    })
    .eq("id", input.id);
  if (error) return { error: error.message };

  await supabase.from("books").update({ updated_at: new Date().toISOString() }).eq("id", input.book_id);

  refresh(input.book_id);
  return {};
}

export async function addChapter(bookId: string) {
  const supabase = await authed();

  const { data: last } = await supabase
    .from("chapters")
    .select("position")
    .eq("book_id", bookId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (last?.position ?? 0) + 1;

  const { data, error } = await supabase
    .from("chapters")
    .insert({ book_id: bookId, position: next, title: `Chapter ${next}` })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  refresh(bookId);
  redirect(`/admin/editor?chapter=${data.id}`);
}

// used by the editor's "Delete chapter" button: afterwards go to another chapter
export async function deleteChapter(id: string, bookId: string) {
  const supabase = await authed();
  await supabase.from("chapters").delete().eq("id", id);

  const { data: first } = await supabase
    .from("chapters")
    .select("id")
    .eq("book_id", bookId)
    .order("position")
    .limit(1)
    .maybeSingle();

  refresh(bookId);
  redirect(first ? `/admin/editor?chapter=${first.id}` : `/admin/studio/books/${bookId}`);
}

// used by the table: stays on the same page
export async function removeChapter(id: string, bookId: string) {
  const supabase = await authed();
  await supabase.from("chapters").delete().eq("id", id);
  refresh(bookId);
}

export async function setChapterStatus(id: string, bookId: string, status: "draft" | "published") {
  const supabase = await authed();
  await supabase.from("chapters").update({ status }).eq("id", id);
  refresh(bookId);
}

export async function moveChapter(id: string, bookId: string, direction: "up" | "down") {
  const supabase = await authed();
  const { data: list } = await supabase
    .from("chapters")
    .select("id")
    .eq("book_id", bookId)
    .order("position")
    .order("created_at");
  if (!list) return;

  const i = list.findIndex((c) => c.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;

  // swap the two, then give every chapter a clean 1, 2, 3… number
  const order = list.map((c) => c.id);
  [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(
    order.map((cid, k) => supabase.from("chapters").update({ position: k + 1 }).eq("id", cid))
  );

  refresh(bookId);
}