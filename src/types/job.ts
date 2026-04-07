export interface JobPosting {
  id: string;
  title: string;
  company: string;
  url: string | null;
  rawText: string;
  createdAt: string;
}
