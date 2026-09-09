import { getBreakingNews } from "@/lib/news-data";
import Link from "next/link";

export default function BreakingTicker() {
  const breakingNews = getBreakingNews();

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-dark text-white flex items-center h-10 overflow-hidden relative border-b-2 border-primary">
      <div className="bg-primary text-white font-bold px-4 h-full flex items-center z-10 whitespace-nowrap uppercase tracking-wider text-sm shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
        Breaking News
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-8">
          {breakingNews.map((news) => (
            <Link href={`/article/${news.id}`} key={news.id} className="hover:text-primary transition-colors text-sm flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full inline-block mr-2"></span>
              {news.title}
            </Link>
          ))}
          {/* Duplicate for seamless loop */}
          {breakingNews.map((news) => (
            <Link href={`/article/${news.id}`} key={`${news.id}-dup`} className="hover:text-primary transition-colors text-sm flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full inline-block mr-2"></span>
              {news.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
