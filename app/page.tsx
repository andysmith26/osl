'use client';

import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { projects } from "./lib/projects";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 overflow-x-hidden">
      {/* Neo-Brutalist: Asymmetrical, overlapping elements */}
      <div className="relative">
        <div className="relative z-10 w-full max-w-[80vw] mx-auto">
          <Hero />
        </div>
        
        {/* Tilted project container */}
        <div className="relative z-20 w-full max-w-[80vw] mx-auto transform sm:-rotate-1 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 my-10 sm:my-16">
          <h2 className="text-2xl sm:text-3xl font-bold transform sm:rotate-1 mb-6 sm:mb-8 text-black font-serif uppercase">
            Projects & Experiments
          </h2>
          <div className="transform sm:rotate-1">
            <Projects projects={projects} />
          </div>
        </div>
        
        <div className="mt-12 sm:mt-16 relative z-30">
          <Footer />
        </div>
      </div>
    </main>
  );
}
