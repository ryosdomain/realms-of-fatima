"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const hex = /^#[0-9a-fA-F]{6}$/;
const shapes = ["none", "circle", "ring", "diamond", "lines"];

async function authed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}

const refresh = () => {
  revalidatePath("/admin/studio");
  revalidatePath("/admin/studio/books");
};

// reads the form fields shared by "create" and "edit"
function fieldsFrom(formData: FormData) {
  const text = (key: string) => String(formData.get(key) ?? "").trim();
  return {
    title: text("title") || "Untitled story",
    description: text("description") || null,
    genre: text("genre") || null,
    visibility: text("visibility") === "public" ? "public" : "private",
    cover_from: hex.test(text("cover_from")) ? text("cover_from") : "#1a3c35",
    cover_to: hex.test(text("cover_to")) ? text("cover_to") : "#31594e",
    cover_shape: shapes.includes(text("cover_shape")) ? text("cover_shape") : "none",
  };
}

export async function createBook(formData: FormData) {
  const supabase = await authed();

  const { data: book, error } = await supabase
    .from("books")
    .insert(fieldsFrom(formData))
    .select("id")
    .single();
  if (error) return { error: error.message };

  refresh();

  if (String(formData.get("intent")) === "write") {
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .insert({ book_id: book.id, title: "Chapter 1", position: 1 })
      .select("id")
      .single();
    if (chapterError) return { error: chapterError.message };

    redirect(`/admin/editor?chapter=${chapter.id}`);
  }

  return {};
}

export async function updateBook(formData: FormData) {
  const supabase = await authed();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("books").update(fieldsFrom(formData)).eq("id", id);
  if (error) return { error: error.message };

  refresh();
  return {};
}

export async function setBookStatus(id: string, status: "draft" | "published") {
  const supabase = await authed();
  await supabase.from("books").update({ status }).eq("id", id);
  refresh();
}

export async function setBookVisibility(id: string, visibility: "public" | "private") {
  const supabase = await authed();
  await supabase.from("books").update({ visibility }).eq("id", id);
  refresh();
}

export async function setBookFeatured(id: string, featured: boolean) {
  const supabase = await authed();
  // only one featured book at a time
  if (featured) await supabase.from("books").update({ featured: false }).eq("featured", true);
  await supabase.from("books").update({ featured }).eq("id", id);
  refresh();
}

export async function deleteBook(id: string) {
  const supabase = await authed();
  await supabase.from("books").delete().eq("id", id); // its chapters go with it
  refresh();
}