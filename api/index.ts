import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const EBR_BASE_URL = 'https://educationboardresults.gov.bd';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

async function solveCaptchaWithAI(base64Image: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: 'Extract ONLY the 4 numerical digits shown in this CAPTCHA. Return ONLY digits.' },
          ],
        },
      ],
    });
    return (response.text || '').trim().replace(/\D/g, '').slice(0, 4);
  } catch {
    return '';
  }
}

app.get('/api/status', async (req, res) => {
  res.json({ online: true, timestamp: new Date().toISOString() });
});

app.get('/api/captcha', async (req, res) => {
  try {
    const govRes = await fetch(`${EBR_BASE_URL}/v2/captcha`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    const setCookie = govRes.headers.get('set-cookie') || '';
    const cookieHeader = setCookie.split(';')[0];
    const arrayBuf = await govRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString('base64');
    const autoSolved = await solveCaptchaWithAI(base64);

    res.json({
      ok: true,
      image: `data:image/jpeg;base64,${base64}`,
      cookie: cookieHeader,
      autoSolved,
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message });
  }
});

app.post('/api/get-result', async (req, res) => {
  const { exam = 'ssc', year = '2024', board = 'dhaka', roll = '', reg = '' } = req.body;
  const cleanRoll = String(roll).trim();
  const cleanReg = String(reg).trim();

  try {
    const formParams = new URLSearchParams();
    formParams.append('exam', exam.toLowerCase());
    formParams.append('year', String(year));
    formParams.append('board', board.toLowerCase());
    formParams.append('result_type', '1');
    formParams.append('roll', cleanRoll);
    if (cleanReg) formParams.append('reg', cleanReg);
    formParams.append('captcha', req.body.captcha || '1234');

    const govPostRes = await fetch(`${EBR_BASE_URL}/v2/getres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': req.body.cookie || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: formParams.toString(),
    });

    const govData: any = await govPostRes.json().catch(() => null);
    if (govData && govData.res && govData.res.name) {
      return res.json({ ok: true, result: govData.res });
    }

    if (govData && govData.msg) {
      let bnMsg = govData.msg;
      if (govData.msg.includes('Incorrect registration number')) {
        bnMsg = 'রেজিস্ট্রেশন নম্বর বা রোল নম্বর সঠিক নয়। অনুগ্রহ করে প্রবেশপত্র অনুযায়ী সঠিক তথ্য প্রদান করুন।';
      } else if (govData.msg.includes('Could not validate your provided Security Key')) {
        bnMsg = 'নিরাপত্তা কোড (CAPTCHA) মিলেনি। পুনরায় চেষ্টা করুন।';
      } else if (govData.msg.includes('Result not found') || govData.msg.includes('not published')) {
        bnMsg = `${year} সালের এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি অথবা ফলাফল এখনো প্রকাশিত হয়নি।`;
      }
      return res.json({ ok: false, error: bnMsg, govMsg: govData.msg });
    }
  } catch {
    // network issue
  }

  res.json({
    ok: false,
    error: 'প্রদত্ত তথ্য অনুযায়ী শিক্ষা বোর্ডে কোনো ফলাফল পাওয়া যায়নি। রোল, রেজি এবং বোর্ড যাচাই করুন।',
  });
});

export default app;
