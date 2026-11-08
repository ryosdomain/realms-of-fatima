import React from 'react'
import {
  ArrowRight,
  BookCopy,
  ChevronDown,
  Clock3,
  Eye,
  FilePenLine,
  FileText,
  Menu,
  
} from "lucide-react";
import Link from 'next/link';

const AdminHeader = () => {
  return (
    <div><header className="flex h-18 items-center justify-between border-b border-[#18382f]/10 bg-[#faf8f3] px-5 md:px-8">
            <div className="flex items-center gap-3">
              <button className="grid size-10 place-items-center rounded-xl border border-[#18382f]/10 lg:hidden">
                <Menu size={19} />
              </button>
              <div>
                <h1 className="font-serif text-xl text-[#183a31]">
                  Author studio
                </h1>
                <p className="hidden text-[11px] text-[#87908b] sm:block">
                  Tuesday, 17 June
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
                
              <Link href={'/'} className="hidden items-center gap-2 rounded-xl border border-[#18382f]/12 px-4 py-2.5 text-xs font-semibold sm:flex">
                <Eye size={15} /> Preview site
              </Link>
              <div className="grid size-9 place-items-center rounded-full bg-[#a45134] font-serif text-sm text-white">
                ER
              </div>
            </div>
          </header></div>
  )
}

export default AdminHeader