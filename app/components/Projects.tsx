'use client';

import Image from "next/image";
import Link from "next/link";
import { Project } from "../lib/projects";
import { useTheme } from "../lib/theme-context";
import { useEffect, useState } from "react";

const topRowCount = 2;

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({ projects }: ProjectsProps) {
  const { currentTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Prevent hydration mismatch by using default layout until client loads
  if (!isClient) {
    return <MinimalProjects projects={projects} />;
  }
  
  switch (currentTheme.id) {
    case 'minimal':
      return <MinimalProjects projects={projects} />;
    case 'swiss':
      return <SwissProjects projects={projects} />;
    case 'neo-brutalist':
      return <BrutalistProjects projects={projects} />;
    default:
      return <MinimalProjects projects={projects} />;
  }
}

function MinimalProjects({ projects }: ProjectsProps) {
  const topProjects = projects.slice(0, topRowCount);
  const otherProjects = projects.slice(topRowCount);

  return (
    <section className="py-16 border-t border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
        {topProjects.map((project) => (
          <MinimalProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {otherProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-16">
          {otherProjects.map((project) => (
            <MinimalProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

function SwissProjects({ projects }: ProjectsProps) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-0 border-t-2 border-gray-900">
        {projects.map((project, index) => (
          <SwissProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function BrutalistProjects({ projects }: ProjectsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <BrutalistProjectCard key={project.slug} project={project} index={index} />
      ))}
    </section>
  );
}

function MinimalProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <Link
      href={href}
      className="group block -m-4 p-4 rounded-xl transition-colors hover:bg-stone-50"
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
      <h3 className="text-lg font-semibold mb-2 group-hover:text-stone-600 transition-colors text-stone-800">
        {project.title}
      </h3>
      <p className="text-stone-600">{project.description}</p>
    </Link>
  );
}

function SwissProjectCard({ project, index }: { project: Project; index: number }) {
  const href = `/projects/${project.slug}`;

  return (
    <Link
      href={href}
      className="group block border-b-2 border-gray-900 hover:bg-gray-50 transition-colors"
    >
      <div className="grid grid-cols-12 gap-8 py-8">
        <div className="col-span-2 flex items-start">
          <span className="text-sm font-normal text-gray-500 leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        <div className="col-span-6">
          <h3 className="text-xl font-normal mb-2 group-hover:text-red-600 transition-colors leading-tight">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
        </div>
        
        <div className="col-span-4">
          {project.image && (
            <div className="aspect-[4/3] overflow-hidden border-2 border-gray-900">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function BrutalistProjectCard({ project, index }: { project: Project; index: number }) {
  const href = `/projects/${project.slug}`;
  const rotations = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];
  const colors = ['bg-yellow-400', 'bg-orange-500', 'bg-pink-400', 'bg-blue-400'];
  const rotation = rotations[index % rotations.length];
  const bgColor = colors[index % colors.length];

  return (
    <Link
      href={href}
      className={`group block ${rotation} hover:rotate-0 transition-transform duration-300 hover:scale-105`}
    >
      <div className={`${bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow`}>
        {project.image && (
          <div className="mb-3 border-4 border-black overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              width={400}
              height={225}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}
        <h3 className="text-lg font-black font-serif uppercase mb-2 text-black leading-tight">
          {project.title}
        </h3>
        <p className="text-sm font-bold text-black">{project.description}</p>
      </div>
    </Link>
  );
}