import { 
  services, 
  posts, 
  careers, 
  faqs, 
  productCategories 
} from "@/data/site-content";

export type SearchResult = {
  title: string;
  description: string;
  url: string;
  type: "Service" | "Product" | "Blog Post" | "Career" | "FAQ" | "Page" | "Category" | "Brand";
};

const productCategoryList = [
  { id: "automotive-tools", label: "Automotive Tools" },
  { id: "cleaning-drainage", label: "Cleaning & Drainage" },
  { id: "decorating-tiling", label: "Decorating & Tiling" },
  { id: "detectors-testing", label: "Detectors & Testing" },
  { id: "electrical", label: "Electrical" },
  { id: "engineering-tools", label: "Engineering Tools" },
  { id: "hand-tools", label: "Hand Tools" },
  { id: "power-tool-accessories", label: "Accessories" },
  { id: "power-tools", label: "Power Tools" },
  { id: "tool-boxes-storage", label: "Storage" },
  { id: "tool-kits", label: "Tool Kits" },
  { id: "workwear", label: "Workwear" },
];

export function searchContent(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return results;

  // Search Services
  services.forEach((service) => {
    if (
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.details.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: service.name,
        description: service.description,
        url: `/services/${service.slug}`,
        type: "Service",
      });
    }
  });

  // Search Brands
  productCategories.forEach((category) => {
    if (
      category.name.toLowerCase().includes(lowerQuery) ||
      category.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: category.name,
        description: category.description,
        url: `/products/${category.slug}`,
        type: "Brand",
      });
    }

    // Search Products
    category.products.forEach((product) => {
      if (
        product.name.toLowerCase().includes(lowerQuery) ||
        product.model.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.summary.toLowerCase().includes(lowerQuery) ||
        product.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          title: `${product.brand} ${product.name} (${product.model})`,
          description: product.summary,
          url: `/products/${category.slug}/${product.slug}`,
          type: "Product",
        });
      }
    });
  });

  // Search Product Categories
  productCategoryList.forEach((cat) => {
    if (cat.label.toLowerCase().includes(lowerQuery)) {
      results.push({
        title: cat.label,
        description: `Browse our ${cat.label} collection`,
        url: `/products`, // Ideally this would link to filtered view, but basic products page is fine for now
        type: "Category",
      });
    }
  });

  // Search Blog Posts
  posts.forEach((post) => {
    if (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.some((p) => p.toLowerCase().includes(lowerQuery))
    ) {
      results.push({
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.slug}`,
        type: "Blog Post",
      });
    }
  });

  // Search Careers
  careers.forEach((career) => {
    if (
      career.title.toLowerCase().includes(lowerQuery) ||
      career.summary.toLowerCase().includes(lowerQuery) ||
      (career.description && career.description.toLowerCase().includes(lowerQuery))
    ) {
      results.push({
        title: career.title,
        description: career.summary,
        url: `/careers/${career.slug}`,
        type: "Career",
      });
    }
  });

  // Search FAQs
  faqs.forEach((faq) => {
    if (
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: faq.question,
        description: faq.answer,
        url: "/services#faq",
        type: "FAQ",
      });
    }
  });

  // Static Pages
  const staticPages = [
    { title: "About Us", description: "Learn about Dhinimex's history, vision, and leadership.", url: "/about" },
    { title: "Contact Us", description: "Get in touch with our team for inquiries and support.", url: "/contact-us" },
    { title: "Business Portfolio", description: "Explore our diverse business portfolio including Trading, Manufacturing, and Utilities.", url: "/business/trading" }, // Defaulting to trading as entry
    { title: "Trading", description: "Dhinimex Trading business portfolio.", url: "/business/trading" },
    { title: "Manufacturing", description: "Dhinimex Manufacturing business portfolio.", url: "/business/manufacturing" },
    { title: "Electricity Distributions", description: "Dhinimex Electricity Distributions business portfolio.", url: "/business/electricity" },
    { title: "Water Supply", description: "Dhinimex Water Supply business portfolio.", url: "/business/water-supply" },
    { title: "Scientific", description: "Dhinimex Scientific business portfolio.", url: "/business/scientific" },
    { title: "Services", description: "Our comprehensive range of services.", url: "/services" },
    { title: "Products", description: "Browse our complete product catalog.", url: "/products" },
    { title: "Careers", description: "Join our team.", url: "/careers" },
    { title: "Blog", description: "Latest news and updates.", url: "/blog" },
  ];

  staticPages.forEach((page) => {
    if (
      page.title.toLowerCase().includes(lowerQuery) ||
      page.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: page.title,
        description: page.description,
        url: page.url,
        type: "Page",
      });
    }
  });

  return results;
}
