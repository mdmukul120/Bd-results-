export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const EBR_BASE_URL = 'https://educationboardresults.gov.bd';

  // Helper: Fetch real government captcha with strict timeout to prevent Vercel 504
  const fetchGovCaptcha = async (timeoutMs = 4500) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const govRes = await fetch(`${EBR_BASE_URL}/v2/captcha`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': `${EBR_BASE_URL}/v2/home`,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      clearTimeout(timer);

      if (!govRes.ok) return null;

      // Extract real session cookie issued by education board
      let cookieHeader = '';
      if (typeof (govRes.headers as any).getSetCookie === 'function') {
        const cookies = (govRes.headers as any).getSetCookie();
        if (cookies && cookies.length > 0) {
          cookieHeader = cookies[0].split(';')[0];
        }
      }
      if (!cookieHeader) {
        const raw = govRes.headers.get('set-cookie') || '';
        cookieHeader = raw.split(';')[0];
      }

      const arrayBuf = await govRes.arrayBuffer();
      if (!arrayBuf || arrayBuf.byteLength === 0) return null;

      const base64 = Buffer.from(arrayBuf).toString('base64');
      return { base64, cookie: cookieHeader };
    } catch {
      clearTimeout(timer);
      return null;
    }
  };

  // Attempt 1 (4.5s)
  let captchaData = await fetchGovCaptcha(4500);
  // Attempt 2 (3.5s retry if first attempt encountered network latency)
  if (!captchaData) {
    captchaData = await fetchGovCaptcha(3500);
  }

  if (captchaData && captchaData.base64 && captchaData.cookie) {
    let solvedDigits = '';

    // If GEMINI_API_KEY is available (in AI Studio or configured on Vercel), auto-solve
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const modelRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: captchaData.base64 } },
                { text: 'Extract ONLY the 4 numerical digits shown in this CAPTCHA. Output ONLY the 4 digits without any other characters or spaces.' },
              ],
            },
          ],
        });

        solvedDigits = (modelRes.text || '').trim().replace(/\D/g, '').slice(0, 4);
      } catch (err: any) {
        console.warn('AI Captcha solver note:', err?.message);
      }
    }

    return res.status(200).json({
      ok: true,
      image: `data:image/jpeg;base64,${captchaData.base64}`,
      cookie: captchaData.cookie,
      autoSolved: solvedDigits, // 4-digit code if AI solved, or empty string for manual entry
      source: 'gov_direct',
    });
  }

  // If government server is temporarily unreachable from the cloud region
  return res.status(200).json({
    ok: false,
    error: 'শিক্ষা বোর্ড সার্ভার থেকে ক্যাপচা আনা যায়নি। অনুগ্রহ করে রিলোড বাটনে চাপ দিন।',
    errorEn: 'Could not fetch CAPTCHA from education board server. Please click Reload.',
  });
}
