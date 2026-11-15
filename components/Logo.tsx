import React from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";
const Logo = ({ light = false }: { light?: boolean }) => {
  return (
    
    <Link href={"/"}
      className={`group flex items-center gap-3 ${light ? "text-[#f7f2e8]" : "text-[#18382f]"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Tale & Ink home"
    >
      <span
        className={`grid size-9 place-items-center rounded-full border ${light ? "border-white/25 bg-white/10" : "border-[#18382f]/15 bg-[#efe8d9]"}`}
      >
        <BookOpen size={17} strokeWidth={1.8} />
      </span>
      <span className="uppercase font-serif text-[16px] tracking-[0.02em]">
        Realms of Fatima
      </span>
    </Link>
  );
};

export default Logo;
