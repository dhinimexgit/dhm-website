import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPost } from "@/lib/posts";
import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "https://www.dhinimex.com/wp-content/uploads/2025/08/cover-slide.png";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="full-bleed relative overflow-hidden">
        <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[700px]">
          <Image src={heroImage} alt="Blog hero" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute left-1/2 top-20 z-20 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">Blog</p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
        
        {/* Article Header */}
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
            {post.tag}
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy sm:text-5xl">{post.title}</h1>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        {/* Featured Image */}
        {post.cover && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200">
            <Image 
              src={post.cover} 
              alt={post.title} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-slate max-w-none space-y-6 text-base leading-relaxed text-slate-700">
          {post.content && post.content.length > 0 ? (
            post.content.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed">{paragraph}</p>
            ))
          ) : (
            <p className="text-slate-500 italic">Content coming soon.</p>
          )}
        </article>

        {/* Back to Blog */}
        <div className="pt-8 border-t border-slate-200">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-navy transition hover:text-brand-red"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}


