/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageHeader } from './components/LanguageHeader';
import { FormView } from './components/FormView';
import { ResultPageView } from './components/ResultPageView';
import { StudentResult, SearchParams } from './types';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [currentPage, setCurrentPage] = useState<'form' | 'result'>('form');
  const [currentResult, setCurrentResult] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (params: SearchParams, cookie?: string) => {
    setLoading(true);
    setErrorMessage(null);

    // 1. Direct validation: 2026 results are not published
    if (params.year === '2026') {
      setLoading(false);
      setErrorMessage(
        lang === 'bn'
          ? '২০২৬ সালের পরীক্ষার ফলাফল এখনো প্রকাশিত হয়নি। শিক্ষা বোর্ড কর্তৃক ফলাফল প্রকাশের পর এখান থেকে ফলাফল দেখা যাবে।'
          : 'Result for 2026 examination has not been published yet. Please try again after official publication.'
      );
      return;
    }

    try {
      const res = await fetch('/api/get-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          cookie,
        }),
      });

      let data: any = null;
      try {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch {
        data = null;
      }

      if (data && data.ok && data.result) {
        const enriched: StudentResult = {
          ...data.result,
          exam: (params.exam || 'SSC').toUpperCase(),
          year: params.year || '2024',
          board_name: (params.board || data.result.board_name || 'DHAKA').toUpperCase(),
        };
        setCurrentResult(enriched);
        setCurrentPage('result');
        setErrorMessage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Authentic error from government server
        const msg = data?.error || (lang === 'bn'
          ? 'রোল বা রেজিস্ট্রেশন নম্বর মিলেনি। অনুগ্রহ করে প্রবেশপত্র (Admit Card) অনুযায়ী সঠিক তথ্য প্রদান করুন।'
          : 'Roll or registration number did not match. Please verify your Admit Card and try again.');
        setErrorMessage(msg);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMessage(
        lang === 'bn'
          ? 'শিক্ষা বোর্ড সার্ভারে সংযোগ করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।'
          : 'Could not connect to the education board server. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setCurrentPage('form');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f3f9f5] flex flex-col justify-between selection:bg-[#006a4e] selection:text-white font-sans antialiased">
      {/* Floating minimal language toggle */}
      <LanguageHeader lang={lang} setLang={setLang} />

      {/* Main Content Area (Form Page or Result Page) */}
      <main className="flex-1 flex items-center justify-center py-4 sm:py-8">
        {currentPage === 'form' ? (
          <FormView
            lang={lang}
            onSubmit={handleFormSubmit}
            loading={loading}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
          />
        ) : currentResult ? (
          <ResultPageView
            result={currentResult}
            lang={lang}
            onBack={handleBackToSearch}
          />
        ) : null}
      </main>

      {/* Developer signature footnote */}
      <div className="py-2.5 text-center text-[11px] text-slate-400 font-medium no-print">
        Designed with ❤️ by <span className="text-[#006a4e] font-bold">Mukul Developer</span> • বাংলাদেশ শিক্ষা বোর্ড
      </div>
    </div>
  );
}
