export interface JobPosting {
  id: string;
  title: string;
  company: string;
  url: string | null;
  rawText: string;
  createdAt: string;
}

export interface AnalysisResult {
  id: string;
  jobPostingId: string;
  matchScore: number;
  summary: string;
  createdAt: string;
}
