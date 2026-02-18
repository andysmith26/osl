'use client';

import Image from "next/image";
import Link from "next/link";
import { Project } from "../lib/projects";

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({ projects }: ProjectsProps) {
  return <BrutalistProjects projects={projects} />;
}

function BrutalistProjects({ projects }: ProjectsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pr-3 sm:pr-6">
      {projects.map((project, index) => (
        <BrutalistProjectCard key={project.slug} project={project} index={index} />
      ))}
    </section>
  );
}

function BrutalistProjectCard({ project, index }: { project: Project; index: number }) {
  const href = `/projects/${project.slug}`;
  const rotations = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];
  // Alternate between secondary (highlight) and accent colors
  const colorClasses = ['bg-theme-secondary', 'bg-theme-accent', 'bg-theme-secondary', 'bg-theme-accent'];
  const rotation = rotations[index % rotations.length];
  const bgColor = colorClasses[index % colorClasses.length];

  return (
    <Link
      href={href}
      className={`group block ${rotation} hover:rotate-0 transition-transform duration-300 hover:scale-105`}
    >
      <div className={`${bgColor} border-4 border-theme-border shadow-theme-brutal p-4 hover:shadow-theme-brutal-lg transition-shadow`}>
        {project.image && (
          <div className="mb-3 border-4 border-theme-border overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              width={400}
              height={225}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}
        <h3 className="text-lg font-black font-serif uppercase mb-2 text-theme-text leading-tight">
          {project.title}
        </h3>
        <p className="text-sm font-bold text-theme-text">{project.description}</p>
      </div>
    </Link>
  );
}
