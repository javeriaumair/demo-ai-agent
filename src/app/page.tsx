import { ArticleForm } from "@/components/ArticleForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
      <header className="mb-8 text-center sm:mb-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Likho<span className="text-accent">AI</span>
        </h1>
        <p className="mt-3 text-base text-muted sm:text-lg">
          SEO-ready articles in English, Urdu &amp; Roman Urdu — in seconds.
        </p>
      </header>

      <ArticleForm />
    </main>
  );
}
