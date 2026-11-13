import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";


import ModernBookCard from "@/components/MordernBookCard";
import { ArrowRight, ChevronRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import HomeReader from "@/components/HomeReader";
import LibrarySection from "@/components/LibrarySection";

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
const Loading = ({ tall }: { tall?: boolean }) => (
  <div className={`grid place-items-center text-sm text-[#87908b] ${tall ? "min-h-[70vh]" : "min-h-40"}`}>
    Loading…
  </div>
);
const home = ({ searchParams }: { searchParams: Promise<{ book?: string; chapter?: string }> }) => {
  
  return (
    

      <div>
        <main>
          
           <Suspense
          fallback={<div className="grid  min-h-[70vh] place-items-center text-sm text-[#87908b]">Loading…</div>}
        >
          <HomeReader searchParams={searchParams} />
        </Suspense>

          <Suspense fallback={<Loading />}>
          <LibrarySection />
        </Suspense>
        </main>
      </div>
    
  );
};

export default home;
