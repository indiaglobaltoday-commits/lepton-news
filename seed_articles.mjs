import { GoogleGenAI } from '@google/genai';
import RSSParser from 'rss-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config({ path: '../news-posting-automation/.env' });

const keys = process.env.GEMINI_API_KEY.split(',').map(k => k.trim()).filter(Boolean);
const parser = new RSSParser();
const articles = [];

const feeds = [
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', cat: 'politics' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', cat: 'world' },
  { url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', cat: 'finance' },
  { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', cat: 'sports' },
  { url: 'https://techcrunch.com/feed/', cat: 'tech' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms', cat: 'entertainment' },
  { url: 'http://rss.cnn.com/rss/edition.rss', cat: 'world' },
  { url: 'https://www.livemint.com/rss/news', cat: 'finance' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', cat: 'world' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms', cat: 'sports' },
  { url: 'https://news.google.com/rss/search?q=viral+trending+india&hl=en-IN&gl=IN&ceid=IN:en', cat: 'viral' },
  { url: 'https://www.indiatoday.in/rss/home', cat: 'politics' },
];

let keyIdx = 0;
function getKey() { return keys[keyIdx++ % keys.length]; }

async function writeArticle(title, snippet, category) {
  const client = new GoogleGenAI({ apiKey: getKey() });
  const res = await client.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: `You are a senior Hindi journalist at Lepton News. Write a detailed 400-word news article in Hindi (Devanagari script) about this news:

Title: ${title}
Summary: ${snippet || 'N/A'}

Return ONLY valid JSON (no markdown):
{"headline":"compelling Hindi headline","excerpt":"2-line Hindi summary","content":"full 400-word Hindi article with paragraphs separated by \\n\\n","isBreaking":false,"isTrending":false}`,
    config: { temperature: 0.7, maxOutputTokens: 2048 }
  });
  const text = res.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');
  return JSON.parse(jsonMatch[0]);
}

console.log(`\n📰 Seeding Lepton News with articles from ${feeds.length} feeds...\n`);
console.log(`🔑 Using ${keys.length} Gemini API keys\n`);

for (const f of feeds) {
  try {
    const feed = await parser.parseURL(f.url);
    const items = feed.items.slice(0, 2); // 2 articles per feed
    for (const item of items) {
      try {
        console.log(`[${f.cat}] ✍️  ${item.title?.substring(0, 60)}...`);
        const art = await writeArticle(item.title, item.contentSnippet, f.cat);
        const id = crypto.createHash('md5').update(item.link || item.guid || item.title).digest('hex').substring(0, 12);
        const seed = crypto.createHash('md5').update(item.title || '').digest('hex').substring(0, 8);
        
        // Try to extract image from RSS
        let image = null;
        const content = item['content:encoded'] || item.content || '';
        const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
        if (imgMatch) image = imgMatch[1];
        if (item.enclosure?.url) image = item.enclosure.url;
        if (!image) image = `https://picsum.photos/seed/${seed}/800/600`;
        
        articles.push({
          id,
          title: art.headline || item.title,
          excerpt: art.excerpt || '',
          content: art.content || '',
          category: f.cat,
          image,
          date: item.isoDate || item.pubDate || new Date().toISOString(),
          source: f.url.match(/\/\/([^/]+)/)?.[1] || 'Lepton News',
          author: 'Lepton News',
          trending: art.isTrending || false,
          breaking: art.isBreaking || false,
          originalUrl: item.link || ''
        });
        console.log(`       ✅ Done: ${art.headline?.substring(0, 50)}`);
      } catch (e) {
        console.error(`       ❌ ${e.message?.substring(0, 80)}`);
      }
    }
  } catch (e) {
    console.error(`⚠️ Feed error [${f.cat}]: ${e.message?.substring(0, 50)}`);
  }
}

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/articles.json', JSON.stringify(articles, null, 2));
console.log(`\n🎉 DONE! ${articles.length} articles saved to public/articles.json\n`);
