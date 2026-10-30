export interface SubjectGrade {
  code: string;
  name: string;
  theory?: string;
  mcq?: string;
  practical?: string;
  total?: string;
  grade: string;
  point?: string;
}

export interface StudentResult {
  roll: string;
  regno?: string;
  name: string;
  fname?: string;
  mname?: string;
  board_name: string;
  session?: string;
  stud_group?: string;
  stud_type?: string;
  stud_sex?: string;
  gpa: string;
  res_detail: string;
  dob?: string;
  eiin?: string;
  inst_name?: string;
  center?: string;
  status: number;
  showmarks?: number;
  sub_details?: SubjectGrade[];
  exam?: string;
  year?: string;
  fetchedAt?: string;
  source?: 'gov_direct' | 'live_verified' | 'smart_engine';
}

export interface SearchParams {
  exam: string;
  year: string;
  board: string;
  roll: string;
  reg: string;
  result_type: string;
  captcha: string;
  autoSolve: boolean;
}

export interface BoardOption {
  code: string;
  nameBn: string;
  nameEn: string;
}

export interface ExamOption {
  code: string;
  nameBn: string;
  nameEn: string;
}
