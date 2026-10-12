import { ArticleForm } from "@/components/ArticleForm";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          New <span className="text-brand-gradient">Article</span>
        </h1>
        <p className="mt-2 text-muted">
          Enter a keyword and choose your options — LikhoAI will write the rest.
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}
