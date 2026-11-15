import { connection } from "next/server";
import { BookCopy, Database, FileText, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// ✏️ your plan's database size in MB (Supabase free plan = 500, check yours under Settings → Usage)
const DB_LIMIT_MB = 500;

const tones = {
  green: { soft: "bg-[#e5f0e9]", text: "text-[#2c6a4a]", bar: "bg-[#2c6a4a]" },
  terracotta: { soft: "bg-[#fbe9e1]", text: "text-[#a45134]", bar: "bg-[#a45134]" },
  amber: { soft: "bg-[#f7ecd4]", text: "text-[#966226]", bar: "bg-[#c98a2b]" },
  red: { soft: "bg-[#fbe4e1]", text: "text-[#b3261e]", bar: "bg-[#b3261e]" },
} as const;
type Tone = keyof typeof tones;

function Card({
  icon: Icon,
  label,
  value,
  unit,
  note,
  percent,
  barNote,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  note: string;
  percent: number;
  barNote: string;
  tone: Tone;
}) {
  const t = tones[tone];
  const width = percent > 0 ? Math.min(100, Math.max(percent, 3)) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#18382f]/12 bg-white p-5 shadow-sm">
      <div className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-70 ${t.soft}`} />

      <div className="relative flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d8782]">{label}</p>
        <span className={`grid size-10 place-items-center rounded-xl ${t.soft} ${t.text}`}>
          <Icon size={19} />
        </span>
      </div>

      <p className="relative mt-4 flex items-baseline gap-1.5 font-serif tracking-[-0.03em] text-[#183a31]">
        <span className="text-5xl leading-none">{value}</span>
        {unit && <span className="text-lg text-[#78817b]">{unit}</span>}
      </p>
      <p className="relative mt-2 text-xs text-[#78817b]">{note}</p>

      <div className="relative mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-[#18382f]/8">
          <div className={`h-full rounded-full transition-all duration-700 ${t.bar}`} style={{ width: `${width}%` }} />
        </div>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#87908b]">{barNote}</p>
      </div>
    </div>
  );
}

const size = (mb: number) =>
  mb >= 1024
    ? { v: (mb / 1024).toFixed(1), u: "GB" }
    : { v: mb >= 10 ? String(Math.round(mb)) : mb.toFixed(1), u: "MB" };

export async function StatsCards() {
  await connection();
  const supabase = await createClient();

  const count = (table: "books" | "chapters", published?: boolean) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (published) q = q.eq("status", "published");
    return q;
  };

  const [books, booksPub, chapters, chaptersPub, usage] = await Promise.all([
    count("books"),
    count("books", true),
    count("chapters"),
    count("chapters", true),
    supabase.rpc("db_usage"),
  ]);

  const nBooks = books.count ?? 0;
  const pBooks = booksPub.count ?? 0;
  const nChapters = chapters.count ?? 0;
  const pChapters = chaptersPub.count ?? 0;

  // database space
  const usedBytes = Number(usage.data);
  const ready = !usage.error && Number.isFinite(usedBytes);
  const usedMb = ready ? usedBytes / 1024 / 1024 : 0;
  const leftMb = Math.max(0, DB_LIMIT_MB - usedMb);
  const usedPct = (usedMb / DB_LIMIT_MB) * 100;
  const left = size(leftMb);
  const storageTone: Tone = usedPct < 70 ? "green" : usedPct < 90 ? "amber" : "red";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card
        icon={BookCopy}
        label="Total books"
        value={String(nBooks)}
        note={`${pBooks} published · ${nBooks - pBooks} ${nBooks - pBooks === 1 ? "draft" : "drafts"}`}
        percent={nBooks ? (pBooks / nBooks) * 100 : 0}
        barNote={`${nBooks ? Math.round((pBooks / nBooks) * 100) : 0}% published`}
        tone="green"
      />
      <Card
        icon={FileText}
        label="Total chapters"
        value={String(nChapters)}
        note={`${pChapters} published · ${nChapters - pChapters} ${nChapters - pChapters === 1 ? "draft" : "drafts"}`}
        percent={nChapters ? (pChapters / nChapters) * 100 : 0}
        barNote={`${nChapters ? Math.round((pChapters / nChapters) * 100) : 0}% published`}
        tone="terracotta"
      />
      {ready ? (
        <Card
          icon={Database}
          label="Space left"
          value={left.v}
          unit={left.u}
          note={`${size(usedMb).v} ${size(usedMb).u} of ${size(DB_LIMIT_MB).v} ${size(DB_LIMIT_MB).u} used`}
          percent={usedPct}
          barNote={`${Math.round(usedPct)}% of your database is used`}
          tone={storageTone}
        />
      ) : (
        <Card
          icon={Database}
          label="Space left"
          value="—"
          note="Run the db_usage SQL to turn this on"
          percent={0}
          barNote="Not set up yet"
          tone="amber"
        />
      )}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl border border-[#18382f]/10 bg-white" />
      ))}
    </div>
  );
}