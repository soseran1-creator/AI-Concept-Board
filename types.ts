export interface GeneralBrief {
  contentName: string;
  purpose: string;
  usage: string;
  targetAge: string;
  keyTopic: string;
  length: string;
  aspectRatio: string;
  format: string;
  budgetDifficulty: string;
  toneMannerReferences: string; // Links or text description
  desiredOutcome: string;
}

export interface AdvancedBrief {
  useGenreGuide: boolean;
  selectedGenre: string;
  
  useSubjectGuide: boolean;
  selectedSubject: string;
  subjectCharacteristics: string; // User input for guide values

  useGradeGuide: boolean;
  selectedGrade: string;
  gradeCharacteristics: string; // User input for guide values
}

export interface ConceptBoardResult {
  oneLineConcept: string;
  genreFormat: string;
  keyMessage: string;
  character: string;
  toneManner: string;
  imagePrompt: string;
  generatedImageBase64?: string;
}

export enum ApiProvider {
  GOOGLE = 'Google Gemini',
  OPENAI = 'OpenAI GPT (Coming Soon)',
}

export const SUBJECTS = [
  "과학", "수학", "영어", "국어", "사회", "미술", "음악", "체육", "도덕", "실과", "정보", "기타"
];

export const GRADES = [
  "초등 저학년 (1-2학년)",
  "초등 3-4학년",
  "초등 고학년 (5-6학년)",
  "중학생",
  "고등학생",
  "선생님",
  "학부모",
  "일반인"
];

export const GENRES = [
  "2D 애니메이션",
  "3D 애니메이션",
  "라인 애니메이션",
  "스탑모션",
  "모션그래픽",
  "인포그래픽",
  "실사 촬영",
  "캐릭터 합성",
  "다큐멘터리",
  "홍보 영상",
  "매뉴얼 영상",
  "숏폼 드라마",
  "인터뷰"
];