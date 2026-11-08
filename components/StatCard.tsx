import React from "react";
import {
  
  BookOpen,
  
} from "lucide-react";
const StatCard = ({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  note: string;
}) => {
  return (
    <div>
      <div className="rounded-2xl border border-[#18382f]/10 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-[#73807a]">{label}</p>
            <p className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#183a31]">
              {value}
            </p>
          </div>
          <span className="grid size-10 place-items-center rounded-xl bg-[#f0eadf] text-[#a45134]">
            <Icon size={19} />
          </span>
        </div>
        <p className="mt-4 text-[11px] text-[#8a918d]">{note}</p>
      </div>
    </div>
  );
};

export default StatCard;
