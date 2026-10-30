import React, { useState } from 'react';
import { X, Search, Trash2, Award, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { StudentResult } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: StudentResult[];
  onSelect: (result: StudentResult) => void;
  onClear: () => void;
  onDeleteOne: (roll: string) => void;
  lang: 'bn' | 'en';
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  onDeleteOne,
  lang,
}) => {
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter((item) => {
    const q = filterText.toLowerCase();
    return (
      item.roll.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.board_name.toLowerCase().includes(q) ||
      (item.regno && item.regno.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">
              {lang === 'bn' ? 'পূর্বে অনুসন্ধানকৃত রেজাল্ট তালিকা' : 'Saved Results History'}
            </h3>
            <span className="text-xs bg-emerald-700/60 text-emerald-100 px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside history */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={
                lang === 'bn'
                  ? 'রোল নম্বর, শিক্ষার্থীর নাম বা বোর্ড দিয়ে খুঁজুন...'
                  : 'Filter by roll, name, or board...'
              }
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-2 rounded-lg border border-red-200 transition cursor-pointer"
              title={lang === 'bn' ? 'সব মুছুন' : 'Clear all'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}</span>
            </button>
          )}
        </div>

        {/* Items list */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-600" />
              <p className="text-sm font-medium">
                {lang === 'bn'
                  ? 'এখনও কোনো রেজাল্ট অনুসন্ধান করা হয়নি।'
                  : 'No results searched yet.'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn'
                  ? 'ফরম পূরণ করে সার্চ করলে ফলাফল এখানে সংরক্ষিত হবে।'
                  : 'Search using the form to save results automatically.'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি।' : 'No matching results found.'}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.roll + item.board_name}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between gap-3 group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800 text-sm">
                      {item.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      GPA {item.gpa}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>
                      {lang === 'bn' ? 'রোল:' : 'Roll:'} <b>{item.roll}</b>
                    </span>
                    <span>
                      {lang === 'bn' ? 'বোর্ড:' : 'Board:'} {item.board_name}
                    </span>
                    <span>
                      {item.exam || 'SSC'} {item.year || '2024'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                    title={lang === 'bn' ? 'দেখুন' : 'View'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteOne(item.roll)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title={lang === 'bn' ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
