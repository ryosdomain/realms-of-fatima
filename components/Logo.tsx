import React from "react";
import { BookOpen } from "lucide-react";
const Logo = ({ light = false }: { light?: boolean }) => {
  return (
    <button
      className={`group flex items-center gap-3 ${light ? "text-[#f7f2e8]" : "text-[#18382f]"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Tale & Ink home"
    >
      <span
        className={`grid size-9 place-items-center rounded-full border ${light ? "border-white/25 bg-white/10" : "border-[#18382f]/15 bg-[#efe8d9]"}`}
      >
        <BookOpen size={17} strokeWidth={1.8} />
      </span>
      <span className="font-serif text-[21px] tracking-[-0.02em]">
        Tale & Ink
      </span>
    </button>
  );
};

export default Logo;
