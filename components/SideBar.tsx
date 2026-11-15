"use client"
import { logout } from "../app/admin/actions";
import Logo from "@/components/Logo";
import { BookCopy, Eye, FileText, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";

const items = [
  ["Overview", LayoutDashboard, "/admin"],
  ["Books", BookCopy, "/admin/studio/books"],
  ["Chapters", FileText, "/admin/studio/chapters"],
] as const;

const bottomLink =
  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white/55 transition hover:bg-white/7 hover:text-white";

// used by the desktop sidebar AND the mobile drawer
export function SidebarBody() {
  return (
    <>
      <div className="px-3">
        <Logo light />
      </div>
      <nav className="mt-10 space-y-1">
        {items.map(([label, Icon, href]) => (
          <Link
            key={label}
            href={href}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/7 hover:text-white"
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <Link href="/admin/studio/settings" className={bottomLink}>
          <Settings size={18} /> Settings
        </Link>
        <Link href="/" target="_blank" className={bottomLink}>
          <Eye size={18} /> View website
        </Link>
        <form action={logout}>
          <button type="submit" className={bottomLink}>
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </>
  );
}

const SideBar = () => (
  <aside className="hidden w-63 shrink-0 flex-col bg-[#17382f] px-4 py-6 text-white lg:flex">
    <SidebarBody />
  </aside>
);

export default SideBar;