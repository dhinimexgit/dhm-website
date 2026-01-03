import Image from "next/image";
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  tag?: "News" | "Event" | "Insight";
};

type Props = {
  posts: Post[];
};

const tagColors = {
  News: "bg-blue-100 text-blue-700",
  Event: "bg-purple-100 text-purple-700",
  Insight: "bg-emerald-100 text-emerald-700",
};

export function BlogSection({ posts }: Props) {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--brand-navy) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-red">
              <span className="h-px w-8 bg-brand-red" />
              Latest Insights
            </p>
            <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl lg:text-5xl">
              From Our Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-all hover:bg-brand-navy hover:text-white"
          >
            View all articles
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Blog Cards Grid - JP Morgan Style */}
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Category Tag */}
                {/* {post.tag && (
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${tagColors[post.tag]}`}>
                    {post.tag.toUpperCase()}
                  </span>
                )} */}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Tag Label */}
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-red">
                  {post.tag || "Article"}
                </p>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-red">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                {/* Date */}
                <p className="mb-3 text-sm text-slate-500">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {/* Excerpt */}
                <p className="mb-4 flex-1 text-sm text-slate-600 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="group/link inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition hover:gap-3"
                >
                  Read more
                  <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

