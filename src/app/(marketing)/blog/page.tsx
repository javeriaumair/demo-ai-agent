import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { primaryButtonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <section className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-brand bg-brand-gradient shadow-lg shadow-fuchsia-500/25">
          <BookOpen className="size-8 text-white" aria-hidden />
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Blog coming soon</h1>
        <p className="mt-4 text-lg text-muted">
          SEO tips, writing guides and LikhoAI updates — in English and Urdu. Stay tuned!
        </p>
        <Link href="/" className={`${primaryButtonClass} mt-8`}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
