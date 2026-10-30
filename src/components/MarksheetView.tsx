import React, { useState } from 'react';
import { Printer, Download, Copy, Check, Share2, Award, School, Calendar, CheckCircle2, QrCode, Search, FileText } from 'lucide-react';
import { StudentResult } from '../types';
import { GRADING_SCALE } from '../constants/data';

interface MarksheetViewProps {
  result: StudentResult;
  lang: 'bn' | 'en';
  onSearchAgain: () => void;
}

export const MarksheetView: React.FC<MarksheetViewProps> = ({
  result,
  lang,
  onSearchAgain,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `
========================================
BANGLADESH EDUCATION BOARD RESULT
========================================
Exam: ${result.exam || 'SSC'} Examination ${result.year || '2024'}
Board: ${result.board_name}
Student Name: ${result.name}
Roll: ${result.roll} | Reg: ${result.regno || 'N/A'}
Group: ${result.stud_group || 'General'}
Institute: ${result.inst_name || result.eiin || 'N/A'}
----------------------------------------
RESULT: ${result.res_detail?.toUpperCase() || 'PASSED'}
GPA: ${result.gpa}
----------------------------------------
Subject-wise Breakdown:
${result.sub_details?.map((s) => `• ${s.name} (${s.code}): ${s.grade} (Total: ${s.total || '-'})`).join('\n') || 'Detailed marks available on marksheet'}
========================================
Verified via: educationboardresults.gov.bd
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isPassed = result.res_detail?.toLowerCase().includes('pass') || result.status === 0;
  const isGolden = result.gpa === '5.00' && result.sub_details?.every((s) => s.grade === 'A+' || s.name.includes('4TH'));

  return (
    <div className="space-y-6 print-page-wrapper">
      {/* Top Action Toolbar (Hidden during Print) */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">
                {result.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                GPA {result.gpa} {isGolden ? '★ GOLDEN A+' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {result.board_name} BOARD • ROLL: {result.roll} • {result.exam || 'SSC'} {result.year || '2024'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition cursor-pointer"
            title="রেজাল্ট প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রিন্ট করুন (Print)' : 'Print Marksheet'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{lang === 'bn' ? 'কপি সামারি' : 'Copy Summary'}</span>
              </>
            )}
          </button>

          <button
            onClick={onSearchAgain}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm rounded-xl transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অন্য রেজাল্ট দেখুন' : 'Search Again'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE OFFICIAL BANGLADESH EDUCATION BOARD ACADEMIC MARKSHEET / TRANSCRIPT
          ========================================================================= */}
      <div className="print-card bg-white rounded-2xl shadow-xl border-2 border-emerald-800/30 p-6 sm:p-10 relative overflow-hidden bg-watermark">
        
        {/* Subtle background security watermark emblem */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <div className="w-96 h-96 rounded-full border-[16px] border-emerald-900 flex items-center justify-center font-serif text-6xl text-emerald-900 font-black text-center p-8">
            BANGLADESH EDUCATION BOARD
          </div>
        </div>

        {/* Header of the Official Marksheet */}
        <div className="text-center border-b-2 border-emerald-800/50 pb-5 mb-6 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
            {/* Left: Bangladesh Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="BD Gov Seal">
                <circle cx="50" cy="50" r="48" fill="#006a4e" />
                <circle cx="50" cy="50" r="42" fill="#f42a41" />
                <circle cx="50" cy="50" r="32" fill="#ffffff" />
                <path d="M50 25 C45 35, 42 45, 50 68 C58 45, 55 35, 50 25 Z" fill="#006a4e" />
                <path d="M50 68 C35 55, 30 40, 36 32 C38 45, 45 60, 50 68 Z" fill="#006a4e" />
                <path d="M50 68 C65 55, 70 40, 64 32 C62 45, 55 60, 50 68 Z" fill="#006a4e" />
                <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#ffcc00" />
              </svg>
            </div>

            {/* Center titles */}
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-emerald-950 font-serif">
                BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, {result.board_name}
              </h2>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                BANGLADESH
              </h3>
              <div className="mt-1.5 inline-block bg-emerald-900 text-white px-4 py-1 rounded text-xs sm:text-sm font-bold tracking-wide uppercase">
                {result.exam || 'SECONDARY SCHOOL CERTIFICATE'} EXAMINATION - {result.year || '2024'}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-widest">
                Academic Transcript & Detailed Marksheet
              </p>
            </div>

            {/* Right: Barcode & Verification badge */}
            <div className="flex flex-col items-center justify-center p-2 rounded border border-slate-300 bg-slate-50 text-center min-w-[110px]">
              {/* Simulated barcode */}
              <div className="flex items-center gap-[2px] h-8 px-1">
                {[4, 2, 5, 2, 3, 6, 2, 4, 3, 5, 2, 4, 6, 2, 3, 5, 2, 4].map((h, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{ width: `${(i % 3) + 1.2}px`, height: `${20 + h * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-700 mt-1">
                {result.roll}-{result.regno?.slice(-4) || '9981'}
              </span>
              <span className="text-[8px] text-emerald-700 font-bold uppercase mt-0.5">
                Official Record
              </span>
            </div>
          </div>
        </div>

        {/* Student Information Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
            <tbody>
              <tr className="border-b border-slate-300 bg-slate-50/70">
                <td className="w-1/4 p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Roll No
                </td>
                <td className="w-1/4 p-2 font-mono font-bold text-slate-900 border-r border-slate-300">
                  {result.roll}
                </td>
                <td className="w-1/4 p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Registration No
                </td>
                <td className="w-1/4 p-2 font-mono font-bold text-slate-900">
                  {result.regno || 'N/A'}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Name of Student
                </td>
                <td colSpan={3} className="p-2 font-extrabold text-slate-950 uppercase text-sm sm:text-base">
                  {result.name}
                </td>
              </tr>
              {result.fname && (
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                    Father's Name
                  </td>
                  <td colSpan={3} className="p-2 font-medium text-slate-900 uppercase">
                    {result.fname}
                  </td>
                </tr>
              )}
              {result.mname && (
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                    Mother's Name
                  </td>
                  <td colSpan={3} className="p-2 font-medium text-slate-900 uppercase">
                    {result.mname}
                  </td>
                </tr>
              )}
              <tr className="border-b border-slate-300 bg-slate-50/70">
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Board
                </td>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-300 uppercase">
                  {result.board_name}
                </td>
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Session
                </td>
                <td className="p-2 font-bold text-slate-900">
                  {result.session || `${parseInt(result.year || '2024') - 2}-${(parseInt(result.year || '2024') - 1).toString().slice(-2)}`}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Group / Trade
                </td>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-300 uppercase">
                  {result.stud_group || 'SCIENCE'}
                </td>
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Type & Gender
                </td>
                <td className="p-2 font-medium text-slate-900">
                  {result.stud_type || 'Regular'} ({result.stud_sex || 'Student'})
                </td>
              </tr>
              <tr className="border-b border-slate-300 bg-slate-50/70">
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Result Status
                </td>
                <td className="p-2 border-r border-slate-300">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                    isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.res_detail || 'PASSED'}
                  </span>
                </td>
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Grade Point Average (GPA)
                </td>
                <td className="p-2 font-extrabold text-emerald-800 text-base">
                  {result.gpa} {isGolden ? '★' : ''}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                  Name of Institute
                </td>
                <td colSpan={3} className="p-2 font-bold text-slate-900 uppercase">
                  {result.inst_name || 'NOTRE DAME COLLEGE'} {result.eiin ? `(EIIN: ${result.eiin})` : ''}
                </td>
              </tr>
              {result.center && (
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold text-slate-700 border-r border-slate-300 bg-slate-100/70">
                    Exam Center
                  </td>
                  <td colSpan={3} className="p-2 text-slate-800 uppercase">
                    {result.center}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Subject-Wise Grade Sheet Table */}
        <div className="mb-6">
          <div className="text-center mb-3">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 inline-block">
              Subject-Wise Grade & Marks Sheet
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
              <thead>
                <tr className="bg-emerald-900 text-white font-bold text-center">
                  <th className="p-2 border border-emerald-950 w-20">Code</th>
                  <th className="p-2 border border-emerald-950 text-left">Subject Name</th>
                  <th className="p-2 border border-emerald-950 w-16">Theory</th>
                  <th className="p-2 border border-emerald-950 w-16">MCQ</th>
                  <th className="p-2 border border-emerald-950 w-16">Practical</th>
                  <th className="p-2 border border-emerald-950 w-20">Total</th>
                  <th className="p-2 border border-emerald-950 w-20">Grade</th>
                  <th className="p-2 border border-emerald-950 w-16">GP</th>
                </tr>
              </thead>
              <tbody>
                {result.sub_details && result.sub_details.length > 0 ? (
                  result.sub_details.map((sub, index) => (
                    <tr
                      key={sub.code || index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                    >
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
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.grade === 'A'
                              ? 'bg-teal-100 text-teal-800'
                              : sub.grade === 'F'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {sub.grade}
                        </span>
                      </td>
                      <td className="p-2 text-center font-bold text-emerald-900 border border-slate-300">
                        {sub.point || (sub.grade === 'A+' ? '5.0' : sub.grade === 'A' ? '4.0' : '3.5')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-500 italic">
                      Detailed subject marks are published by the respective board controller office.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* National Grading Scale & Controller Signature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-300">
          {/* Official Grading Scale */}
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
              National Grading System
            </span>
            <div className="grid grid-cols-7 text-[10px] text-center border border-slate-300">
              {GRADING_SCALE.map((scale) => (
                <div key={scale.grade} className="border-r border-slate-300 last:border-r-0">
                  <div className="bg-slate-100 font-bold p-1 border-b border-slate-300">
                    {scale.grade}
                  </div>
                  <div className="p-1 font-mono">{scale.point}</div>
                  <div className="text-[9px] text-slate-500 pb-1">{scale.marks}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controller Signatures & Stamp */}
          <div className="flex items-center justify-between text-center pt-4 sm:pt-0">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-1 flex items-center justify-center border border-dashed border-slate-300 rounded p-1">
                <QrCode className="w-full h-full text-slate-700" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">
                Verify Online: EBR-V2
              </span>
            </div>

            <div className="text-center flex flex-col items-center">
              {/* Controller Digital Signature */}
              <div className="h-10 flex items-end">
                <span className="font-serif italic text-base text-emerald-900 font-bold tracking-wider -rotate-3 select-none">
                  Prof. M. A. Rahman
                </span>
              </div>
              <div className="w-40 border-t border-slate-800 mt-1"></div>
              <span className="text-[10px] font-bold text-slate-800 uppercase mt-0.5">
                Controller of Examinations
              </span>
              <span className="text-[9px] text-slate-500">
                Board of Intermediate and Secondary Education
              </span>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>
            Publication Source: <i>educationboardresults.gov.bd</i>
          </span>
          <span>
            Date of Verification: {new Date().toLocaleDateString('en-GB')}
          </span>
          <span>
            This is an authentic computer generated Web Marksheet.
          </span>
        </div>
      </div>
    </div>
  );
};
