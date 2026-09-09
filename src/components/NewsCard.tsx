import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/news-data";

export default function NewsCard({ article, featured = false }: { article: Article, featured?: boolean }) {
  return (
    <div className={`group relative bg-white dark:bg-dark border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? 'md:grid md:grid-cols-2 md:gap-6 md:border-none md:shadow-none md:hover:shadow-none md:bg-transparent' : 'flex flex-col h-full'}`}>
      <Link href={`/article/${article.id}`} className={`block overflow-hidden relative ${featured ? 'h-64 md:h-[400px] rounded-xl' : 'h-48'}`}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md">
            {article.category}
          </span>
        </div>
      </Link>
      
      <div className={`flex flex-col ${featured ? 'justify-center py-6 md:py-0 md:px-4' : 'p-4 flex-grow'}`}>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2 space-x-2">
          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>•</span>
          <span className="uppercase">{article.source}</span>
        </div>
        
        <Link href={`/article/${article.id}`}>
          <h2 className={`font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight mb-3 ${featured ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-xl'}`}>
            {article.title}
          </h2>
        </Link>
        
        <p className={`text-gray-600 dark:text-gray-300 line-clamp-3 ${featured ? 'text-lg md:text-xl' : 'text-sm'}`}>
          {article.excerpt}
        </p>
      </div>
    </div>
  );
}
