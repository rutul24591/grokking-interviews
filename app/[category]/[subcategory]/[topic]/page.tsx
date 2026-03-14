import { notFound } from "next/navigation";
import { loadArticle } from "@/lib/article-loader";
import { getExampleGroups } from "@/lib/example-loader";
import { ExampleProvider } from "@/components/articles/ExampleProvider";
import { SubCategoryPageContent } from "@/components/SubCategoryPageContent";
import { parseFunctionalRequirements } from "@/lib/parseFunctionalRequirements";
import { Metadata } from "next";
import { Suspense } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

type PageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
    topic: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory, topic } = await params;

  if (category === "functional-requirements") {
    try {
      const functionalReqsPath = path.join(
        process.cwd(),
        "concepts",
        "system_design_functional_requirements.txt",
      );
      const functionalReqsRaw = await readFile(functionalReqsPath, "utf8");
      const parsed = parseFunctionalRequirements(functionalReqsRaw);
      const entry = parsed.find((cat) => cat.slug === subcategory);
      const group = entry?.groups.find((g) => g.slug === topic);

      if (!entry || !group) {
        return { title: "Not Found | Interview Prep Studio" };
      }

      return {
        title: `${group.name} | ${entry.name} | Interview Prep Studio`,
        description: `Functional requirements: ${group.name} items for ${entry.name}.`,
      };
    } catch {
      return { title: "Not Found | Interview Prep Studio" };
    }
  }

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

  if (category === "functional-requirements") {
    try {
      const functionalReqsPath = path.join(
        process.cwd(),
        "concepts",
        "system_design_functional_requirements.txt",
      );
      const functionalReqsRaw = await readFile(functionalReqsPath, "utf8");
      const parsed = parseFunctionalRequirements(functionalReqsRaw);
      const entry = parsed.find((cat) => cat.slug === subcategory);
      const group = entry?.groups.find((g) => g.slug === topic);

      if (!entry || !group) {
        notFound();
      }

      return (
        <SubCategoryPageContent
          categorySlug={category}
          subCategoryName="Functional Requirements"
          subcategorySlug={subcategory}
          itemName={group.name}
          topics={group.items}
          disableTopicLinks
        />
      );
    } catch {
      notFound();
    }
  }

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
