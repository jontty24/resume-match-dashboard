export type AnalysisResult = {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
  keywordCoverage: {
    keyword: string;
    found: boolean;
  }[];
};