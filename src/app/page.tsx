import { getArticles, getTrendingArticles, getVideos } from "@/lib/news-data";
import NewsCard from "@/components/NewsCard";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  const articles = getArticles();
  const trending = getTrendingArticles();
  const videos = getVideos().slice(0, 3);
  
  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1, 7);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-8">
        {featuredArticle && <NewsCard article={featuredArticle} featured={true} />}
      </section>

      {/* Top Banner Ad */}
      <AdBanner dataAdSlot="1234567890" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content - Latest News */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 dark:border-gray-800 pb-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">Latest News</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar - Trending */}
        <div>
          <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-primary">Trending Now</h2>
          </div>
          
          <div className="space-y-6">
            {trending.map((article, index) => (
              <Link href={`/article/${article.id}`} key={article.id} className="group flex gap-4">
                <span className="text-4xl font-black text-gray-200 dark:text-gray-800 group-hover:text-primary transition-colors">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="uppercase text-primary font-bold">{article.category}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="flex flex-wrap gap-2">
              {['Politics', 'Sports', 'Tech', 'Entertainment', 'World'].map(cat => (
                <Link 
                  key={cat} 
                  href={`/category/${cat.toLowerCase()}`}
                  className="px-3 py-1 bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <section className="mt-16 bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight">Video Highlights</h2>
          <Link href="/videos" className="flex items-center text-primary font-semibold hover:underline">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
