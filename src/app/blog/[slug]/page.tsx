import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { posts, getPost } from "@/data/site-content";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogDetailPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) {
    notFound();
  }
  return (
    <article className="space-y-8 pb-12">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          {post.tag}
        </p>
        <h1 className="text-4xl font-semibold text-brand-navy">{post.title}</h1>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          {new Date(post.date).toLocaleDateString()}
        </p>
      </header>
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200">
        <Image src={post.cover} alt="" fill className="object-cover" sizes="100vw" />
      </div>
      <div className="space-y-4 text-base text-slate-700">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}


