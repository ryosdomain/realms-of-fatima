"use client";
import { Menu, Eye } from "lucide-react";
import SideBar from "@/components/SideBar";
import AdminHeader from "@/components/AdminHeader";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f1ea] text-[#263832]">
      <SideBar />
      <div className="min-w-0 flex-1">
       <AdminHeader />
        {children}
      </div>
    </div>
  );
}