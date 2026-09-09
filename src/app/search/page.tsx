import SearchBar from "@/components/SearchBar";
import { searchArticles } from "@/lib/news-data";
import NewsCard from "@/components/NewsCard";

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const results = query ? searchArticles(query) : [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-6">
          Search NewsFlash
        </h1>
        <SearchBar initialQuery={query} />
      </div>

      {query && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2">
            Search results for "{query}"
          </h2>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No results found for "{query}". Try a different keyword.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
