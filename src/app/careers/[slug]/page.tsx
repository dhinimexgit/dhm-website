import { notFound } from "next/navigation";
import { getCareer } from "@/lib/careers";
import { JobDetailClient } from "./job-detail-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getCareer(slug);

  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}
