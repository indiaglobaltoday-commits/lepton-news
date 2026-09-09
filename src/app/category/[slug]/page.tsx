import { getArticlesByCategory, Category } from "@/lib/news-data";
import NewsCard from "@/components/NewsCard";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const validCategories: Category[] = ['politics', 'sports', 'tech', 'entertainment', 'viral', 'world'];
  const category = params.slug as Category;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const articles = getArticlesByCategory(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 border-b-4 border-primary inline-block pb-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
          {category} News
        </h1>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">No articles found in this category.</p>
      )}
    </div>
  );
}
