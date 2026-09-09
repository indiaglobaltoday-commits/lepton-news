import fs from 'fs';
import path from 'path';

export type Category = 'politics' | 'sports' | 'tech' | 'entertainment' | 'viral' | 'world' | 'finance';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  image: string;
  videoUrl?: string;
  date: string;
  source: string;
  author: string;
  trending?: boolean;
  breaking?: boolean;
  originalUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  category: Category;
  date: string;
}

function loadArticlesFromFile(): Article[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'articles.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const articles = JSON.parse(data) as Article[];
    return articles;
  } catch {
    // Return placeholder articles if file doesn't exist yet
    return getPlaceholderArticles();
  }
}

function getPlaceholderArticles(): Article[] {
  return [
    {
      id: 'placeholder-1',
      title: 'Lepton News में आपका स्वागत है',
      excerpt: 'Lepton News पर ताज़ा खबरें, ब्रेकिंग न्यूज़, और गहन विश्लेषण पढ़ें।',
      content: 'Lepton News एक आधुनिक हिंदी समाचार वेबसाइट है जो आपको दुनिया भर की ताज़ा खबरें देती है।\n\nहमारी टीम 24/7 काम करती है ताकि आपको सबसे पहले और सबसे सटीक खबरें मिलें।\n\nराजनीति, खेल, तकनीक, मनोरंजन, वित्त और विश्व समाचार — सब एक जगह।\n\nLepton News पर बने रहें, खबरों से जुड़े रहें।',
      category: 'world',
      image: 'https://picsum.photos/seed/lepton/800/600',
      date: new Date().toISOString(),
      source: 'Lepton News',
      author: 'Lepton News',
      breaking: true,
      trending: true
    }
  ];
}

// Cache articles in memory, refresh every 60 seconds
let cachedArticles: Article[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

function getArticlesWithCache(): Article[] {
  const now = Date.now();
  if (!cachedArticles || now - lastCacheTime > CACHE_TTL) {
    cachedArticles = loadArticlesFromFile();
    lastCacheTime = now;
  }
  return cachedArticles;
}

export const videos: Video[] = [];

export function getArticles(): Article[] {
  return getArticlesWithCache();
}

export function getArticleById(id: string): Article | undefined {
  return getArticlesWithCache().find(article => article.id === id);
}

export function getArticlesByCategory(category: Category): Article[] {
  return getArticlesWithCache().filter(article => article.category === category);
}

export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return getArticlesWithCache().filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) || 
    article.excerpt.toLowerCase().includes(lowercaseQuery)
  );
}

export function getVideos(): Video[] {
  return videos;
}

export function getTrendingArticles(): Article[] {
  return getArticlesWithCache().filter(article => article.trending);
}

export function getBreakingNews(): Article[] {
  return getArticlesWithCache().filter(article => article.breaking);
}
