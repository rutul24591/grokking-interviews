import { notFound } from "next/navigation";
import { loadArticle } from "@/lib/article-loader";
import { getExampleGroups } from "@/lib/example-loader";
import { ExampleProvider } from "@/components/articles/ExampleProvider";
import { Metadata } from "next";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
    topic: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory, topic } = await params;
  const article = await loadArticle(category, subcategory, topic);

  if (!article) {
    return {
      title: "Article Not Found | Interview Prep Studio",
    };
  }

  return {
    title: `${article.metadata.title} | Interview Prep Studio`,
    description: article.metadata.description,
    keywords: article.metadata.tags.join(", "),
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: "article",
      url: `/${category}/${subcategory}/${topic}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, subcategory, topic } = await params;
  const article = await loadArticle(category, subcategory, topic);
  const exampleGroups = await getExampleGroups(category, subcategory, topic);

  if (!article) {
    notFound();
  }

  const ArticleComponent = article.component;
  return (
    <Suspense fallback={<ArticleLoadingFallback />}>
      <ExampleProvider examples={exampleGroups}>
        <ArticleComponent />
      </ExampleProvider>
    </Suspense>
  );
}

function ArticleLoadingFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-3/4 rounded bg-panel-soft" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-panel-soft" />
        <div className="h-4 w-5/6 rounded bg-panel-soft" />
        <div className="h-4 w-4/5 rounded bg-panel-soft" />
      </div>
    </div>
  );
}

// Enable static generation for all articles
export async function generateStaticParams() {
  // This will be populated as articles are created
  // For now, return empty array to enable dynamic rendering
  return [];
}
