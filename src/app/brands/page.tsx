import { brands } from "@/data/site-content";
import { SectionHeading } from "@/components/section-heading";
import { BrandGrid } from "@/components/brand-grid";

export const metadata = {
  title: "Brands",
  description:
    "Dhinimex represents global brands across electrical, water, and automation technologies.",
};

export default function BrandsPage() {
  return (
    <div className="space-y-12 pb-12">
      <SectionHeading
        eyebrow="Partners"
        title="Brands & partnerships"
        description="We are the official distributor for renowned international and corporate brands, bringing trusted quality to the Cambodian market."
      />
      <BrandGrid brands={brands} />
    </div>
  );
}

