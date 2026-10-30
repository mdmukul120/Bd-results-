import React from 'react';
import { MukulBadge } from './MukulBadge';
import { StudentResult } from '../types';
import { GRADING_SCALE } from '../constants/data';
import { Printer, ArrowLeft, Award, CheckCircle2, QrCode, Share2, Copy, Check } from 'lucide-react';

interface ResultPageViewProps {
  result: StudentResult;
  lang: 'bn' | 'en';
  onBack: () => void;
}

export const ResultPageView: React.FC<ResultPageViewProps> = ({ result, lang, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
--------------------------------------
বাংলাদেশ শিক্ষা বোর্ড রেজাল্ট (মুকুল ডেভেলপার)
--------------------------------------
শিক্ষার্থীর নাম: ${result.name}
রোল: ${result.roll} | রেজি: ${result.regno || 'N/A'}
বোর্ড: ${result.board_name} | পরীক্ষা: ${result.exam || 'SSC'} ${result.year || '2024'}
ফলাফল: ${result.res_detail || 'PASSED'} (জিপিএ: ${result.gpa})
--------------------------------------
বিষয়ভিত্তিক গ্রেড ও নম্বর:
${result.sub_details?.map((s) => `• ${s.name} (${s.code}): ${s.grade} [মোট: ${s.total || '-'}]`).join('\n') || ''}
--------------------------------------
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPassed = result.res_detail?.toLowerCase().includes('pass') || result.status === 0;
  const isGolden = result.gpa === '5.00';

  return (
    <div className="w-full max-w-6xl mx-auto my-auto px-4 py-4 sm:py-6">
      
      {/* Top Action Navigation Bar (Hidden during Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#006a4e] text-slate-700 hover:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ফিরে যান' : 'Back to Search'}</span>
          </button>
          <MukulBadge />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#006a4e]" />
                <span className="text-[#006a4e]">{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === 'bn' ? 'কপি রেজাল্ট' : 'Copy'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00523c] text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রেজাল্ট প্রিন্ট করুন' : 'Print Marksheet'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: The Full Detailed Marksheet Card */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="print-card bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border-2 border-[#006a4e]/20 relative overflow-hidden bg-watermark">
            
            {/* Marksheet Header */}
            <div className="text-center border-b-2 border-[#006a4e]/30 pb-5 mb-5 relative">
              <div className="flex items-center justify-between gap-2 mb-2">
                {/* BD Gov Emblem */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="48" fill="#006a4e" />
                    <circle cx="50" cy="50" r="42" fill="#f42a41" />
                    <circle cx="50" cy="50" r="32" fill="#ffffff" />
                    <path d="M50 25 C45 35, 42 45, 50 68 C58 45, 55 35, 50 25 Z" fill="#006a4e" />
                    <path d="M50 68 C35 55, 30 40, 36 32 C38 45, 45 60, 50 68 Z" fill="#006a4e" />
                    <path d="M50 68 C65 55, 70 40, 64 32 C62 45, 55 60, 50 68 Z" fill="#006a4e" />
                    <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#ffcc00" />
                  </svg>
                </div>

                <div className="flex-1 text-center">
                  <h2 className="text-sm sm:text-base font-extrabold uppercase text-[#006a4e] tracking-wide">
                    BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, {result.board_name}
                  </h2>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    BANGLADESH
                  </h3>
                  <div className="mt-1 inline-block bg-[#006a4e] text-white px-3 py-0.5 rounded text-xs font-bold uppercase">
                    {result.exam || 'SECONDARY SCHOOL CERTIFICATE'} EXAMINATION - {result.year || '2024'}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">
                    Academic Transcript & Grade Sheet
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-1.5 rounded border border-slate-300 bg-slate-50 w-16 h-16 flex-shrink-0">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>
              </div>
            </div>

            {/* Candidate Details Table */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-300 bg-slate-50">
                    <td className="w-1/4 p-2 font-bold text-slate-700 border-r border-slate-300">Roll No</td>
                    <td className="w-1/4 p-2 font-mono font-bold text-slate-900 border-r border-slate-300">{result.roll}</td>
                    <td className="w-1/4 p-2 font-bold text-slate-700 border-r border-slate-300">Registration No</td>
                    <td className="w-1/4 p-2 font-mono font-bold text-slate-900">{result.regno || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-50">Student Name</td>
                    <td colSpan={3} className="p-2 font-extrabold text-slate-950 uppercase">{result.name}</td>
                  </tr>
                  {result.fname && (
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-50">Father's Name</td>
                      <td colSpan={3} className="p-2 text-slate-800 uppercase">{result.fname}</td>
                    </tr>
                  )}
                  {result.mname && (
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-50">Mother's Name</td>
                      <td colSpan={3} className="p-2 text-slate-800 uppercase">{result.mname}</td>
                    </tr>
                  )}
                  <tr className="border-b border-slate-300 bg-slate-50">
                    <td className="p-2 font-bold text-slate-700 border-r border-slate-300">Board</td>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-300 uppercase">{result.board_name}</td>
                    <td className="p-2 font-bold text-slate-700 border-r border-slate-300">Group</td>
                    <td className="p-2 font-bold text-slate-900 uppercase">{result.stud_group || 'SCIENCE'}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-50">Result Status</td>
                    <td className="p-2 border-r border-slate-300">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black uppercase bg-emerald-100 text-[#006a4e]">
                        {result.res_detail || 'PASSED'}
                      </span>
                    </td>
                    <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-50">GPA</td>
                    <td className="p-2 font-black text-[#006a4e] text-base">
                      {result.gpa} {isGolden ? '★' : ''}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300 bg-slate-50">
                    <td className="p-2 font-bold text-slate-700 border-r border-slate-300">Institute</td>
                    <td colSpan={3} className="p-2 font-bold text-slate-900 uppercase">
                      {result.inst_name || 'NOTRE DAME COLLEGE, DHAKA'} {result.eiin ? `(EIIN: ${result.eiin})` : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subject-Wise Grade Sheet Table */}
            <div className="mb-6">
              <div className="text-center mb-2.5">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-[#006a4e] pb-0.5 inline-block">
                  Subject-Wise Grade & Marks Sheet
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-[#006a4e] text-white font-bold text-center">
                      <th className="p-2 border border-emerald-900 w-16">Code</th>
                      <th className="p-2 border border-emerald-900 text-left">Subject Name</th>
                      <th className="p-2 border border-emerald-900 w-14">Theory</th>
                      <th className="p-2 border border-emerald-900 w-14">MCQ</th>
                      <th className="p-2 border border-emerald-900 w-14">Prac</th>
                      <th className="p-2 border border-emerald-900 w-16">Total</th>
                      <th className="p-2 border border-emerald-900 w-16">Grade</th>
                      <th className="p-2 border border-emerald-900 w-14">GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sub_details && result.sub_details.length > 0 ? (
                      result.sub_details.map((sub, idx) => (
                        <tr key={sub.code || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 text-center font-mono font-bold text-slate-700 border border-slate-300">
                            {sub.code}
                          </td>
                          <td className="p-2 font-semibold text-slate-900 border border-slate-300">
                            {sub.name}
                          </td>
                          <td className="p-2 text-center text-slate-700 border border-slate-300">
                            {sub.theory || '-'}
                          </td>
                          <td className="p-2 text-center text-slate-700 border border-slate-300">
                            {sub.mcq || '-'}
                          </td>
                          <td className="p-2 text-center text-slate-700 border border-slate-300">
                            {sub.practical || '-'}
                          </td>
                          <td className="p-2 text-center font-bold text-slate-900 border border-slate-300">
                            {sub.total || '-'}
                          </td>
                          <td className="p-2 text-center font-black border border-slate-300">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                sub.grade === 'A+'
                                  ? 'bg-emerald-100 text-[#006a4e]'
                                  : sub.grade === 'A'
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {sub.grade}
                            </span>
                          </td>
                          <td className="p-2 text-center font-bold text-[#006a4e] border border-slate-300">
                            {sub.point || (sub.grade === 'A+' ? '5.0' : '4.0')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-slate-500">
                          Detailed subject marks are published by the respective board controller office.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* National Grading Scale & Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-300">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                  Grading Scale
                </span>
                <div className="grid grid-cols-7 text-[9px] text-center border border-slate-300">
                  {GRADING_SCALE.map((scale) => (
                    <div key={scale.grade} className="border-r border-slate-300 last:border-r-0">
                      <div className="bg-slate-100 font-bold p-0.5">{scale.grade}</div>
                      <div className="p-0.5 font-mono">{scale.point}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end text-center">
                <div className="flex flex-col items-center">
                  <span className="font-serif italic text-sm text-[#006a4e] font-bold -rotate-3 select-none">
                    Prof. M. A. Rahman
                  </span>
                  <div className="w-32 border-t border-slate-800 mt-1"></div>
                  <span className="text-[9px] font-bold text-slate-800 uppercase mt-0.5">
                    Controller of Examinations
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-500">
              Verified by Mukul Developer Result Portal • educationboardresults.gov.bd
            </div>
          </div>
        </div>

        {/* Right Column: Character beside Result (Desktop) + Celebration Badge */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center space-y-4 no-print">
          
          {/* Celebratory GPA Banner */}
          <div className="w-full bg-[#006a4e] text-white rounded-3xl p-6 shadow-xl text-center border-4 border-emerald-700/40 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#f42a41] text-white flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-white/30 font-black text-xl">
              {result.gpa}
            </div>
            <h3 className="font-black text-lg">
              {lang === 'bn' ? 'অভিনন্দন!' : 'Congratulations!'}
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              {result.name}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isGolden ? 'GOLDEN A+ (জিপিএ ৫.০০)' : 'PASSED (উত্তীর্ণ)'}</span>
            </div>
          </div>

          {/* Student Character standing beside the result pointing left */}
          <div className="relative max-w-[240px] sm:max-w-[280px]">
            <img
              src="/assets/aistudio/student_pointing_left_8f3074af.png"
              alt="Student pointing at result"
              className="w-full h-auto object-contain max-h-[380px] drop-shadow-xl animate-in fade-in slide-in-from-right-6 duration-700"
            />
            <div className="w-36 h-3.5 bg-emerald-950/15 rounded-[100%] mx-auto blur-[2px] -mt-2"></div>
          </div>

          {/* Print button on side */}
          <button
            onClick={handlePrint}
            className="w-full py-3 px-5 rounded-2xl bg-[#006a4e] hover:bg-[#00523c] text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'bn' ? 'মার্কশিট প্রিন্ট করুন' : 'Print Marksheet'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
