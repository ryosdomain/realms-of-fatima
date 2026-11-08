"use client"
import React from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const Footer = () => {
     const path = usePathname();
      const hideFooterOnPaths = ["/login", "/admin", "/admin/editor"];
      if (hideFooterOnPaths.includes(path)) {
        return null; // Renders nothing on those pages
      }
  return (
    <footer className="border-t border-[#18382f]/10 px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-310 flex-col items-center justify-between gap-5 sm:flex-row">
        <Logo />
        <p className="text-xs text-[#77807a]">
          Independent stories, thoughtfully told.
        </p>
        <p className="text-xs text-[#77807a]">© 2025 Tale & Ink</p>
      </div>
    </footer>
  );
};

export default Footer;
