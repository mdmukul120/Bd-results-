import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Shared Gemini AI client for automated captcha solving
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const EBR_BASE_URL = 'https://educationboardresults.gov.bd';

// Helper: Solve CAPTCHA digits from image base64
async function solveCaptchaWithAI(base64Image: string): Promise<string> {
  try {
    const model = 'gemini-3.1-flash-lite';
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            {
              text: 'Extract ONLY the 4 numerical digits shown in this CAPTCHA image. Return ONLY the 4 digits without any spaces, letters, punctuation, or explanations.',
            },
          ],
        },
      ],
    });

    const text = response.text || '';
    const digits = text.trim().replace(/\D/g, '');
    return digits.slice(0, 4);
  } catch (err: any) {
    console.error('AI Captcha solver error (falling back to 3.8-flash):', err?.message);
    try {
      const response2 = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
              { text: 'Extract ONLY the 4 numerical digits in this CAPTCHA. Output just 4 digits.' },
            ],
          },
        ],
      });
      return (response2.text || '').trim().replace(/\D/g, '').slice(0, 4);
    } catch (e) {
      console.error('All AI models failed to solve captcha:', e);
      return '';
    }
  }
}

// 1. Live status check
app.get('/api/status', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const check = await fetch(`${EBR_BASE_URL}/v2/home`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);
    res.json({
      online: check.status === 200 || check.status === 301,
      statusCode: check.status,
      timestamp: new Date().toISOString(),
      target: EBR_BASE_URL,
    });
  } catch (error: any) {
    res.json({
      online: false,
      error: error?.message || 'Server check failed',
      timestamp: new Date().toISOString(),
      target: EBR_BASE_URL,
    });
  }
});

// 2. Fetch fresh Captcha from educationboardresults.gov.bd
app.get('/api/captcha', async (req, res) => {
  try {
    const autoSolve = req.query.autoSolve !== 'false';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const govRes = await fetch(`${EBR_BASE_URL}/v2/captcha`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': `${EBR_BASE_URL}/v2/home`,
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeout);

    if (!govRes.ok) {
      return res.status(200).json({
        ok: false,
        error: 'শিক্ষা বোর্ড সার্ভার থেকে ক্যাপচা আনা যায়নি। অনুগ্রহ করে রিলোড বাটনে চাপ দিন।',
      });
    }

    const setCookie = govRes.headers.get('set-cookie') || '';
    const cookieHeader = setCookie.split(';')[0];
    const arrayBuf = await govRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString('base64');

    let solvedDigits = '';
    if (autoSolve && process.env.GEMINI_API_KEY) {
      solvedDigits = await solveCaptchaWithAI(base64);
    }

    res.json({
      ok: true,
      image: `data:image/jpeg;base64,${base64}`,
      cookie: cookieHeader,
      autoSolved: solvedDigits,
      source: 'gov_direct',
    });
  } catch (err: any) {
    console.warn('Gov captcha unreachable:', err?.message);
    res.status(200).json({
      ok: false,
      error: 'শিক্ষা বোর্ড সার্ভার থেকে ক্যাপচা আনা যায়নি। অনুগ্রহ করে রিলোড বাটনে চাপ দিন।',
    });
  }
});

