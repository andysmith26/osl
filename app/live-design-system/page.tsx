'use client';

import Link from "next/link";
import { colorSchemes, useTheme } from "../lib/theme-context";

export default function LiveDesignSystem() {
  const { customizations, updateCustomizations } = useTheme();
  const colorScheme = customizations.colorScheme ?? 'default';
  const boxDensity = customizations.boxDensity ?? 1;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-4">
          Live Design System
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
          Tune the site feel
        </h1>
        <p className="text-stone-600 max-w-2xl">
          Adjust the global color scheme and the floating box density used in the neo-brutalist theme.
        </p>
      </div>

      <div className="space-y-10">
        <section className="border border-stone-200 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Color Scheme</h2>
          <label className="block text-sm text-stone-600 mb-2" htmlFor="color-scheme">
            Select a palette override
          </label>
          <select
            id="color-scheme"
            value={colorScheme}
            onChange={(event) => updateCustomizations({ colorScheme: event.target.value })}
            className="w-full border border-stone-300 rounded-md px-3 py-2 bg-white text-stone-800"
          >
            {colorSchemes.map((scheme) => (
              <option key={scheme.id} value={scheme.id}>
                {scheme.label}
              </option>
            ))}
          </select>
        </section>

        <section className="border border-stone-200 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Floating Box Density</h2>
          <label className="block text-sm text-stone-600 mb-2" htmlFor="box-density">
            Control how many floating boxes appear in the neo-brutalist theme
          </label>
          <input
            id="box-density"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={boxDensity}
            onChange={(event) => updateCustomizations({ boxDensity: parseFloat(event.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-stone-500 mt-2">
            Density: {boxDensity.toFixed(1)}x
          </div>
        </section>
      </div>

      <div className="mt-12">
        <Link className="text-sm text-stone-500 hover:text-stone-700" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
