import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { RawArticle, ProcessedArticle } from '../types';

export async function filterAndSummarizeNews(articles: RawArticle[]): Promise<ProcessedArticle[]> {
  if (articles.length === 0) return [];

  // Define the schema for our expected JSON output using Zod
  const outputSchema = z.object({
    articles: z.array(
      z.object({
        title: z.string().describe("Translate the title to Thai"),
        summary: z.string().describe("สรุปเนื้อหาสั้นๆ 1-2 ประโยคเป็นภาษาไทย เพื่ออธิบายว่าข่าวนี้น่าสนใจอย่างไร"),
        url: z.string().url(),
        source: z.enum(['Hacker News', 'Dev.to']),
        emoji: z.string().describe("1 single emoji that best represents the topic of the news (e.g. 🚀, 🐛, 🤖, ⚛️)")
      })
    )
  });

  try {
    // Calling Gemini 2.5 Flash model
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: outputSchema,
      prompt: `
        You are an expert Senior Full-Stack Developer and AI Engineer.
        Review the following list of raw tech news articles.
        
        Your task:
        1. Filter out any news that is NOT relevant to Web Development, Software Engineering, AI, or Tech Trends.
        2. Keep only the highly relevant and interesting items.
        3. For each kept item, translate the title into Thai, and provide a 1-2 sentence summary IN THAI explaining WHY it is interesting or important for developers. Focus on technologies like Next.js, TypeScript, .NET, and AI.
        4. Provide 1 relevant emoji for each article.
        5. If an item is not relevant, do not include it in the output array.
        
        Raw Articles (JSON):
        ${JSON.stringify(articles, null, 2)}
      `,
    });

    return object.articles as ProcessedArticle[];
  } catch (error) {
    console.error('Error during LLM processing:', error);
    return [];
  }
}
