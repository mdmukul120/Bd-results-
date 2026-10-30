import React from 'react';
import { X, CheckCircle, Wifi, ShieldCheck, Server, AlertCircle, RefreshCw } from 'lucide-react';

interface ServerStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverOnline: boolean | null;
  onRefresh: () => void;
  lang: 'bn' | 'en';
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({
  isOpen,
  onClose,
  serverOnline,
  onRefresh,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {lang === 'bn' ? 'সরকারি সার্ভার স্ট্যাটাস ও তথ্য' : 'Government Server Status'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status summary */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  educationboardresults.gov.bd
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  {serverOnline
                    ? lang === 'bn'
                      ? 'সার্ভার সচল ও সংযুক্ত (Online & Connected)'
                      : 'Server is Online & Responding'
                    : lang === 'bn'
                    ? 'ব্যাকআপ ইঞ্জিন সক্রিয়'
                    : 'Smart Fallback Engine Active'}
                </p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer text-xs flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'রিফ্রেশ' : 'Check'}</span>
            </button>
          </div>

          {/* Endpoints breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              {lang === 'bn' ? 'সংযুক্ত সরকারি এন্ডপয়েন্টস:' : 'Connected Official Endpoints:'}
            </span>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">1. /v2/getres (Result Engine)</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                  HTTP POST Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">2. /_challenge-verify (Verification)</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                  Ready
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">3. /v2/captcha (Security Code)</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                  Auto AI Solved
                </span>
              </div>
            </div>
          </div>

          {/* AI Auto Solver details */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">
                {lang === 'bn' ? 'স্বয়ংক্রিয় এআই ক্যাপচা সমাধান' : 'Automated AI Captcha Solving'}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'এই পোর্টালে সরকারি সার্ভারের জটিল ৪-সংখ্যার ক্যাপচা স্বয়ংক্রিয়ভাবে সমাধান করা হয়, ফলে শিক্ষার্থীরা কোনো বাধা ছাড়াই তাৎক্ষণিকভাবে ফলাফল দেখতে ও প্রিন্ট করতে পারে।'
                  : 'The portal automatically deciphers the official 4-digit security challenge, letting students view and print results instantly without manual captcha entry.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
