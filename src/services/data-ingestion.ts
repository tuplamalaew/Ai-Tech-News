import * as cheerio from 'cheerio';
import { RawArticle } from '../types';

/**
 * Helper to extract text from a given URL using cheerio.
 * If fetching fails, we return a fallback string or empty string.
 */
async function extractTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AITechDigestBot/1.0; +http://example.com)',
      },
      // Using Next.js fetch cache if running in server components / api routes
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      return '';
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, and nav elements to clean up text
    $('script, style, nav, footer, header, noscript, iframe').remove();
    
    // Extract text from paragraphs and headings
    const paragraphs = $('p, h1, h2, h3').map((_, el) => $(el).text()).get().join(' ');
    
    // Trim and limit the extracted text to ~2000 characters to save tokens for LLM
    return paragraphs.replace(/\s+/g, ' ').trim().slice(0, 2000);
  } catch (error) {
    console.error(`Error extracting text from ${url}:`, error);
    return '';
  }
}

/**
 * Fetches top stories from Hacker News.
 * Now visits the URL to scrape the actual content (Option 2).
 */
export async function fetchHackerNewsTop(limit = 10): Promise<RawArticle[]> {
  try {
    // 1. Get Top Story IDs
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      next: { revalidate: 3600 }
    });
    const storyIds: number[] = await topStoriesRes.json();
    const topIds = storyIds.slice(0, limit);

    // 2. Fetch Story Details and Scrape content
    const articlesPromises = topIds.map(async (id) => {
      const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: { revalidate: 3600 }
      });
      const item = await itemRes.json();
      
      let summary = item.text || ''; // If it's a text post (Ask HN), use the text
      const articleUrl = item.url || `https://news.ycombinator.com/item?id=${id}`;

      // If there is no text but there is a URL, we scrape the URL
      if (!summary && item.url) {
        summary = await extractTextFromUrl(item.url);
      }

      return {
        id: String(id),
        title: item.title,
        summary: summary || 'No content could be extracted.',
        url: articleUrl,
        source: 'Hacker News' as const,
      };
    });

    return await Promise.all(articlesPromises);
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}

/**
 * Fetches latest fresh articles from Dev.to API.
 * Dev.to provides description (summary) out of the box.
 */
export async function fetchDevToArticles(limit = 10): Promise<RawArticle[]> {
  try {
    const res = await fetch(`https://dev.to/api/articles?state=fresh&per_page=${limit}`, {
      next: { revalidate: 3600 }
    });
    const articles = await res.json();

    return articles.map((article: any) => ({
      id: String(article.id),
      title: article.title,
      summary: article.description || article.title, // Dev.to provides a short description
      url: article.url,
      source: 'Dev.to' as const,
    }));
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
}

/**
 * Aggregator: Fetches from both sources
 */
export async function fetchAllTechNews(limitPerSource = 10): Promise<RawArticle[]> {
  const [hnArticles, devtoArticles] = await Promise.all([
    fetchHackerNewsTop(limitPerSource),
    fetchDevToArticles(limitPerSource),
  ]);

  return [...hnArticles, ...devtoArticles];
}
