import Image from "next/image";
import Link from "next/link";
import { Project } from "../lib/projects";
import { layoutConfig } from "../lib/config";

const topRowCount = 2;

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({ projects }: ProjectsProps) {
  const topProjects = projects.slice(0, topRowCount);
  const otherProjects = projects.slice(topRowCount);

  return (
    <section className={`${layoutConfig.sectionPadding} border-t border-foreground/10`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
        {topProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {otherProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-16">
          {otherProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const href = project.href || `/projects/${project.slug}`;

  return (
    <Link
      href={href}
      className="group block -m-4 p-4 rounded-xl transition-colors hover:bg-foreground/[0.03]"
    >
      {project.image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={450}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 group-hover:text-accent-coral transition-colors">
        {project.title}
      </h3>
      <p className="text-muted">{project.description}</p>
    </Link>
  );
}
