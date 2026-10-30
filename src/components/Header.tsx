import React from 'react';
import { Globe, History, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  lang: 'bn' | 'en';
  setLang: (l: 'bn' | 'en') => void;
  serverOnline: boolean | null;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenServerStatus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  serverOnline,
  historyCount,
  onOpenHistory,
  onOpenServerStatus,
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg border-b border-emerald-800/40 no-print">
      {/* Top emergency / notice line */}
      <div className="bg-emerald-950/70 border-b border-emerald-800/30 text-xs py-1 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {lang === 'bn'
                ? 'শিক্ষা মন্ত্রণালয় • মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড বাংলাদেশ'
                : 'Ministry of Education • Intermediate and Secondary Education Boards Bangladesh'}
            </span>
          </div>
          <button
            onClick={onOpenServerStatus}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {serverOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">educationboardresults.gov.bd</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                  {lang === 'bn' ? 'সার্ভার সচল' : 'Live'}
                </span>
              </>
            ) : serverOnline === false ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-[10px]">
                  {lang === 'bn' ? 'বিকল্প ব্যাকআপ সক্রিয়' : 'Backup Engine'}
                </span>
              </>
            ) : (
              <span className="text-[10px] text-slate-400">Connecting...</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Branding */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          {/* Bangladesh Gov Seal SVG */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 p-1 flex items-center justify-center shadow-md ring-2 ring-emerald-500/50 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="BD Gov Emblem">
              <circle cx="50" cy="50" r="48" fill="#006a4e" />
              <circle cx="50" cy="50" r="42" fill="#f42a41" />
              <circle cx="50" cy="50" r="32" fill="#ffffff" />
              {/* Shapla (Water Lily) stylization */}
              <path
                d="M50 25 C45 35, 42 45, 50 68 C58 45, 55 35, 50 25 Z"
                fill="#006a4e"
              />
              <path
                d="M50 68 C35 55, 30 40, 36 32 C38 45, 45 60, 50 68 Z"
                fill="#006a4e"
              />
              <path
                d="M50 68 C65 55, 70 40, 64 32 C62 45, 55 60, 50 68 Z"
                fill="#006a4e"
              />
              <circle cx="50" cy="72" r="3" fill="#ffcc00" />
              {/* Stars */}
              <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#ffcc00" />
            </svg>
          </div>

          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2 justify-center md:justify-start">
              <span>
                {lang === 'bn'
                  ? 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড'
                  : 'Intermediate & Secondary Education Boards'}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-md">
                অফিসিয়াল
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
              {lang === 'bn'
                ? 'স্বয়ংক্রিয় রেজাল্ট অনুসন্ধান ও অফিসিয়াল মার্কশিট প্রিন্ট পোর্টাল'
                : 'Web Based Result Publication & Marksheet Verification System'}
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-emerald-100 rounded-lg border border-slate-700 transition shadow-sm cursor-pointer"
            title="পূর্বে দেখা ফলাফল"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'পূর্বের ফলাফল' : 'Saved Results'}</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px]">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-800/60 hover:bg-emerald-700/60 text-white rounded-lg border border-emerald-600/40 transition shadow-sm cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
