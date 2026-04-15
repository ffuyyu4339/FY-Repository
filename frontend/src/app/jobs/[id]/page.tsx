import { JobEditor } from "@/components/job-editor";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  return <JobEditor mode="edit" jobId={id} />;
}
