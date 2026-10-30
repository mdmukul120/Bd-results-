import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

export const MukulBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-200 shadow-sm backdrop-blur-sm group hover:border-emerald-400 transition-all">
      {/* Bangladesh Flag Dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f42a41]"></span>
      </span>

      <Code2 className="w-4 h-4 text-[#006a4e] group-hover:scale-110 transition-transform" />

      <span className="text-xs font-extrabold tracking-wide text-slate-800">
        <span className="text-[#006a4e]">Mukul</span>{' '}
        <span className="text-[#f42a41]">Developer</span>
      </span>

      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-md border border-emerald-300/60">
        PRO
      </span>
    </div>
  );
};
