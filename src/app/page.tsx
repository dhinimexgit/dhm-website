import { getServices } from "@/data/site-content";
import { getLatestPosts } from "@/lib/posts";
import { getTranslation } from "@/lib/i18n-server";
import { HomeHero } from "@/components/home/home-hero";
import { StatsSection } from "@/components/home/stats-section";
import { BusinessPortfolio } from "@/components/home/business-portfolio";
import { ServicesCarousel } from "@/components/home/services-carousel";
import { BlogSection } from "@/components/home/blog-section";

export default async function Home() {
  const { lang } = await getTranslation();
  const services = getServices(lang);
  const latestPosts = await getLatestPosts(3, lang);

  return (
    <div className="relative">
      {/* Hero Section */}
      <HomeHero />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Business Portfolio Section */}
      <BusinessPortfolio />
      
      {/* Services Carousel Section (JP Morgan Style) */}
      <ServicesCarousel services={services} />
      
      {/* News Section */}
      <BlogSection posts={latestPosts} />
    </div>
  );
}
