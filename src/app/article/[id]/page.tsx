import { getArticleById, getArticlesByCategory } from "@/lib/news-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Facebook, Link2 } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import AdBanner from "@/components/AdBanner";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = getArticleById(params.id);

  if (!article) {
    notFound();
  }

  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AdBanner dataAdSlot="0987654321" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6">
        {/* Main Article Content */}
        <article className="lg:col-span-2">
          <div className="mb-6">
            <Link href={`/category/${article.category}`} className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-sm mb-4 hover:bg-red-700 transition-colors">
              {article.category}
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 font-medium">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-800 mb-8">
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white">By {article.author}</span>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>Source: {article.source}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" aria-label="Share on Twitter"><Twitter className="w-5 h-5" /></button>
                <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors" aria-label="Share on Facebook"><Facebook className="w-5 h-5" /></button>
                <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Copy Link"><Link2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <div className="relative aspect-[21/9] w-full mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image 
              src={article.image} 
              alt={article.title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6">{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Sidebar - Related Articles */}
        <aside>
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Related News</h2>
            </div>
            <div className="space-y-6">
              {relatedArticles.map(related => (
                <NewsCard key={related.id} article={related} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
