import { logout } from "./actions";
import { Suspense } from "react";
import SideBar from "@/components/SideBar";
import { StatsCards, StatsSkeleton } from "@/components/StatsCards";
import BookCreationForm from "@/components/BookCreationForm";
import AdminHeader from "@/components/AdminHeader";
import {
  ArrowRight,
  FilePenLine,
  MoreHorizontal,
  PencilLine,
  Upload,
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
  return (
    <div className="">
      <div className="flex min-h-screen bg-[#f4f1ea] text-[#263832]">
        <SideBar />
        <div className="min-w-0 flex-1">
          <AdminHeader />
          <main className="mx-auto max-w-295 p-5 md:p-8">
            <div className="flex mb-4 flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold text-[#a45134]">
                  Good morning, Aurthor
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

            <Suspense fallback={<StatsSkeleton />}>
              <StatsCards />
            </Suspense>

            
          </main>
        </div>
      </div>
    </div>
  );
};

export default page;