// 3. Challenge verify endpoint (proxying https://educationboardresults.gov.bd/_challenge-verify)
app.post('/api/verify-challenge', async (req, res) => {
  try {
    const { answer, cookie } = req.body;
    const response = await fetch(`${EBR_BASE_URL}/_challenge-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ answer: answer || '' }),
    });

    const data = await response.json().catch(() => ({}));
    res.status(response.status).json(data);
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message });
  }
});

// 4. Main Result Fetch (Using https://educationboardresults.gov.bd/v2/getres)
app.post('/api/get-result', async (req, res) => {
  const {
    exam = 'ssc',
    year = '2024',
    board = 'dhaka',
    roll = '',
    reg = '',
    result_type = '1',
    autoSolve = true,
  } = req.body;

  let { captcha = '', cookie = '' } = req.body;

  const cleanRoll = String(roll).trim();
  const cleanReg = String(reg).trim();

  if (!cleanRoll) {
    return res.status(400).json({ ok: false, error: 'রোল নম্বর প্রদান করা আবশ্যক (Roll Number is required)' });
  }

  // 2026 Result Check: Explicitly notify that 2026 results are not published yet
  if (String(year) === '2026') {
    return res.json({
      ok: false,
      notPublished: true,
      error: '২০২৬ সালের পরীক্ষার ফলাফল এখনো প্রকাশিত হয়নি। শিক্ষা বোর্ড কর্তৃক ফলাফল প্রকাশের পর ফলাফল দেখা যাবে।',
      errorEn: 'Result for 2026 examination has not been published yet. Please try again after the official publication.',
    });
  }

  try {
    let activeCookie = cookie;
    let activeCaptcha = captcha;

    // If autoSolve enabled and no captcha provided, fetch and auto-solve
    if (autoSolve && (!activeCaptcha || !activeCookie)) {
      try {
        const captchaRes = await fetch(`${EBR_BASE_URL}/v2/captcha`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': `${EBR_BASE_URL}/v2/home`,
          },
        });
        const setCookie = captchaRes.headers.get('set-cookie') || '';
        activeCookie = setCookie.split(';')[0];
        const arrayBuf = await captchaRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuf).toString('base64');
        activeCaptcha = await solveCaptchaWithAI(base64);
      } catch (err: any) {
        console.warn('Auto captcha acquisition failed:', err?.message);
      }
    }

    // Submit to official government server
    const formParams = new URLSearchParams();
    formParams.append('exam', exam.toLowerCase());
    formParams.append('year', String(year));
    formParams.append('board', board.toLowerCase());
    formParams.append('result_type', String(result_type || '1'));
    formParams.append('roll', cleanRoll);
    if (cleanReg) {
      formParams.append('reg', cleanReg);
    }
    formParams.append('captcha', activeCaptcha || '1234');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const govPostRes = await fetch(`${EBR_BASE_URL}/v2/getres`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': activeCookie || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `${EBR_BASE_URL}/v2/home`,
        'Origin': EBR_BASE_URL,
      },
      body: formParams.toString(),
    });

    clearTimeout(timeout);
    const govData: any = await govPostRes.json().catch(() => null);

    if (govData && govData.res && typeof govData.res === 'object' && govData.res.name) {
      // Process real subject-wise grade/marks
      const parsedSubjects = parseGovSubjects(govData.res.display_details, govData.sub_details || govData.sub);
      
      const realStudent = {
        ...govData.res,
        roll: govData.res.roll_no || govData.res.roll || cleanRoll,
        regno: govData.res.regno || cleanReg,
        exam: exam.toUpperCase(),
        year: String(year),
        board_name: (govData.res.board_name || board).toUpperCase(),
        sub_details: parsedSubjects.length > 0 ? parsedSubjects : undefined,
      };

      return res.json({
        ok: true,
        source: 'gov_direct',
        result: realStudent,
      });
    }

    // If server responded with error message from government
    if (govData && govData.msg) {
      let bnMsg = govData.msg;
      if (govData.msg.includes('Incorrect registration number')) {
        bnMsg = 'রেজিস্ট্রেশন নম্বর বা রোল নম্বর সঠিক নয়। অনুগ্রহ করে প্রবেশপত্র (Admit Card) অনুযায়ী সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।';
      } else if (govData.msg.includes('Could not validate your provided Security Key')) {
        bnMsg = 'নিরাপত্তা কোড (CAPTCHA) মিলেনি। অনুগ্রহ করে নতুন কোড দিয়ে পুনরায় চেষ্টা করুন।';
      } else if (govData.msg.includes('Result not found') || govData.msg.includes('not published')) {
        bnMsg = `${year} সালের এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি অথবা ফলাফল এখনো প্রকাশিত হয়নি।`;
      }

      return res.json({
        ok: false,
        error: bnMsg,
        govMsg: govData.msg,
      });
    }

    return res.json({
      ok: false,
      error: 'শিক্ষা বোর্ড সার্ভার থেকে কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে রোল, রেজি ও বোর্ড সঠিক কিনা পরীক্ষা করুন।',
    });
  } catch (err: any) {
    console.error('Gov API request error:', err?.message);
    return res.json({
      ok: false,
      error: 'শিক্ষা বোর্ড সার্ভারে সংযোগ করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।',
    });
  }
});

// Helper: Parse official display_details string into structured subject grades
function parseGovSubjects(displayDetails?: string, subDict?: any[]): any[] {
  if (!displayDetails || typeof displayDetails !== 'string') return [];
  const subjects: any[] = [];
  const items = displayDetails.split(',');

  const subjectNames: Record<string, string> = {
    '101': 'BANGLA',
    '102': 'BANGLA II',
    '107': 'ENGLISH',
    '108': 'ENGLISH II',
    '109': 'MATHEMATICS',
    '111': 'ISLAM & MORAL EDUCATION',
    '112': 'HINDU RELIGION',
    '113': 'BUDDHIST RELIGION',
    '114': 'CHRISTIAN RELIGION',
    '126': 'HIGHER MATHEMATICS',
    '134': 'AGRICULTURE STUDIES',
    '136': 'PHYSICS',
    '137': 'CHEMISTRY',
    '138': 'BIOLOGY',
    '140': 'HISTORY OF BANGLADESH',
    '141': 'CIVICS & CITIZENSHIP',
    '146': 'ACCOUNTING',
    '147': 'BUSINESS ENTREPRENEURSHIP',
    '149': 'FINANCE & BANKING',
    '150': 'BANGLADESH & GLOBAL STUDIES',
    '154': 'INFORMATION & COMM. TECH.',
  };

  if (Array.isArray(subDict)) {
    subDict.forEach((s: any) => {
      if (s.SUB_CODE && s.SUB_NAME) {
        subjectNames[String(s.SUB_CODE)] = s.SUB_NAME;
      }
    });
  }

  for (const item of items) {
    const parts = item.split(':');
    if (parts.length < 2) continue;
    const code = parts[0].trim();
    const resultPart = parts[1].trim();
    const resTokens = resultPart.split('=');
    const grade = resTokens[resTokens.length - 1]?.trim() || '';
    let total = '';
    let theory = '';
    let practical = '';
    let mcq = '';

    if (resTokens.length > 2) {
      const details = resTokens[0];
      total = resTokens[1];
      const mSplit = details.split('+');
      if (mSplit.length >= 3) {
        theory = mSplit[0];
        practical = mSplit[1];
        mcq = mSplit[2];
      }
    } else if (resTokens.length > 1) {
      total = resTokens[0];
    }

    const gpMap: Record<string, string> = {
      'A+': '5.0',
      'A': '4.0',
      'A-': '3.5',
      'B': '3.0',
      'C': '2.0',
      'D': '1.0',
      'F': '0.0',
    };

    subjects.push({
      code,
      name: subjectNames[code] || `SUBJECT (${code})`,
      theory: theory || '-',
      mcq: mcq || '-',
      practical: practical || '-',
      total: total || '-',
      grade,
      point: gpMap[grade] || '-',
    });
  }

  return subjects;
}

// 5. Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Bangladesh Education Board Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
