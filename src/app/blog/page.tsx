"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/components/home/sticky-header";

// Hero background image - High resolution corporate/infrastructure themed
const heroImage = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=90";

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

// Mock posts data (will be replaced with actual data fetch in production)
// Using placeholder structure matching the Post type
interface Post {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  cover: string;
}

// Categories for filtering
const categories = [
  { id: "all", label: "All Stories" },
  { id: "company", label: "Company" },
  { id: "culture", label: "Culture" },
  { id: "projects", label: "Projects" },
  { id: "insights", label: "Insights" },
];

export default function BlogPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { getAllPosts } = await import("@/lib/posts");
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

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

  // Filter posts by category
  const filteredPosts = activeCategory === "all" 
    ? posts 
    : posts.filter(post => post.tag?.toLowerCase() === activeCategory.toLowerCase());

  const featuredPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1, 3);
  const remainingPosts = filteredPosts.slice(3);

  return (
    <>
      <StickyHeader isVisible={isScrolled} />

      <div className="pb-20">
        {/* Hero Banner Section */}
        <section className="relative min-h-[60vh] overflow-hidden lg:min-h-[70vh]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Dhinimex Blog"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>

          {/* Header - Desktop Only */}
          <div className="relative z-30 hidden lg:block">
            <div className="mx-auto max-w-7xl px-8 pt-6">
              <div className="relative rounded-xl bg-brand-navy shadow-lg">
                <div className="flex items-center justify-between px-8 py-4">
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
                    className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white shadow-2xl"
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

          {/* Hero Content */}
          <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex min-h-[calc(60vh-120px)] items-end pb-16 pt-24 lg:min-h-[calc(70vh-120px)] lg:pb-20 lg:pt-0 lg:pt-4">
              <div className="max-w-3xl space-y-6">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                  <span className="h-px w-8 bg-brand-red" />
                  Blog
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[64px] xl:leading-[1.1]">
                  Stories From the Teams Powering Cambodia&apos;s Growth
                </h1>
                <p className="max-w-xl text-lg text-white/80">
                  Discover insights, project highlights, and company culture from across our business units.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {loading ? (
            // Loading State
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-navy" />
                <p className="text-sm text-slate-500">Loading stories...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            // Empty State
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-brand-navy">No stories found</h3>
              <p className="text-slate-500">Check back soon for new content in this category.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Post - Large Card */}
              {featuredPost && (
                <section>
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <article className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 lg:aspect-[4/3]">
                        <Image
                          src={getPostImage(featuredPost, 0, filteredPosts)}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex flex-col justify-center">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-red">
                            {featuredPost.tag || "Featured"}
                          </span>
                          <span className="text-sm text-slate-400">
                            {new Date(featuredPost.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold text-brand-navy transition-colors group-hover:text-brand-red lg:text-4xl">
                          {featuredPost.title}
                        </h2>
                        <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-slate-600">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy transition-colors group-hover:text-brand-red">
                          Read full story
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                </section>
              )}

              {/* Secondary Posts - Two Column */}
              {secondaryPosts.length > 0 && (
                <section>
                  <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-brand-navy">Recent Stories</h3>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2">
                    {secondaryPosts.map((post, index) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                              src={getPostImage(post, index + 1, filteredPosts)}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="flex flex-1 flex-col p-6">
                            <div className="mb-3 flex items-center gap-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                {post.tag || "News"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <h4 className="mb-2 text-xl font-semibold text-brand-navy transition-colors group-hover:text-brand-red">
                              {post.title}
                            </h4>
                            <p className="mb-4 flex-grow line-clamp-2 text-sm leading-relaxed text-slate-500">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-brand-navy transition-colors group-hover:text-brand-red">
                              Read more
                              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* All Posts Grid */}
              {remainingPosts.length > 0 && (
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-brand-navy">More Stories</h3>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {remainingPosts.map((post, index) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                        <article className="h-full overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-300 hover:border-slate-200 hover:shadow-lg">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                              src={getPostImage(post, index + 3, filteredPosts)}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-5">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                                {post.tag || "News"}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-400">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <h4 className="mb-2 line-clamp-2 text-base font-semibold text-brand-navy transition-colors group-hover:text-brand-red">
                              {post.title}
                            </h4>
                            <p className="line-clamp-2 text-sm text-slate-500">
                              {post.excerpt}
                            </p>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Newsletter CTA Section */}
        {/* <section className="full-bleed bg-gradient-to-br from-brand-navy to-brand-navy/90 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Stay Updated
              </span>
              <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                Get the Latest from Dhinimex
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/70">
                Subscribe to receive updates on our latest projects, company news, and industry insights.
              </p>
            </div>
            
            <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-5 py-3.5 text-white placeholder-white/50 outline-none transition focus:border-white/40 focus:bg-white/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-brand-navy transition hover:bg-slate-100"
              >
                Subscribe
              </button>
            </form>
            
            <p className="mt-4 text-xs text-white/50">
              By subscribing, you agree to our privacy policy. Unsubscribe anytime.
            </p>
          </div>
        </section> */}

        {/* Share Your Story CTA */}
        {/* <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-50 p-8 text-center lg:p-12">
            <h3 className="mb-3 text-2xl font-bold text-brand-navy">Have a Story to Share?</h3>
            <p className="mx-auto mb-6 max-w-xl text-slate-600">
              We&apos;re always looking for inspiring stories from our partners, clients, and team members.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
            >
              Get in Touch
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section> */}
      </div>
    </>
  );
}
