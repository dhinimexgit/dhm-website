import { services } from "@/data/site-content";
import { getLatestPosts } from "@/lib/posts";
import { HomeHero } from "@/components/home/home-hero";
import { StatsSection } from "@/components/home/stats-section";
import { BusinessPortfolio } from "@/components/home/business-portfolio";
import { ServicesCarousel } from "@/components/home/services-carousel";
import { BlogSection } from "@/components/home/blog-section";
import { FontSwitcher } from "@/components/font-switcher";

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
      <ServicesCarousel services={services} />
      
      {/* Blog Section */}
      <BlogSection posts={latestPosts} />
      
      {/* Font Switcher - Temporary Feature */}
      <FontSwitcher />
    </div>
  );
}
