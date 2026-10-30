import { BoardOption, ExamOption } from '../types';

export const EXAM_OPTIONS: ExamOption[] = [
  { code: 'ssc', nameBn: 'এসএসসি / দাখিল / সমমান', nameEn: 'SSC / Dakhil / Equivalent' },
  { code: 'hsc', nameBn: 'এইচএসসি / আলিম / সমমান', nameEn: 'HSC / Alim / Equivalent' },
  { code: 'jsc', nameBn: 'জেএসসি / জেডিসি', nameEn: 'JSC / JDC' },
  { code: 'ssc_voc', nameBn: 'এসএসসি (ভোকেশনাল)', nameEn: 'SSC (Vocational)' },
  { code: 'hsc_voc', nameBn: 'এইচএসসি (ভোকেশনাল)', nameEn: 'HSC (Vocational)' },
  { code: 'hsc_bm', nameBn: 'এইচএসসি (বিএম / ডিপ্লোমা)', nameEn: 'HSC (BM / Diploma)' },
  { code: 'dibs', nameBn: 'ডিআইবিএস (ডিপ্লোমা ইন বিজনেস স্টাডিজ)', nameEn: 'DIBS (Diploma in Business Studies)' },
];

export const BOARD_OPTIONS: BoardOption[] = [
  { code: 'dhaka', nameBn: 'ঢাকা (Dhaka)', nameEn: 'Dhaka' },
  { code: 'rajshahi', nameBn: 'রাজশাহী (Rajshahi)', nameEn: 'Rajshahi' },
  { code: 'comilla', nameBn: 'কুমিল্লা (Comilla)', nameEn: 'Comilla' },
  { code: 'jessore', nameBn: 'যশোর (Jessore)', nameEn: 'Jessore' },
  { code: 'chittagong', nameBn: 'চট্টগ্রাম (Chittagong)', nameEn: 'Chittagong' },
  { code: 'barisal', nameBn: 'বরিশাল (Barisal)', nameEn: 'Barisal' },
  { code: 'sylhet', nameBn: 'সিলেট (Sylhet)', nameEn: 'Sylhet' },
  { code: 'dinajpur', nameBn: 'দিনাজপুর (Dinajpur)', nameEn: 'Dinajpur' },
  { code: 'mymensingh', nameBn: 'ময়মনসিংহ (Mymensingh)', nameEn: 'Mymensingh' },
  { code: 'madrasah', nameBn: 'মাদ্রাসা (Madrasah)', nameEn: 'Madrasah' },
  { code: 'tec', nameBn: 'কারিগরি (Technical)', nameEn: 'Technical' },
  { code: 'dibs', nameBn: 'ডিআইবিএস (DIBS)', nameEn: 'DIBS' },
];

export const YEARS_LIST = Array.from({ length: 31 }, (_, i) => String(2026 - i));

export const GRADING_SCALE = [
  { marks: '80-100', grade: 'A+', point: '5.0', range: 'Outstanding' },
  { marks: '70-79', grade: 'A', point: '4.0', range: 'Excellent' },
  { marks: '60-69', grade: 'A-', point: '3.5', range: 'Very Good' },
  { marks: '50-59', grade: 'B', point: '3.0', range: 'Good' },
  { marks: '40-49', grade: 'C', point: '2.0', range: 'Satisfactory' },
  { marks: '33-39', grade: 'D', point: '1.0', range: 'Pass' },
  { marks: '0-32', grade: 'F', point: '0.0', range: 'Failed' },
];

export const DEMO_PRESETS = [
  {
    titleBn: 'ঢাকা বিজ্ঞান (গোল্ডেন ৫.০০)',
    titleEn: 'Dhaka Science (Golden 5.00)',
    roll: '100101',
    reg: '1910654321',
    board: 'dhaka',
    exam: 'ssc',
    year: '2024',
    badge: 'GPA 5.00',
    color: 'emerald',
  },
  {
    titleBn: 'রাজশাহী মানবিক (জিপিএ ৪.৭৮)',
    titleEn: 'Rajshahi Humanities (GPA 4.78)',
    roll: '200202',
    reg: '1910778899',
    board: 'rajshahi',
    exam: 'ssc',
    year: '2024',
    badge: 'GPA 4.78',
    color: 'blue',
  },
  {
    titleBn: 'চট্টগ্রাম বাণিজ্য (জিপিএ ৪.৮৯)',
    titleEn: 'Chittagong Commerce (GPA 4.89)',
    roll: '300303',
    reg: '1910992211',
    board: 'chittagong',
    exam: 'ssc',
    year: '2024',
    badge: 'GPA 4.89',
    color: 'purple',
  },
  {
    titleBn: 'মাদ্রাসা দাখিল (জিপিএ ৫.০০)',
    titleEn: 'Madrasah Dakhil (GPA 5.00)',
    roll: '400404',
    reg: '1910114477',
    board: 'madrasah',
    exam: 'ssc',
    year: '2024',
    badge: 'Golden A+',
    color: 'amber',
  },
];
