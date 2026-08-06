import { getLatestPosts } from "@/lib/posts";
import { HomeHero } from "@/components/home/home-hero";
import { StatsSection } from "@/components/home/stats-section";
import { BusinessPortfolio } from "@/components/home/business-portfolio";
import { ServicesCarousel } from "@/components/home/services-carousel";
import { BlogSection } from "@/components/home/blog-section";

// Statically rendered, refreshed every 5 minutes. This page used to call
// getTranslation() purely to read the NEXT_LOCALE cookie, which forced a
// per-request render plus an uncached Firestore query on every single visit.
// Both child components below localize themselves from the client language
// provider, so nothing here needs the request.
export const revalidate = 300;

export default async function Home() {
  const latestPosts = await getLatestPosts(3);

  return (
    <div className="relative">
      {/* Hero Section */}
      <HomeHero />

      {/* Stats Section */}
      <StatsSection />

      {/* Business Portfolio Section */}
      <BusinessPortfolio />

      {/* Services Carousel Section (JP Morgan Style) */}
      <ServicesCarousel />

      {/* News Section */}
      <BlogSection posts={latestPosts} />
    </div>
  );
}
