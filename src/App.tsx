/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const targetUrl = 'https://bd-result.ai.studio/';

  return (
    <div className="relative w-screen h-screen m-0 p-0 overflow-hidden bg-[#041d15]">
      {/* Loading state indicator during iframe initialization */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-[#06261d] via-[#041d15] to-[#02130e] text-white">
          <div className="relative flex items-center justify-center w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <div className="w-10 h-10 rounded-full bg-[#e11d48] shadow-lg shadow-rose-900/50 flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">BD</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold tracking-wide text-emerald-100 font-sans">
            শিক্ষা বোর্ড ফলাফল পোর্টাল
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1.5 font-sans">
            BD Result Portal is loading...
          </p>
        </div>
      )}

      {/* 100% Full-Screen Iframe */}
      <iframe
        src={targetUrl}
        title="Bangladesh Education Board Results Archive"
        className="fixed inset-0 w-full h-full border-0 m-0 p-0 z-10 block"
        allow="fullscreen; clipboard-read; clipboard-write; web-share"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
