import React, { useState, useEffect } from 'react';
import { MukulBadge } from './MukulBadge';
import { SearchParams } from '../types';
import { EXAM_OPTIONS, BOARD_OPTIONS, YEARS_LIST } from '../constants/data';
import { RefreshCw, Sparkles, CheckCircle2, ChevronDown, ArrowRight, Zap } from 'lucide-react';
import { generateCaptchaSvg } from '../utils/captcha';

interface FormViewProps {
  lang: 'bn' | 'en';
  onSubmit: (params: SearchParams, cookie?: string) => Promise<void>;
  loading: boolean;
}

export const FormView: React.FC<FormViewProps> = ({ lang, onSubmit, loading }) => {
  const [params, setParams] = useState<SearchParams>({
    exam: 'ssc',
    year: '2024',
    board: 'dhaka',
    roll: '',
    reg: '',
    result_type: '1',
    captcha: '',
    autoSolve: true,
  });

  const [captchaImg, setCaptchaImg] = useState<string>('');
  const [captchaCookie, setCaptchaCookie] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [autoSolved, setAutoSolved] = useState<boolean>(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const useLocalCaptcha = () => {
    const { code, image } = generateCaptchaSvg();
    setCaptchaImg(image);
    setCaptchaCookie('local_session_' + Date.now());
    setParams((prev) => ({ ...prev, captcha: code }));
    setAutoSolved(true);
  };

  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    setAutoSolved(false);
    try {
      const res = await fetch(`/api/captcha?autoSolve=${params.autoSolve}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        useLocalCaptcha();
        return;
      }
      const data = await res.json();
      if (data.ok && data.image) {
        setCaptchaImg(data.image);
        setCaptchaCookie(data.cookie || '');
        if (data.autoSolved) {
          setParams((prev) => ({ ...prev, captcha: data.autoSolved }));
          setAutoSolved(true);
        } else {
          setParams((prev) => ({ ...prev, captcha: '' }));
        }
      } else {
        useLocalCaptcha();
      }
    } catch {
      useLocalCaptcha();
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleQuickDemo = (demoRoll: string, demoReg: string, demoBoard: string) => {
    setParams((prev) => ({
      ...prev,
      roll: demoRoll,
      reg: demoReg,
      board: demoBoard,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.roll.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে রোল নম্বর প্রদান করুন।' : 'Please enter your Roll Number.');
      return;
    }
    onSubmit(params, captchaCookie);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto px-4 py-6">
      {/* Container Frame styled like Image 1 reference */}
      <div className="bg-[#eef8f2] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-2xl border-4 border-[#006a4e]/10 relative overflow-hidden">
        
        {/* Soft background accents (BD Red & Green glows) */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#006a4e]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#f42a41]/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Character pointing right */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center order-2 lg:order-1">
            <div className="relative max-w-[280px] sm:max-w-[340px] lg:max-w-full">
              {/* Character PNG pointing right towards form */}
              <img
                src="/assets/aistudio/student_pointing_right_710ff94d.png"
                alt="Student pointing at form"
                className="w-full h-auto object-contain max-h-[460px] drop-shadow-2xl animate-in fade-in slide-in-from-left-6 duration-700"
              />
              {/* Soft pedestal shadow under feet */}
              <div className="w-44 h-4 bg-emerald-950/15 rounded-[100%] mx-auto blur-[2px] -mt-2"></div>
            </div>

            {/* Quick demo pills */}
            <div className="mt-5 w-full max-w-sm">
              <span className="text-[11px] font-bold text-[#006a4e] uppercase tracking-wider block mb-2">
                {lang === 'bn' ? '⚡ টেস্ট করতে রোল বাছাই করুন:' : '⚡ Quick Test Roll:'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('100101', '1910654321', 'dhaka')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/90 hover:bg-[#006a4e] text-slate-800 hover:text-white border border-emerald-200 transition shadow-xs cursor-pointer"
                >
                  ঢাকা (বিজ্ঞান)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('200202', '1910778899', 'rajshahi')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/90 hover:bg-[#006a4e] text-slate-800 hover:text-white border border-emerald-200 transition shadow-xs cursor-pointer"
                >
                  রাজশাহী (মানবিক)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('400404', '1910114477', 'madrasah')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/90 hover:bg-[#006a4e] text-slate-800 hover:text-white border border-emerald-200 transition shadow-xs cursor-pointer"
                >
                  দাখিল (মাদ্রাসা)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Mukul Developer Badge + Form Card */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start order-1 lg:order-2">
            
            {/* Mukul Developer Insignia on Top of Form */}
            <div className="mb-3 w-full flex justify-center lg:justify-start">
              <MukulBadge />
            </div>

            {/* Pristine Form Card */}
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-emerald-100/80 transition-all">
              
              <div className="mb-6 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-[#006a4e] tracking-tight">
                  {lang === 'bn' ? 'ফলাফল দেখুন' : 'View Examination Result'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {lang === 'bn'
                    ? 'তথ্য নির্বাচন করে ফলাফল দেখুন বাটনে ক্লিক করুন'
                    : 'Select examination details and click View Result'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Examination Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'পরীক্ষা (Examination)' : 'Examination'}
                  </label>
                  <div className="relative">
                    <select
                      value={params.exam}
                      onChange={(e) => setParams({ ...params, exam: e.target.value })}
                      className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:bg-white transition cursor-pointer pr-10"
                    >
                      {EXAM_OPTIONS.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {lang === 'bn' ? opt.nameBn : opt.nameEn}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Grid: Year & Board */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'bn' ? 'পাশের বছর (Year)' : 'Passing Year'}
                    </label>
                    <div className="relative">
                      <select
                        value={params.year}
                        onChange={(e) => setParams({ ...params, year: e.target.value })}
                        className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:bg-white transition cursor-pointer pr-10"
                      >
                        {YEARS_LIST.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Board */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'bn' ? 'শিক্ষা বোর্ড (Board)' : 'Board'}
                    </label>
                    <div className="relative">
                      <select
                        value={params.board}
                        onChange={(e) => setParams({ ...params, board: e.target.value })}
                        className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:bg-white transition cursor-pointer pr-10"
                      >
                        {BOARD_OPTIONS.map((b) => (
                          <option key={b.code} value={b.code}>
                            {lang === 'bn' ? b.nameBn : b.nameEn}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'রোল নম্বর (Roll Number)' : 'Roll Number'}
                    <span className="text-[#f42a41] ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder={lang === 'bn' ? 'যেমন: 123456' : 'e.g. 123456'}
                    value={params.roll}
                    onChange={(e) => setParams({ ...params, roll: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-[#006a4e] transition"
                    required
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর (Reg No)' : 'Registration Number'}
                    <span className="text-slate-400 font-normal ml-1">
                      ({lang === 'bn' ? 'মার্কশিটের জন্য' : 'Optional'})
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder={lang === 'bn' ? 'যেমন: 1234567890' : 'e.g. 1234567890'}
                    value={params.reg}
                    onChange={(e) => setParams({ ...params, reg: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-[#006a4e] transition"
                  />
                </div>

                {/* Security CAPTCHA Box */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {lang === 'bn' ? 'রোবট প্রতিরোধ কোড' : 'Security Code'}
                    </span>
                    {autoSolved && (
                      <span className="text-[11px] font-bold text-[#006a4e] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {lang === 'bn' ? 'এআই সমাধানকৃত' : 'AI Solved'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Captcha Image */}
                    <div className="h-10 w-28 bg-white border border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                      {captchaLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#006a4e]" />
                      ) : captchaImg ? (
                        <img src={captchaImg} alt="Captcha" className="h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">1234</span>
                      )}
                    </div>

                    {/* Reload Button */}
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      disabled={captchaLoading}
                      className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer"
                      title="নতুন কোড"
                    >
                      <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Input */}
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="৪ সংখ্যা"
                      value={params.captcha}
                      onChange={(e) => setParams({ ...params, captcha: e.target.value.replace(/\D/g, '') })}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-center tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#006a4e] hover:bg-[#00523c] active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{lang === 'bn' ? 'লোড হচ্ছে...' : 'Fetching Result...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === 'bn' ? 'ফলাফল দেখুন' : 'View Result'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
