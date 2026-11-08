import React from "react";
import { logout } from "../app/admin/actions";
import Logo from "@/components/Logo"
import {
  BookCopy,
  Eye,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";
const SideBar = () => {
  const items = [
    ["Overview", LayoutDashboard],
    ["Books", BookCopy],
    ["Pages & chapters", FileText],
    ["Media library", Image],
  ] as const;
  return (
    <aside className="hidden w-63 shrink-0 flex-col bg-[#17382f] px-4 py-6 text-white lg:flex">
      <div className="px-3">
        <Logo light />
      </div>
      <nav className="mt-10 space-y-1">
        {items.map(([label, Icon]) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/7 hover:text-white`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/55 hover:bg-white/7 hover:text-white">
          <Settings size={18} /> Settings
        </button>
        <button
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/55 hover:bg-white/7 hover:text-white"
        >
          <Eye size={18} /> View website
        </button>
         <form action={logout}>
        <button
          type="submit"
         className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/55 hover:bg-white/7 hover:text-white"
        >
           <LogOut size={18} /> Sign out
        </button>
      </form>
       
      </div>
    </aside>
  );
};

export default SideBar;
