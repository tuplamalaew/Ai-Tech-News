import { NextResponse } from 'next/server';
import { fetchAllTechNews } from '@/services/data-ingestion';
import { filterAndSummarizeNews } from '@/services/llm-processing';
import { sendDiscordNotification } from '@/services/discord-notifier';
import { saveHistory } from '@/services/storage';

// Vercel Cron syntax configuration (optional for MVP, allows long execution)
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('--- Starting Tech News Digest Workflow ---');

    // 1. Fetch Raw Data
    console.log('1. Fetching raw articles from sources...');
    
    // Test Mode (Local): Fetch only 3 per source. Production (Vercel): Fetch 10.
    const limit = process.env.NODE_ENV === 'development' ? 3 : 10;
    const rawArticles = await fetchAllTechNews(limit);

    if (rawArticles.length === 0) {
      return NextResponse.json({ success: false, message: 'No articles fetched.' });
    }

    // 2. AI Processing
    console.log(`2. Processing ${rawArticles.length} articles with LLM...`);
    const aiProcessedArticles = await filterAndSummarizeNews(rawArticles);

    // Map imageUrl back to avoid LLM tokens waste
    const processedArticles = aiProcessedArticles.map(p => {
      const raw = rawArticles.find(r => r.url === p.url);
      return { ...p, imageUrl: raw?.imageUrl };
    });

    // 3. Save to Local JSON History
    console.log(`3. Saving ${processedArticles.length} articles to history.json...`);
    await saveHistory(processedArticles);

    // 4. Send to Discord
    console.log(`4. Sending ${processedArticles.length} filtered articles to Discord...`);
    await sendDiscordNotification(processedArticles);

    console.log('--- Workflow Completed Successfully ---');
    
    return NextResponse.json({
      success: true,
      message: 'Digest workflow completed successfully.',
      articlesProcessed: processedArticles.length,
      data: processedArticles,
    });
  } catch (error: any) {
    console.error('Workflow failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
