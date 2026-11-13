"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Logo from "@/components/Logo";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  BookCopy,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  FilePenLine,
  FileText,
  Image,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  PencilLine,
  Plus,
  Save,
  Search,
  Settings,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
const Header = ({ auth }: { auth: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = usePathname() ?? "";

  // the header shows ONLY on these pages (and anything inside them)
  const showHeaderOn = ["/", "/library","/about"];

  const show = showHeaderOn.some((p) =>
    p === "/" ? path === "/" : path === p || path.startsWith(p + "/"),
  );

  if (!show) {
    return null;
  }

  return (
    <header className="border-b border-[#18382f]/10 px-5 md:px-10">
      <div className="mx-auto flex h-19 max-w-345 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-9 text-[13px] font-semibold md:flex">
          <Link href="/" className="transition hover:text-[#a45134]">Home</Link>
          <Link href="/library" className="transition hover:text-[#a45134]">Library</Link>
          <Link href="/about" className="transition hover:text-[#a45134]">About</Link>
          
        </nav>
        <div className="flex items-center gap-2">
          <button
            className="hidden size-10 place-items-center rounded-full transition hover:bg-[#18382f]/5 sm:grid"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Login / DashBoard Button  */}

          {auth}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid size-10 place-items-center md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="space-y-1 border-t border-[#18382f]/10 py-3 md:hidden">
          {["Featured story", "Library", "Author login"].map((item) => (
            <button
              key={item}
              className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold hover:bg-white/60"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
