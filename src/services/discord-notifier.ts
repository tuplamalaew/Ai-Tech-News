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
    // Distinguish source by color (Orange for HN, Dark Gray for Dev.to)
    const color = article.source === 'Hacker News' ? 0xff6600 : 0x222222;
    
    return {
      title: article.title,
      url: article.url,
      description: article.summary,
      color: color,
      footer: {
        text: `Source: ${article.source}`
      },
      timestamp: new Date().toISOString(),
    };
  });

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
