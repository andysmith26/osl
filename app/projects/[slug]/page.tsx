import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "../../lib/projects";
import { layoutConfig } from "../../lib/config";

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

  return (
    <main className={`max-w-2xl mx-auto ${layoutConfig.horizontalPadding} ${layoutConfig.heroTopPadding} pb-24`}>
      <Link
        href="/"
        className="text-sm text-muted hover:text-foreground transition-colors mb-12 inline-block"
      >
        &larr; Back to all projects
      </Link>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
        {project.title}
      </h1>

      {project.image && (
        <div className="mb-12 overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={450}
            className="w-full h-auto"
          />
        </div>
      )}

      {project.problem && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            Problem
          </h2>
          <p className="text-lg">{project.problem}</p>
        </section>
      )}

      {project.approach && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            Approach
          </h2>
          <p className="text-lg">{project.approach}</p>
        </section>
      )}

      {project.outcome && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            Outcome
          </h2>
          <p className="text-lg">{project.outcome}</p>
        </section>
      )}

      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-accent-coral hover:underline"
        >
          View project &rarr;
        </a>
      )}
    </main>
  );
}
