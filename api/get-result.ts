export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse body safely whether object, string, or parsed body
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const {
    exam = 'ssc',
    year = '2024',
    board = 'dhaka',
    roll = '',
    reg = '',
    captcha = '',
  } = body;
  const cookie = body.cookie || '';

  const cleanRoll = String(roll).trim();
  const cleanReg = String(reg).trim();
  const cleanCaptcha = String(captcha).trim();

  if (!cleanRoll) {
    return res.status(200).json({
      ok: false,
      error: 'রোল নম্বর প্রদান করা আবশ্যক।',
      errorEn: 'Roll number is required.',
    });
  }

  // 2026 Examination check: Explicitly notify that results are not published yet
  if (String(year) === '2026') {
    return res.status(200).json({
      ok: false,
      notPublished: true,
      error: '২০২৬ সালের পরীক্ষার ফলাফল এখনো প্রকাশিত হয়নি। শিক্ষা বোর্ড কর্তৃক ফলাফল প্রকাশের পর এখান থেকে ফলাফল দেখা যাবে।',
      errorEn: 'Result for 2026 examination has not been published yet. Please try again after official publication.',
    });
  }

  const EBR_BASE_URL = 'https://educationboardresults.gov.bd';

  try {
    const formParams = new URLSearchParams();
    formParams.append('exam', exam.toLowerCase());
    formParams.append('year', String(year));
    formParams.append('board', board.toLowerCase());
    formParams.append('result_type', '1');
    formParams.append('roll', cleanRoll);
    if (cleanReg) formParams.append('reg', cleanReg);
    formParams.append('captcha', cleanCaptcha);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7500);

    const govPostRes = await fetch(`${EBR_BASE_URL}/v2/getres`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': `${EBR_BASE_URL}/v2/home`,
        'Origin': EBR_BASE_URL,
        'Cache-Control': 'no-cache',
      },
      body: formParams.toString(),
    });
    clearTimeout(timer);

    const govData: any = await govPostRes.json().catch(() => null);

    if (govData && govData.res && typeof govData.res === 'object' && govData.res.name) {
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

      return res.status(200).json({
        ok: true,
        result: realStudent,
        source: 'gov_direct',
      });
    }

    if (govData && govData.msg) {
      let bnMsg = govData.msg;
      if (govData.msg.includes('Incorrect registration number')) {
        bnMsg = 'রেজিস্ট্রেশন নম্বর বা রোল নম্বর সঠিক নয়। অনুগ্রহ করে প্রবেশপত্র (Admit Card) অনুযায়ী সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।';
      } else if (govData.msg.includes('Could not validate your provided Security Key')) {
        bnMsg = 'নিরাপত্তা কোড (CAPTCHA) মিলেনি। ছবিতে প্রদর্শিত ৪টি সংখ্যা সঠিকভাবে লিখুন।';
      } else if (govData.msg.includes('Result not found') || govData.msg.includes('not published')) {
        bnMsg = `${year} সালের এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি অথবা ফলাফল এখনো প্রকাশিত হয়নি।`;
      }

      return res.status(200).json({
        ok: false,
        error: bnMsg,
        govMsg: govData.msg,
      });
    }

    return res.status(200).json({
      ok: false,
      error: 'শিক্ষা বোর্ড সার্ভার থেকে কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে রোল, রেজি এবং বোর্ড সঠিক কিনা যাচাই করুন।',
    });
  } catch {
    return res.status(200).json({
      ok: false,
      error: 'শিক্ষা বোর্ড সার্ভারে সংযোগ করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।',
    });
  }
}

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
