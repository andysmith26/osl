'use client';

import Image from "next/image";
import Link from "next/link";
import { colorSchemes, useTheme } from "../../lib/theme-context";
import type { Project } from "../../lib/projects";

type ProjectPageClientProps = {
  project: Project;
};

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const { customizations, updateCustomizations } = useTheme();
  const isDesignSystem = project.slug === 'design-system';
  const colorScheme = customizations.colorScheme ?? 'default';
  const boxDensity = customizations.boxDensity ?? 1;

  const renderDesignSystemControls = () => {
    const panelClasses = "border-4 border-black bg-yellow-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 p-6";
    const headingClasses = "text-xl font-black uppercase mb-4 text-black font-serif";
    const labelClasses = "block text-sm font-bold uppercase text-black mb-2";
    const inputClasses = "w-full border-4 border-black bg-white px-3 py-2 font-bold uppercase text-black";
    const rangeClasses = "w-full accent-orange-500";
    const metaClasses = "text-xs font-bold uppercase text-black mt-2";

    return (
      <div className={panelClasses}>
        <h2 className={headingClasses}>Live Design System</h2>
        <div className="space-y-6">
          <div>
            <label className={labelClasses} htmlFor="design-color-scheme">
              Color Scheme
            </label>
            <select
              id="design-color-scheme"
              value={colorScheme}
              onChange={(event) => updateCustomizations({ colorScheme: event.target.value })}
              className={inputClasses}
            >
              {colorSchemes.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses} htmlFor="design-box-density">
              Floating Box Density
            </label>
            <input
              id="design-box-density"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={boxDensity}
              onChange={(event) => updateCustomizations({ boxDensity: parseFloat(event.target.value) })}
              className={rangeClasses}
            />
            <div className={metaClasses}>Density: {boxDensity.toFixed(1)}x</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative">
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

            {isDesignSystem ? (
              <div className="mb-8 transform -rotate-1">
                {renderDesignSystemControls()}
              </div>
            ) : (
              project.image && (
                <div className="mb-8 border-4 border-black overflow-hidden transform -rotate-1">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
              )
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
