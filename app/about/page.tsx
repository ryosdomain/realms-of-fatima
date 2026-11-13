import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight, BookOpen, Feather, Search } from "lucide-react";
import { getLibrary } from "@/lib/reader";

export const metadata = { title: "About" };

// ✏️ EDIT THESE: this is the text on the page
const about = {
  name: "Author name",
  tagline: "Stories to get lost in, one chapter at a time.",
  intro:
    "A few lines about what you write and why. This is the first thing visitors read, so keep it warm and short.",
  bio: [
    "Write about yourself here: where you write from, what pulls you to these stories, what you hope readers feel.",
    "A second paragraph if you want one. Mention what's next, or how often new chapters appear.",
  ],
  email: "", // add an address to show a contact button, leave empty to hide it
};

async function Stats() {
  await connection();
  const library = await getLibrary();
  const chapters = library.reduce((n, b) => n + b.chapters.length, 0);
  const minutes = library.reduce((n, b) => n + b.chapters.reduce((m, c) => m + c.minutes, 0), 0);
  const reading = minutes < 60 ? `${minutes} min` : `${Math.round(minutes / 60)} hr`;

  const stats = [
    [String(library.length), library.length === 1 ? "Story" : "Stories"],
    [String(chapters), chapters === 1 ? "Chapter" : "Chapters"],
    [reading, "Of reading"],
  ];

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
      {stats.map(([value, label]) => (
        <div key={label}>
          <p className="font-serif text-4xl tracking-[-0.03em] md:text-6xl">{value}</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d2a55f]">{label}</p>
        </div>
      ))}
    </div>
  );
}

const features = [
  {
    icon: BookOpen,
    title: "Read page by page",
    text: "Every chapter is split into pages, so a sitting never feels like a wall of text.",
  },
  {
    icon: Search,
    title: "Find your next story",
    text: "Search the library, filter by genre, or pick something that fits the time you have.",
  },
  {
    icon: Feather,
    title: "Written chapter by chapter",
    text: "New chapters appear as they're finished, so published stories keep growing.",
  },
];

export default function AboutPage() {
  const initials = about.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main>
      {/* intro */}
      <section className="px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-310">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a45134]">About</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] tracking-[-0.035em] text-[#183a31] md:text-7xl">
            {about.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#66736d]">{about.intro}</p>
        </div>
      </section>

      {/* the writer */}
      <section className="px-5 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto grid max-w-310 items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div className="mx-auto w-full max-w-xs">
            <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[6px_28px_28px_6px] bg-linear-to-br from-[#1a3c35] to-[#31594e] shadow-[0_30px_70px_-25px_rgba(24,58,49,0.6)]">
              <div className="absolute -right-12 -top-12 size-52 rounded-full bg-white/10" />
              <div className="absolute inset-y-0 left-0 w-[7%] bg-linear-to-r from-black/35 to-transparent" />
              <span className="relative font-serif text-7xl text-[#d2a55f]">{initials}</span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a45134]">The writer</p>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#183a31] md:text-5xl">{about.name}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#4f5f58]">
              {about.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {about.email && (
              <a
                href={`mailto:${about.email}`}
                className="mt-8 inline-block rounded-full border border-[#18382f]/20 px-7 py-3.5 text-sm font-semibold transition hover:bg-[#183a31] hover:text-white"
              >
                Get in touch
              </a>
            )}
          </div>
        </div>
      </section>

      {/* numbers from the real library */}
      <section className="relative overflow-hidden bg-[#17352d] px-5 py-16 text-[#f7f2e8] md:px-10 md:py-24">
        <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative">
          <Suspense fallback={<div className="h-24" />}>
            <Stats />
          </Suspense>
        </div>
      </section>

      {/* what you'll find */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-310">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#a45134]">
            What you'll find here
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-[#18382f]/12 bg-white p-7">
                <span className="grid size-11 place-items-center rounded-full bg-[#a45134]/10 text-[#a45134]">
                  <Icon size={19} />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-[#183a31]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#66736d]">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-full bg-[#183a31] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#214a3f]"
            >
              Start with the library <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}