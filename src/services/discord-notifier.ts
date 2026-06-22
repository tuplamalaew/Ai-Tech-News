import { ProcessedArticle } from '../types';

export async function sendDiscordNotification(articles: ProcessedArticle[]) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not set.');
    return;
  }

  if (articles.length === 0) {
    console.log('No articles to send to Discord.');
    return;
  }

  // Discord Embed limits: Max 10 embeds per message.
  // We slice to 10 to ensure the payload is accepted by Discord.
  const topArticles = articles.slice(0, 10);

  const embeds = topArticles.map((article) => {
    const isHN = article.source === 'Hacker News';
    const color = isHN ? 0xff6600 : 0x222222;
    const authorName = isHN ? 'Hacker News Top Stories' : 'Dev.to Fresh Articles';
    const authorIconUrl = isHN 
      ? 'https://cdn-icons-png.flaticon.com/512/174/174853.png' // Or an alternate HN icon, but wait, Flaticon 174853 is typically YC. Let's use a solid URL.
      : 'https://cdn-icons-png.flaticon.com/512/5969/5969051.png'; // Fallback to tech icon if dev.to not available
    
    // Using more reliable URLs:
    const hnIcon = 'https://icon.horse/icon/news.ycombinator.com';
    const devIcon = 'https://icon.horse/icon/dev.to';

    return {
      author: {
        name: authorName,
        icon_url: isHN ? hnIcon : devIcon,
      },
      title: `${article.emoji} ${article.title}`,
      url: article.url,
      description: article.summary,
      color: color,
      // Discord image proxy sometimes returns 500 if the URL is extremely long or complex
      thumbnail: article.imageUrl && article.imageUrl.length < 500 ? { url: article.imageUrl } : undefined,
      timestamp: new Date().toISOString(),
    };
  });

  // Create dynamic thread name for today's news
  const dateStr = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  const threadName = `📰 สรุปข่าวไอทีประจำวันที่ ${dateStr}`;

  const payload = {
    username: 'AI Tech Digest',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/8649/8649603.png', // Robot Icon
    content: '🚀 **สรุปข่าวสาร Tech Trend & AI ประจำวันของคุณมาแล้วครับ!**',
    embeds: embeds,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to send Discord message:', response.status, response.statusText);
    } else {
      console.log('Successfully sent digest to Discord.');
    }
  } catch (error) {
    console.error('Error sending to Discord:', error);
  }
}
