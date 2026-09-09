/**
 * Article Generator for Lepton News Website
 * 
 * Fetches news from RSS feeds, uses Gemini to write detailed Hindi articles,
 * and saves them to the website's data directory for Next.js to render.
 * 
 * Runs every 30 minutes via PM2.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '/Users/abhishek/.gemini/antigravity/scratch/news-posting-automation/.env' });

import RSSParser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_FILE = path.join(__dirname, 'public', 'articles.json');
const HISTORY_FILE = path.join(__dirname, 'article_history.json');
const MAX_ARTICLES = 200; // Keep last 200 articles on website

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const FEEDS = {
    politics: [
        'https://feeds.feedburner.com/ndtvnews-top-stories',
        'https://www.indiatoday.in/rss/home',
        'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    ],
    world: [
        'https://feeds.bbci.co.uk/news/world/rss.xml',
        'http://rss.cnn.com/rss/edition.rss',
        'https://www.aljazeera.com/xml/rss/all.xml',
        'https://www.theguardian.com/world/rss',
        'https://feeds.washingtonpost.com/rss/world',
        'https://www.japantimes.co.jp/feed/topstories/',
        'https://en.yna.co.kr/RSS/news.xml',
        'https://www.themoscowtimes.com/rss/news',
        'https://news.google.com/rss/search?q=china+news+english&hl=en-US&gl=US&ceid=US:en',
    ],
    finance: [
        'https://news.google.com/rss/search?q=bloomberg+finance+markets&hl=en-US&gl=US&ceid=US:en',
        'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
        'https://search.cnbc.com/rs/search/combinedcms/view.xml?profile=100001402',
        'https://finance.yahoo.com/news/rss',
        'https://www.livemint.com/rss/news',
        'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
        'https://www.moneycontrol.com/rss/business.xml',
    ],
    sports: [
        'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
        'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
    ],
    entertainment: [
        'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
        'https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml',
    ],
    tech: [
        'https://techcrunch.com/feed/',
        'https://www.theverge.com/rss/index.xml',
        'https://gadgets360.com/rss/news',
        'https://www.thehindu.com/sci-tech/science/feeder/default.rss',
    ],
    viral: [
        'https://news.google.com/rss/search?q=viral+trending+india&hl=en-IN&gl=IN&ceid=IN:en',
    ]
};

const parser = new RSSParser({
    customFields: {
        item: [
            ['media:content', 'mediaContent', { keepArray: false }],
            ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
        ]
    }
});

function loadHistory() {
    try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8')); }
    catch { return { processedUrls: [] }; }
}

function saveHistory(h) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(h, null, 2));
}

function loadArticles() {
    try { return JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8')); }
    catch { return []; }
}

function saveArticles(articles) {
    const dir = path.dirname(ARTICLES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
}

function extractImage(item) {
    if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) return item.mediaContent.$.url;
    if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) return item.mediaThumbnail.$.url;
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    // Try to extract from content
    const content = item['content:encoded'] || item.content || '';
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) return imgMatch[1];
    return null;
}

import { GoogleGenAI } from '@google/genai';

const GEMINI_KEYS = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];

async function callGemini(prompt) {
    for (const key of GEMINI_KEYS) {
        for (const model of MODELS) {
            try {
                const client = new GoogleGenAI({ apiKey: key });
                const res = await client.models.generateContent({
                    model,
                    contents: prompt,
                    config: { temperature: 0.7, maxOutputTokens: 4096 }
                });
                return res.text || '';
            } catch (e) {
                if (e.message?.includes('429') || e.message?.includes('quota')) continue;
                throw e;
            }
        }
    }
    throw new Error('All Gemini keys/models exhausted');
}

async function generateArticle(item, category) {
    const prompt = `You are a senior journalist at "Lepton News", a premium Hindi news website.

Write a detailed, well-structured news article in Hindi (Devanagari script) based on this news:

Title: ${item.title}
Summary: ${item.contentSnippet || item.content || ''}
Source: ${item.creator || item.source || 'News Agency'}

RULES:
1. Write the article ENTIRELY in Hindi (Devanagari script). Only proper nouns, brand names, and technical terms can be in English.
2. Article MUST be 500-800 words long (detailed, not superficial).
3. Structure:
   - Opening paragraph: Key facts (Who, What, When, Where)
   - 2-3 body paragraphs: Details, background, context
   - Expert opinion or analysis paragraph
   - Closing paragraph: What's next / implications
4. Write a compelling Hindi headline (different from original, more engaging)
5. Write a 2-line Hindi excerpt/summary
6. Determine if this is breaking/trending news
7. Generate a relevant image search query in English

Return ONLY valid JSON (no markdown, no code blocks):
{
    "headline": "Hindi headline here",
    "excerpt": "2-line Hindi summary here",
    "content": "Full article in Hindi with paragraphs separated by \\n\\n",
    "isBreaking": boolean,
    "isTrending": boolean,
    "imageQuery": "English search query for relevant image",
    "author": "Lepton News"
}`;

    const response = await callGemini(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');
    return JSON.parse(jsonMatch[0]);
}

async function fetchImageUrl(query) {
    // Use picsum as reliable fallback with a deterministic seed from the query
    const seed = crypto.createHash('md5').update(query).digest('hex').substring(0, 8);
    return `https://picsum.photos/seed/${seed}/800/600`;
}

async function processCategory(category, feedUrls, history) {
    const newArticles = [];
    
    for (const feedUrl of feedUrls) {
        try {
            const feed = await parser.parseURL(feedUrl);
            
            for (const item of feed.items.slice(0, 3)) { // Top 3 from each feed
                const key = item.link || item.guid;
                if (!key || history.processedUrls.includes(key)) continue;
                
                console.log(`  📝 Writing article: ${item.title?.substring(0, 60)}...`);
                
                try {
                    const article = await generateArticle(item, category);
                    const id = crypto.createHash('md5').update(key).digest('hex').substring(0, 12);
                    
                    // Try to get image from RSS first, fallback to generated
                    let image = extractImage(item);
                    if (!image) {
                        image = await fetchImageUrl(article.imageQuery || item.title);
                    }
                    
                    newArticles.push({
                        id,
                        title: article.headline || item.title,
                        excerpt: article.excerpt || item.contentSnippet || '',
                        content: article.content || '',
                        category,
                        image,
                        date: item.isoDate || item.pubDate || new Date().toISOString(),
                        source: item.creator || item.source?.name || feedUrl.match(/\/\/([^/]+)/)?.[1] || 'Lepton News',
                        author: article.author || 'Lepton News',
                        trending: article.isTrending || false,
                        breaking: article.isBreaking || false,
                        originalUrl: key
                    });
                    
                    history.processedUrls.push(key);
                    
                    // Rate limit: wait 2s between Gemini calls
                    await new Promise(r => setTimeout(r, 2000));
                    
                } catch (e) {
                    console.error(`  ❌ Article generation failed: ${e.message}`);
                }
            }
        } catch (e) {
            console.error(`  ⚠️ Feed error (${feedUrl}): ${e.message}`);
        }
    }
    
    return newArticles;
}

async function run() {
    console.log('\n========================================');
    console.log('📰 LEPTON NEWS — Article Generator');
    console.log(`⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    console.log('========================================\n');
    
    if (!GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        return;
    }
    
    const history = loadHistory();
    const existingArticles = loadArticles();
    let allNewArticles = [];
    
    const categories = Object.keys(FEEDS);
    
    // Process 2-3 categories per run (rotate through them)
    const runIndex = Math.floor(Date.now() / (30 * 60 * 1000)) % categories.length;
    const selectedCategories = [];
    for (let i = 0; i < 3; i++) {
        selectedCategories.push(categories[(runIndex + i) % categories.length]);
    }
    
    console.log(`📂 Categories this run: ${selectedCategories.join(', ')}\n`);
    
    for (const category of selectedCategories) {
        console.log(`\n🏷️ Processing: ${category.toUpperCase()}`);
        const articles = await processCategory(category, FEEDS[category], history);
        allNewArticles.push(...articles);
        console.log(`  ✅ ${articles.length} new articles generated`);
    }
    
    if (allNewArticles.length > 0) {
        // Prepend new articles (newest first)
        const combined = [...allNewArticles, ...existingArticles].slice(0, MAX_ARTICLES);
        saveArticles(combined);
        console.log(`\n✅ Saved ${allNewArticles.length} new articles. Total: ${combined.length}`);
    } else {
        console.log('\n⚠️ No new articles generated this run.');
    }
    
    // Trim history
    if (history.processedUrls.length > 1000) {
        history.processedUrls = history.processedUrls.slice(-500);
    }
    saveHistory(history);
    
    console.log('\n✅ Article generation complete!\n');
}

// Run immediately, then every 30 minutes
run().catch(console.error);
setInterval(() => run().catch(console.error), 30 * 60 * 1000);

console.log('📰 Lepton News Article Generator — running every 30 minutes');
