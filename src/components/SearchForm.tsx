import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { SearchParams } from '../types';
import { EXAM_OPTIONS, BOARD_OPTIONS, YEARS_LIST, DEMO_PRESETS } from '../constants/data';

interface SearchFormProps {
  lang: 'bn' | 'en';
  onSearch: (params: SearchParams, cookie?: string) => Promise<void>;
  loading: boolean;
  activeRoll?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  lang,
  onSearch,
  loading,
  activeRoll,
}) => {
  const [params, setParams] = useState<SearchParams>({
    exam: 'ssc',
    year: '2024',
    board: 'dhaka',
    roll: activeRoll || '',
    reg: '',
    result_type: '1',
    captcha: '',
    autoSolve: true,
  });

  const [captchaImg, setCaptchaImg] = useState<string>('');
  const [captchaCookie, setCaptchaCookie] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [autoSolvedBadge, setAutoSolvedBadge] = useState<boolean>(false);

  // Load fresh CAPTCHA on mount
  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    setAutoSolvedBadge(false);
    try {
      const res = await fetch(`/api/captcha?autoSolve=${params.autoSolve}`);
      const data = await res.json();
      if (data.ok) {
        setCaptchaImg(data.image);
        setCaptchaCookie(data.cookie);
        if (data.autoSolved) {
          setParams((prev) => ({ ...prev, captcha: data.autoSolved }));
          setAutoSolvedBadge(true);
        } else {
          setParams((prev) => ({ ...prev, captcha: '' }));
        }
      }
    } catch (err) {
      console.error('Failed to load captcha:', err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: any) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.roll.trim()) {
      alert(lang === 'bn' ? 'দয়া করে রোল নম্বর প্রবেশ করান।' : 'Please enter your Roll Number.');
      return;
    }
    onSearch(params, captchaCookie);
  };

  const handlePresetClick = (preset: (typeof DEMO_PRESETS)[0]) => {
    const updated = {
      ...params,
      exam: preset.exam,
      year: preset.year,
      board: preset.board,
      roll: preset.roll,
      reg: preset.reg,
    };
    setParams(updated);
    onSearch(updated, captchaCookie);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden no-print transition-all">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-5 py-3.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-300" />
          <h2 className="font-semibold text-base sm:text-lg">
            {lang === 'bn' ? 'ফলাফল অনুসন্ধান ফরম' : 'Examination Result Search'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-200">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'bn' ? 'স্বয়ংক্রিয় ভেরিফিকেশন' : 'Auto Verification'}</span>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Preset demo quick buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {lang === 'bn' ? 'তাত্ক্ষণিক টেস্ট করার নমুনা ফলাফল (১-ক্লিক):' : 'Quick Demo Marksheets (1-Click):'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'bn' ? 'যেকোনোটিতে ক্লিক করে দেখুন' : 'Click to preview instant result'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEMO_PRESETS.map((demo) => (
              <button
                key={demo.roll}
                type="button"
                onClick={() => handlePresetClick(demo)}
                className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/60 transition group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                    {lang === 'bn' ? demo.titleBn.split(' (')[0] : demo.titleEn.split(' (')[0]}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {demo.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>রোল: {demo.roll}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Examination */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'পরীক্ষার নাম (Examination)' : 'Examination'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={params.exam}
                onChange={(e) => handleInputChange('exam', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                {EXAM_OPTIONS.map((exam) => (
                  <option key={exam.code} value={exam.code}>
                    {lang === 'bn' ? exam.nameBn : exam.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'পরীক্ষার বছর (Year)' : 'Examination Year'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={params.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                {YEARS_LIST.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Board */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'শিক্ষা বোর্ড (Board)' : 'Education Board'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={params.board}
                onChange={(e) => handleInputChange('board', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                {BOARD_OPTIONS.map((board) => (
                  <option key={board.code} value={board.code}>
                    {lang === 'bn' ? board.nameBn : board.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Result Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'ফলাফলের ধরন (Result Type)' : 'Result Type'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={params.result_type}
                onChange={(e) => handleInputChange('result_type', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                <option value="1">
                  {lang === 'bn' ? 'ব্যক্তিগত / বিস্তারিত রেজাল্ট (Individual)' : 'Individual / Detailed Result'}
                </option>
                <option value="2">
                  {lang === 'bn' ? 'প্রতিষ্ঠানভিত্তিক ফলাফল (Institution Result)' : 'Institution Result'}
                </option>
              </select>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'রোল নম্বর (Roll Number)' : 'Roll Number'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={8}
                  placeholder={lang === 'bn' ? 'যেমন: 100101' : 'e.g. 100101'}
                  value={params.roll}
                  onChange={(e) => handleInputChange('roll', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm font-semibold tracking-wide text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                {params.roll.length >= 6 && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
                )}
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর (Reg No)' : 'Registration No'}
                <span className="text-slate-400 font-normal ml-1">
                  ({lang === 'bn' ? 'মার্কশিটের জন্য' : 'For Marksheet'})
                </span>
              </label>
              <input
                type="text"
                maxLength={10}
                placeholder={lang === 'bn' ? 'যেমন: 1910654321' : 'e.g. 1910654321'}
                value={params.reg}
                onChange={(e) => handleInputChange('reg', e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm tracking-wide text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* CAPTCHA / Security Section */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 mt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-800">
                  {lang === 'bn'
                    ? 'সরকারি রোবট প্রতিরোধ নিরাপত্তা কোড (CAPTCHA Verification)'
                    : 'Robot Prevention Technique (CAPTCHA)'}
                </span>
              </div>

              {/* Auto solve toggle */}
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.autoSolve}
                  onChange={(e) => {
                    handleInputChange('autoSolve', e.target.checked);
                    if (e.target.checked && !params.captcha) {
                      loadCaptcha();
                    }
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {lang === 'bn' ? 'স্বয়ংক্রিয় এআই সমাধান (AI Auto-Solver)' : 'AI Auto-Solve Active'}
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Captcha Image display from live gov server */}
              <div className="relative bg-white border border-slate-300 rounded-lg p-1.5 shadow-sm min-w-[130px] h-[46px] flex items-center justify-center">
                {captchaLoading ? (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</span>
                  </div>
                ) : captchaImg ? (
                  <img
                    src={captchaImg}
                    alt="EBR Captcha"
                    className="h-full object-contain select-none"
                  />
                ) : (
                  <span className="text-xs text-slate-400">CAPTCHA</span>
                )}
              </div>

              {/* Refresh Captcha Button */}
              <button
                type="button"
                onClick={loadCaptcha}
                disabled={captchaLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer"
                title={lang === 'bn' ? 'নতুন কোড আনুন' : 'Reload CAPTCHA'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${captchaLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{lang === 'bn' ? 'রিলোড' : 'Reload'}</span>
              </button>

              {/* Captcha Input */}
              <div className="relative flex-1 min-w-[140px] max-w-[200px]">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={lang === 'bn' ? 'ছবির ৪ সংখ্যা' : '4 digits'}
                  value={params.captcha}
                  onChange={(e) => handleInputChange('captcha', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {autoSolvedBadge && params.captcha && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'bn' ? 'এআই দ্বারা সমাধানকৃত' : 'Auto-Solved by AI'}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>
                    {lang === 'bn'
                      ? 'ফলাফল লোড হচ্ছে...'
                      : 'Fetching Official Result...'}
                  </span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>
                    {lang === 'bn' ? 'ফলাফল প্রদর্শন করুন' : 'View Result'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setParams({
                  ...params,
                  roll: '',
                  reg: '',
                });
                loadCaptcha();
              }}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition cursor-pointer text-sm"
            >
              {lang === 'bn' ? 'রিসেট' : 'Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
