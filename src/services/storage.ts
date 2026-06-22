import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ProcessedArticle } from '../types';

// ใช้แฟ้ม /tmp ซึ่ง Vercel อนุญาตให้เขียนไฟล์ชั่วคราวได้
const DATA_DIR = path.join(os.tmpdir(), 'ai-tech-news-data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

export async function saveHistory(articles: ProcessedArticle[]) {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Overwrite history with the latest digest
    const data = {
      lastUpdated: new Date().toISOString(),
      articles,
    };

    await fs.writeFile(HISTORY_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Successfully saved history to JSON file.');
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

export async function getHistory(): Promise<{ lastUpdated: string; articles: ProcessedArticle[] } | null> {
  try {
    const fileContent = await fs.readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}
