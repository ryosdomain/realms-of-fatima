"use client";

import { logout } from "./actions";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import StatCard from "@/components/StatCard";
import BookCreationForm from "@/components/BookCreationForm";
import AdminHeader from "@/components/AdminHeader";
import {
  ArrowRight,
  BookCopy,
  ChevronDown,
  Clock3,
  Eye,
  FilePenLine,
  FileText,
  Menu,
  MoreHorizontal,
  PencilLine,
  Plus,
  Upload,
  X,
} from "lucide-react";
const books = [
  {
    title: "The Quiet Between Stars",
    genre: "Literary fiction",
    chapters: 12,
    readTime: "1 hr 48 min",
    synopsis:
      "A letter from twenty years ahead sends Mara north toward a past she thought she had left behind.",
    color: "from-[#1a3c35] to-[#31594e]",
    accent: "#d8a651",
    status: "Published",
  },
  {
    title: "A Map of Small Things",
    genre: "Short stories",
    chapters: 8,
    readTime: "54 min",
    synopsis:
      "Eight intimate stories about the ordinary objects that quietly hold a lifetime of memory.",
    color: "from-[#a8583c] to-[#71372a]",
    accent: "#f1d8b5",
    status: "Published",
  },
  {
    title: "Letters from Elsewhere",
    genre: "Magical realism",
    chapters: 5,
    readTime: "42 min",
    synopsis:
      "Letters begin arriving from a town that exists on no map—and each one knows her name.",
    color: "from-[#53657d] to-[#2e394c]",
    accent: "#e4c982",
    status: "Draft",
  },
  {
    title: "The Winter Orchard",
    genre: "Novella",
    chapters: 14,
    readTime: "2 hr 10 min",
    synopsis:
      "An abandoned orchard, a family promise, and one last winter to uncover what was buried.",
    color: "from-[#5f4238] to-[#372823]",
    accent: "#dba66f",
    status: "Published",
  },
];
const page = () => {
  const [newBook, setNewBook] = useState(false);
  return (
    <div className="">
      <div className="flex min-h-screen bg-[#f4f1ea] text-[#263832]">
        <SideBar />
        <div className="min-w-0 flex-1">
          <AdminHeader />
          <main className="mx-auto max-w-295 p-5 md:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold text-[#a45134]">
                  Good morning, Eleanor
                </p>
                <h2 className="mt-2 font-serif text-4xl tracking-[-0.035em] text-[#183a31]">
                  Your writing desk
                </h2>
                <p className="mt-2 text-sm text-[#74807a]">
                  Keep your library fresh and your readers turning pages.
                </p>
              </div>
              <BookCreationForm />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={BookCopy}
                label="Total books"
                value="4"
                note="3 published · 1 draft"
              />
              <StatCard
                icon={FileText}
                label="Pages written"
                value="39"
                note="4 added this month"
              />
              <StatCard
                icon={Eye}
                label="Reads this month"
                value="2.8k"
                note="+12% from last month"
              />
              <StatCard
                icon={Clock3}
                label="Reading time"
                value="6.4h"
                note="Across all published stories"
              />
            </div>
            <div className="mt-7 grid gap-7 xl:grid-cols-[1.55fr_0.8fr]">
              <section className="overflow-hidden rounded-2xl border border-[#18382f]/10 bg-white">
                <div className="flex items-center justify-between border-b border-[#18382f]/10 px-5 py-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#183a31]">
                      Your books
                    </h3>
                    <p className="mt-1 text-[11px] text-[#87908b]">
                      Manage drafts and published stories
                    </p>
                  </div>
                  <button className="text-xs font-semibold text-[#a45134]">
                    View all
                  </button>
                </div>
                <div className="divide-y divide-[#18382f]/8">
                  {books.map((book, index) => (
                    <div
                      key={book.title}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div
                        className={`h-16 w-12 shrink-0 rounded-[2px_5px_5px_2px] bg-linear-to-br ${book.color} shadow-sm`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-[17px] text-[#243b34]">
                          {book.title}
                        </p>
                        <p className="mt-1 text-[11px] text-[#87908b]">
                          {book.chapters} chapters · Edited {index + 1}d ago
                        </p>
                      </div>
                      <span
                        className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold sm:block ${book.status === "Published" ? "bg-[#e5f0e9] text-[#2c6a4a]" : "bg-[#f4ead5] text-[#966226]"}`}
                      >
                        {book.status}
                      </span>
                      <button
                        className="grid size-9 place-items-center rounded-lg border border-[#18382f]/10 text-[#69766f] hover:bg-[#f4f1ea]"
                        aria-label={`Edit ${book.title}`}
                      >
                        {index === 0 ? (
                          <PencilLine size={15} />
                        ) : (
                          <MoreHorizontal size={16} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <div className="space-y-7">
                <section className="rounded-2xl bg-[#183a31] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6aa64]">
                      Featured now
                    </p>
                    <span className="flex items-center gap-1.5 text-[10px] text-white/50">
                      <span className="size-1.5 rounded-full bg-[#7bc99a]" />{" "}
                      Live
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl leading-tight">
                    The Quiet Between Stars
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/50">
                    This is the first story readers see on your homepage.
                  </p>
                  <button className="mt-6 flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-xs font-semibold hover:bg-white/15">
                    Edit featured story <ArrowRight size={15} />
                  </button>
                </section>
                <section className="rounded-2xl border border-[#18382f]/10 bg-white p-5">
                  <h3 className="font-serif text-xl text-[#183a31]">
                    Quick actions
                  </h3>
                  <div className="mt-4 space-y-2">
                    <button className="flex w-full items-center gap-3 rounded-xl bg-[#f6f3ed] p-3 text-left text-xs font-semibold hover:bg-[#eee8dc]">
                      <FilePenLine size={17} className="text-[#a45134]" /> Write
                      a new chapter
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl bg-[#f6f3ed] p-3 text-left text-xs font-semibold hover:bg-[#eee8dc]">
                      <Upload size={17} className="text-[#a45134]" /> Upload
                      cover image
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default page;
