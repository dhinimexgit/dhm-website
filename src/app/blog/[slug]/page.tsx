"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/components/home/sticky-header";

// Hero background image fallback - High resolution corporate/infrastructure themed
const heroImageFallback = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=90";

// Fallback images for posts without covers - high-resolution, diverse images
const postFallbackImages = [
  "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=1600&q=90", // Power lines infrastructure
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=90", // Solar panel installation
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=90", // Engineers working
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=90", // Team collaboration
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=90", // Construction crane
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1600&q=90", // Tech/Innovation
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=90", // Electrical worker
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=90", // Business meeting
];

// Helper function to get fallback image based on index
const getFallbackImage = (index: number) => postFallbackImages[index % postFallbackImages.length];

// Helper to get image - uses post cover if unique, otherwise uses varied fallback
const getPostImage = (post: Post, index: number, allPosts: Post[]) => {
  // If no cover, use fallback
  if (!post.cover) return getFallbackImage(index);
  
  // Check if this cover is used by multiple posts (duplicate)
  const coverCount = allPosts.filter(p => p.cover === post.cover).length;
  
  // If duplicate cover, use varied fallback for visual diversity
  if (coverCount > 1) {
    return getFallbackImage(index);
  }
  
  return post.cover;
};

interface Post {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  cover: string;
  content: string[];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default function BlogDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch post on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const { getPost, getAllPosts } = await import("@/lib/posts");
        const fetchedPost = await getPost(slug);
        if (!fetchedPost) {
          notFound();
        }
        setPost(fetchedPost);
        
        // Fetch related posts
        const allPosts = await getAllPosts();
        const related = allPosts
          .filter(p => p.slug !== slug)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error fetching post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close on escape key or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [searchOpen]);

  // Calculate reading time
  const calculateReadingTime = (content: string[]) => {
    const words = content.join(" ").split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? "1 min read" : `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-navy" />
          <p className="text-sm text-slate-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div className="bg-white">
        {/* Header Section with Navbar */}
        <section className="relative overflow-hidden bg-brand-navy">
          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 py-6">
              <div className="relative rounded-xl bg-brand-navy">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex-shrink-0">
                    <Image
                      src="/logo-dhinimex.png"
                      alt="Dhinimex logo"
                      width={160}
                      height={46}
                      priority
                      className="h-auto w-[160px]"
                    />
                  </Link>
                  <nav className="flex items-center gap-8 text-[15px] font-medium text-white">
                    <Link href="/about" className="group relative transition hover:text-white/80">
                      About Us
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <div className="group relative">
                      <Link href="/business" className="flex items-center gap-1.5 transition hover:text-white/80">
                        Business Portfolio
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-xl bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <Link href="/business/trading" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Trading</Link>
                        <Link href="/business/manufacturing" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Manufacturing</Link>
                        <Link href="/business/electricity" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Electricity Distribution</Link>
                        <Link href="/business/water-supply" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Water Supply</Link>
                        <Link href="/business/scientific" className="block rounded-lg px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">Scientific</Link>
                      </div>
                    </div>
                    <Link href="/services" className="group relative transition hover:text-white/80">
                      Services
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/products" className="group relative transition hover:text-white/80">
                      Products
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                    {/* Blog - Active */}
                    <Link href="/blog" className="group relative transition hover:text-white/80">
                      Blog
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red" />
                    </Link>
                    <Link href="/careers" className="group relative transition hover:text-white/80">
                      Careers
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand-red transition-all group-hover:w-full" />
                    </Link>
                  </nav>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSearchOpen(!searchOpen)}
                      className={`p-2 transition ${searchOpen ? "text-white" : "text-white/80 hover:text-white"}`}
                      aria-label="Search"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <span className="text-white/30">|</span>
                    <Link href="mailto:info@dhinimex.com.kh" className="p-2 text-white/80 transition hover:text-white" aria-label="Email">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </Link>
                    <Link href="/contact-us" className="rounded-lg bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c91e21]">
                      Contact Us
                    </Link>
                  </div>
                </div>

                {/* Search Dropdown */}
                {searchOpen && (
                  <div
                    ref={searchPanelRef}
                    className="absolute left-0 right-0 top-full z-50 mt-4 rounded-xl bg-white shadow-2xl"
                  >
                    <div className="px-8 py-4">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for services, products, careers..."
                            className="w-full rounded-lg bg-slate-100 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:shadow-inner"
                          />
                        </div>
                        <button type="submit" className="rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90">Search</button>
                        <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">Cancel</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Header - Clean White Background */}
        <section className="border-b border-slate-100 bg-white py-8 lg:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link href="/blog" className="text-slate-500 transition hover:text-brand-navy">Blog</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400">{post.tag || "Article"}</span>
            </nav>

            {/* Meta Row */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {post.tag || "News"}
              </span>
              <span className="text-sm text-slate-400">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {post.content && post.content.length > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-slate-400">
                    {calculateReadingTime(post.content)}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold leading-tight text-brand-navy sm:text-4xl lg:text-5xl lg:leading-tight">
              {post.title}
            </h1>

            {/* Excerpt / Lead */}
            {post.excerpt && (
              <p className="text-lg leading-relaxed text-slate-600 lg:text-xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Featured Image */}
        {post.cover && (
          <section className="bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={post.cover || heroImageFallback}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <article className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Content */}
            <div className="prose prose-lg prose-slate max-w-none">
              {post.content && post.content.length > 0 ? (
                post.content.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="mb-6 text-[17px] leading-[1.8] text-slate-700"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <p className="italic text-slate-500">Content coming soon.</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tag && (
              <div className="mt-12 border-t border-slate-200 pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">Tags:</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {post.tag}
                  </span>
                </div>
              </div>
            )}

            {/* Share & Navigation */}
            <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-xl bg-slate-50 p-6 sm:flex-row">
              {/* Back to Blog */}
              <Link 
                href="/blog" 
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition hover:text-brand-red"
              >
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to all stories
              </Link>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Share:</span>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-brand-navy hover:text-white"
                  aria-label="Share on Twitter"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-brand-navy hover:text-white"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-brand-navy hover:text-white"
                  aria-label="Share on Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-brand-navy hover:text-white"
                  aria-label="Copy link"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-slate-100 bg-slate-50 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-red">
                    Keep Reading
                  </p>
                  <h2 className="text-2xl font-bold text-brand-navy lg:text-3xl">
                    More Stories
                  </h2>
                </div>
                <Link 
                  href="/blog" 
                  className="group hidden items-center gap-2 rounded-full border border-brand-navy px-5 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white sm:inline-flex"
                >
                  View all stories
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost, index) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group block">
                    <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={getPostImage(relatedPost, index, relatedPosts)}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-brand-red">
                            {relatedPost.tag || "News"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400">
                            {new Date(relatedPost.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-brand-navy transition-colors group-hover:text-brand-red">
                          {relatedPost.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Mobile View All Button */}
              <div className="mt-8 text-center sm:hidden">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
                >
                  View all stories
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
