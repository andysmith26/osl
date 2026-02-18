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
  const boxCount = customizations.boxCount ?? 10;

  const renderDesignSystemControls = () => {
    const panelClasses = "border-4 border-theme-border bg-theme-secondary shadow-theme-brutal transform -rotate-1 p-6";
    const headingClasses = "text-xl font-black uppercase mb-4 text-theme-text font-serif";
    const labelClasses = "block text-sm font-bold uppercase text-theme-text mb-3";
    const rangeClasses = "w-full accent-current";
    const metaClasses = "text-xs font-bold uppercase text-theme-text mt-2";

    return (
      <div className={panelClasses}>
        <h2 className={headingClasses}>Live Design System</h2>
        <div className="space-y-6">
          {/* Color Scheme Swatches */}
          <div>
            <label className={labelClasses}>Color Scheme</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colorSchemes.map((scheme) => {
                const isSelected = colorScheme === scheme.id;
                return (
                  <button
                    key={scheme.id}
                    onClick={() => updateCustomizations({ colorScheme: scheme.id })}
                    className={`
                      relative border-4 border-theme-border bg-theme-surface p-2
                      shadow-theme-brutal-sm
                      transition-all duration-150 ease-out
                      hover:shadow-theme-brutal
                      hover:-translate-y-0.5
                      ${isSelected ? 'rotate-0 ring-4 ring-offset-2 ring-current' : 'hover:rotate-1'}
                    `}
                    style={isSelected ? { color: 'var(--color-accent)' } : undefined}
                  >
                    {/* Color swatches */}
                    <div className="space-y-1 mb-2">
                      <div
                        className="h-4 border-2 border-theme-border"
                        style={{ backgroundColor: scheme.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="h-4 border-2 border-theme-border"
                        style={{ backgroundColor: scheme.colors.accent }}
                        title="Accent"
                      />
                      <div
                        className="h-4 border-2 border-theme-border"
                        style={{ backgroundColor: scheme.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="h-4 border-2 border-theme-border"
                        style={{ backgroundColor: scheme.colors.surface }}
                        title="Surface"
                      />
                    </div>
                    {/* Label */}
                    <div className="text-xs font-black uppercase text-theme-text tracking-tight">
                      {scheme.label}
                    </div>
                    {/* Selected stamp */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-theme-accent border-2 border-theme-border px-1.5 py-0.5 text-[10px] font-black uppercase text-theme-text rotate-12 shadow-[2px_2px_0px_0px_var(--color-primary)]">
                        Active
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box Count Slider */}
          <div>
            <label className={labelClasses} htmlFor="design-box-count">
              Floating Box Count
            </label>
            <input
              id="design-box-count"
              type="range"
              min="0"
              max="10"
              step="1"
              value={boxCount}
              onChange={(event) => updateCustomizations({ boxCount: parseInt(event.target.value, 10) })}
              className={rangeClasses}
            />
            <div className={metaClasses}>Boxes: {boxCount}</div>
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
            className="inline-block bg-theme-secondary border-4 border-theme-border shadow-theme-brutal-sm px-4 py-2 font-bold text-theme-text uppercase hover:shadow-theme-brutal transition-shadow mb-8 transform -rotate-1 hover:rotate-0"
            data-floating-obstacle
          >
            &larr; Back to Projects
          </Link>

          <div className="bg-theme-surface border-4 border-theme-border shadow-theme-brutal-lg p-8 transform rotate-1" data-floating-obstacle>
            <h1 className="text-responsive-4xl md:text-responsive-5xl font-black font-serif uppercase mb-responsive-lg text-theme-text leading-tight transform -rotate-1">
              {project.title}
            </h1>

            {isDesignSystem ? (
              <div className="mb-8 transform -rotate-1">
                {renderDesignSystemControls()}
              </div>
            ) : (
              project.image && (
                <div className="mb-8 border-4 border-theme-border overflow-hidden transform -rotate-1">
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
                <section className="bg-theme-secondary border-4 border-theme-border p-6 shadow-theme-brutal transform rotate-1" data-floating-obstacle>
                  <h2 className="text-responsive-xl font-black uppercase tracking-wide mb-responsive-sm text-theme-text font-serif">
                    The Problem
                  </h2>
                  <p className="text-responsive-lg font-bold text-theme-text">{project.problem}</p>
                </section>
              )}

              {project.approach && (
                <section className="bg-theme-accent border-4 border-theme-border p-6 shadow-theme-brutal transform -rotate-1" data-floating-obstacle>
                  <h2 className="text-responsive-xl font-black uppercase tracking-wide mb-responsive-sm text-theme-text font-serif">
                    Our Approach
                  </h2>
                  <p className="text-responsive-lg font-bold text-theme-text">{project.approach}</p>
                </section>
              )}

              {project.outcome && (
                <section className="bg-theme-secondary border-4 border-theme-border p-6 shadow-theme-brutal transform rotate-2" data-floating-obstacle>
                  <h2 className="text-responsive-xl font-black uppercase tracking-wide mb-responsive-sm text-theme-text font-serif">
                    The Outcome
                  </h2>
                  <p className="text-responsive-lg font-bold text-theme-text">{project.outcome}</p>
                </section>
              )}
            </div>

            {project.href && (
              <div className="mt-12">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-theme-secondary border-4 border-theme-border shadow-theme-brutal px-6 py-3 font-black text-theme-text uppercase hover:shadow-theme-brutal-lg transition-shadow transform -rotate-1 hover:rotate-0"
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
