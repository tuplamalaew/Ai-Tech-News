export interface RawArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: 'Hacker News' | 'Dev.to';
}

export interface ProcessedArticle {
  title: string;
  summary: string; // The 1-2 sentence AI-generated summary
  url: string;
  source: 'Hacker News' | 'Dev.to';
}
