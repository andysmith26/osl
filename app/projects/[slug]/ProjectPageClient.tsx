'use client';

import Image from "next/image";
import Link from "next/link";
import { layoutConfig } from "../../lib/config";
import { useTheme } from "../../lib/theme-context";
import { useEffect, useState } from "react";
import type { Project } from "../../lib/projects";

type ProjectPageClientProps = {
  project: Project;
};

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const { currentTheme } = useTheme();
  const [backgroundElements, setBackgroundElements] = useState<Array<{ top: string; left: string; rotation: string; color: string; size: string }>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (isClient && currentTheme.id === 'neo-brutalist') {
      const elements = [];
      for (let i = 0; i < 4; i++) {
        elements.push({
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
          rotation: `rotate(${Math.random() * 60 - 30}deg)`,
          color: ['bg-yellow-200', 'bg-orange-200', 'bg-pink-200', 'bg-blue-200'][Math.floor(Math.random() * 4)],
          size: Math.random() > 0.5 ? 'w-12 h-12' : 'w-16 h-16'
        });
      }
      setBackgroundElements(elements); // eslint-disable-line react-hooks/set-state-in-effect
    } else if (isClient && currentTheme.id !== 'neo-brutalist') {
      setBackgroundElements([]);
    }
  }, [currentTheme.id, isClient]);

  // Prevent hydration mismatch by using default layout until client loads
  if (!isClient) {
    return (
      <main className={`max-w-2xl mx-auto ${layoutConfig.horizontalPadding} ${layoutConfig.heroTopPadding} pb-24`}>
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors mb-12 inline-block"
        >
          &larr; Back to all projects
        </Link>

        <h1 className="text-responsive-3xl md:text-responsive-4xl font-semibold tracking-tight mb-responsive-lg">
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
            <h2 className="text-responsive-sm font-medium text-muted uppercase tracking-wide mb-responsive-xs">
              Problem
            </h2>
            <p className="text-responsive-lg">{project.problem}</p>
          </section>
        )}

        {project.approach && (
          <section className="mb-10">
            <h2 className="text-responsive-sm font-medium text-muted uppercase tracking-wide mb-responsive-xs">
              Approach
            </h2>
            <p className="text-responsive-lg">{project.approach}</p>
          </section>
        )}

        {project.outcome && (
          <section className="mb-10">
            <h2 className="text-responsive-sm font-medium text-muted uppercase tracking-wide mb-responsive-xs">
              Outcome
            </h2>
            <p className="text-responsive-lg">{project.outcome}</p>
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

  if (currentTheme.id === 'neo-brutalist') {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative">
          {/* Random background decorative elements */}
          {backgroundElements.map((element, index) => (
            <div
              key={index}
              className={`absolute ${element.size} ${element.color} border-2 border-black opacity-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] pointer-events-none z-0`}
              style={{
                top: element.top,
                left: element.left,
                transform: element.rotation
              }}
            />
          ))}

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-block bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 font-bold text-black uppercase hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow mb-8 transform -rotate-1 hover:rotate-0"
            >
              &larr; Back to Projects
            </Link>

            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 transform rotate-1">
              <h1 className="text-responsive-4xl md:text-responsive-5xl font-black font-serif uppercase mb-responsive-lg text-black leading-tight transform -rotate-1">
                {project.title}
              </h1>

              {project.image && (
                <div className="mb-8 border-4 border-black overflow-hidden transform -rotate-1">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="space-y-8">
                {project.problem && (
                  <section className="bg-pink-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                    <h2 className="text-responsive-xl font-black uppercase tracking-wide mb-responsive-sm text-black font-serif">
                      The Problem
                    </h2>
                    <p className="text-responsive-lg font-bold text-black">{project.problem}</p>
                  </section>
                )}

                {project.approach && (
                  <section className="bg-blue-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                    <h2 className="text-responsive-xl font-black uppercase tracking-wide mb-responsive-sm text-black font-serif">
                      Our Approach
                    </h2>
                    <p className="text-responsive-lg font-bold text-black">{project.approach}</p>
                  </section>
                )}

                {project.outcome && (
                  <section className="bg-orange-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                    <h2 className="text-responsive-xl font-black uppercase tracking-wide mb-responsive-sm text-black font-serif">
                      The Outcome
                    </h2>
                    <p className="text-responsive-lg font-bold text-black">{project.outcome}</p>
                  </section>
                )}
              </div>

              {project.href && (
                <div className="mt-12">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-3 font-black text-black uppercase hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow transform -rotate-1 hover:rotate-0"
                  >
                    View Project &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (currentTheme.id === 'swiss') {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.2em] text-gray-600 hover:text-red-600 transition-colors font-medium border-b border-gray-300 pb-1 inline-block mb-16"
            >
              &larr; Back to Projects
            </Link>
          </div>
          
          <div className="col-span-12 lg:col-span-8">
            <h1 className="text-responsive-5xl md:text-responsive-6xl font-bold tracking-tight leading-[0.9] mb-responsive-lg text-gray-900">
              {project.title}
            </h1>

            {project.image && (
              <div className="mb-12 border border-gray-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={450}
                  className="w-full h-auto block"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.problem && (
                <section>
                  <h2 className="text-responsive-xs uppercase tracking-[0.2em] text-gray-500 mb-responsive-sm font-medium">
                    01. Problem
                  </h2>
                  <p className="text-responsive-base leading-relaxed text-gray-900">{project.problem}</p>
                </section>
              )}

              {project.approach && (
                <section>
                  <h2 className="text-responsive-xs uppercase tracking-[0.2em] text-gray-500 mb-responsive-sm font-medium">
                    02. Approach
                  </h2>
                  <p className="text-responsive-base leading-relaxed text-gray-900">{project.approach}</p>
                </section>
              )}

              {project.outcome && (
                <section>
                  <h2 className="text-responsive-xs uppercase tracking-[0.2em] text-gray-500 mb-responsive-sm font-medium">
                    03. Outcome
                  </h2>
                  <p className="text-responsive-base leading-relaxed text-gray-900">{project.outcome}</p>
                </section>
              )}
            </div>

            {project.href && (
              <div className="mt-16 pt-8 border-t border-gray-900">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-[0.2em] text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  View Project &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Minimal theme (default)
  return (
    <main className={`max-w-2xl mx-auto ${layoutConfig.horizontalPadding} ${layoutConfig.heroTopPadding} pb-24`}>
      <Link
        href="/"
        className="text-sm text-muted hover:text-foreground transition-colors mb-12 inline-block"
      >
        &larr; Back to all projects
      </Link>

      <h1 className="text-responsive-3xl md:text-responsive-4xl font-semibold tracking-tight mb-responsive-lg">
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
          <h2 className="text-responsive-sm font-medium text-muted uppercase tracking-wide mb-responsive-xs">
            Problem
          </h2>
          <p className="text-responsive-lg">{project.problem}</p>
        </section>
      )}

      {project.approach && (
        <section className="mb-10">
          <h2 className="text-responsive-sm font-medium text-muted uppercase tracking-wide mb-responsive-xs">
            Approach
          </h2>
          <p className="text-responsive-lg">{project.approach}</p>
        </section>
      )}

      {project.outcome && (
        <section className="mb-10">
          <h2 className="text-responsive-sm font-medium text-muted uppercase tracking-wide mb-responsive-xs">
            Outcome
          </h2>
          <p className="text-responsive-lg">{project.outcome}</p>
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