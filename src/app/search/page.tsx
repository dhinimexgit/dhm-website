"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { searchContent, type SearchResult } from "@/lib/search";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

import { HeroHeader } from "@/components/layout/hero-header";

const heroImage = "/cover-slide.png";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    if (query) {
      setResults(searchContent(query, language as 'en' | 'kh'));
    } else {
      setResults([]);
    }
  }, [query, language]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-brand-navy">
        {language === 'kh' ? "លទ្ធផលស្វែងរកសម្រាប់" : "Search Results for"} &quot;<span className="text-brand-red">{query}</span>&quot;
      </h1>

      {results.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-12 text-center">
          <p className="text-lg text-slate-600">{language === 'kh' ? "រកមិនឃើញលទ្ធផលទេ។ សូមព្យាយាមប្រើពាក្យគន្លឹះផ្សេង។" : "No results found. Please try a different keyword."}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result, index) => (
            <article key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  {language === 'kh'
                    ? (({
                        Service: "សេវាកម្ម",
                        Product: "ផលិតផល",
                        Career: "ការងារ",
                        News: "ព័ត៌មាន",
                        "News Post": "ព័ត៌មាន",
                        FAQ: "សំណួរ",
                        Page: "ទំព័រ",
                        Category: "ប្រភេទ",
                        Brand: "ម៉ាក",
                      } as Record<string, string>)[result.type] ?? result.type)
                    : result.type}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-brand-navy">
                <Link href={result.url} className="hover:text-brand-red hover:underline">
                  {result.title}
                </Link>
              </h2>
              <p className="mt-2 text-slate-600 line-clamp-2">
                {result.description}
              </p>
              <Link href={result.url} className="mt-4 inline-block text-sm font-semibold text-brand-red hover:text-brand-navy">
                {language === 'kh' ? "អានបន្ថែម →" : "Read more →"}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const { language } = useLanguage();
  return (
    <div>
      <section className="full-bleed relative min-h-[60vh] overflow-hidden lg:min-h-[70vh]">
        <div className="absolute inset-0 z-0 bg-brand-navy">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        <div className="absolute left-1/2 top-20 z-30 hidden w-[min(95%,1300px)] -translate-x-1/2 lg:flex">
          <HeroHeader />
        </div>
        <div className="relative z-20 flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center text-white lg:min-h-[70vh]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">{language === 'kh' ? "ស្វែងរក" : "Search"}</p>
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-tight">
            {language === 'kh' ? "លទ្ធផលស្វែងរក" : "Search Results"}
          </h1>
        </div>
      </section>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-center">{language === 'kh' ? "កំពុងផ្ទុក..." : "Loading..."}</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

