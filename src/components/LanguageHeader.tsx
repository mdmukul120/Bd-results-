import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageHeaderProps {
  lang: 'bn' | 'en';
  setLang: (l: 'bn' | 'en') => void;
}

export const LanguageHeader: React.FC<LanguageHeaderProps> = ({ lang, setLang }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-4 sm:pt-6 flex justify-end items-center no-print">
      <div className="inline-flex items-center p-1 rounded-full bg-white/90 border border-emerald-200/80 shadow-sm backdrop-blur-md">
        <button
          onClick={() => setLang('bn')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            lang === 'bn'
              ? 'bg-[#006a4e] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#f42a41]"></span>
          <span>বাংলা</span>
        </button>
        <button
          onClick={() => setLang('en')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            lang === 'en'
              ? 'bg-[#006a4e] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>English</span>
        </button>
      </div>
    </div>
  );
};
