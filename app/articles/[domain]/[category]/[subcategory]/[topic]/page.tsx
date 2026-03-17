import { notFound } from "next/navigation";
import { loadArticle } from "@/lib/loadArticle";

type ArticlePageProps = {
  params: Promise<{
    domain: string;
    category: string;
    subcategory: string;
    topic: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  
  const article = await loadArticle(resolvedParams);

  if (!article) {
    notFound();
  }

  const ArticleComponent = article.component;

  return <ArticleComponent />;
}

/**
 * Generate static params for all articles in the registry
 */
export async function generateStaticParams() {
  const paths = await import("@/lib/loadArticle").then((m) => m.getAllArticlePaths());
  
  return paths.map((path) => ({
    domain: path.domain,
    category: path.category,
    subcategory: path.subcategory,
    topic: path.topic,
  }));
}

/**
 * Generate metadata for the article
 */
export async function generateMetadata({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  
  // Map category slug from URL to registry format
  const registryCategory = resolvedParams.category.replace("-concepts", "");
  const registryKey = `${registryCategory}/${resolvedParams.subcategory}/${resolvedParams.topic}`;

  const { getArticleMetadata } = await import("@/lib/loadArticle");
  const metadata = getArticleMetadata(registryKey);

  if (!metadata) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${metadata.title} | Interview Prep Studio`,
    description: metadata.description,
    keywords: metadata.tags.join(", "),
  };
}
