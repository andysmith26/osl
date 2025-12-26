import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "../../lib/projects";
import { ProjectPageClient } from "./ProjectPageClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}
