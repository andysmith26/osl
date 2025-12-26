'use client';

import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { projects } from "./lib/projects";
import { useTheme } from "./lib/theme-context";
import { useEffect, useState } from "react";

export default function Home() {
  const { currentTheme } = useTheme();
  const [backgroundElements, setBackgroundElements] = useState<Array<{ top: string; left: string; rotation: string; color: string; size: string }>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (isClient && currentTheme.id === 'neo-brutalist') {
      const elements = [];
      for (let i = 0; i < 12; i++) {
        elements.push({
          top: `${Math.random() * 90 + 5}%`,
          left: `${Math.random() * 90 + 5}%`,
          rotation: `rotate(${Math.random() * 60 - 30}deg)`,
          color: ['bg-yellow-300', 'bg-orange-300', 'bg-pink-300', 'bg-blue-300', 'bg-green-300', 'bg-purple-300', 'bg-red-300'][Math.floor(Math.random() * 7)],
          size: Math.random() > 0.6 ? 'w-12 h-12' : Math.random() > 0.3 ? 'w-20 h-20' : 'w-32 h-32'
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
      <main className="max-w-4xl mx-auto px-6">
        <Hero />
        <Projects projects={projects} />
        <Footer />
      </main>
    );
  }

  // Dramatically different layouts based on theme
  switch (currentTheme.id) {
    case 'minimal':
      return (
        <main className="max-w-4xl mx-auto px-6">
          <Hero />
          <Projects projects={projects} />
          <Footer />
        </main>
      );
    
    case 'swiss':
      return (
        <main className="max-w-5xl mx-auto">
          {/* Swiss: Precise grid with sidebar */}
          <div className="grid grid-cols-12 gap-8 min-h-screen">
            <aside className="col-span-3 border-r-2 border-gray-900 px-6 py-12">
              <div className="sticky top-12">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                  Portfolio
                </div>
                <h1 className="text-2xl font-normal leading-tight mb-2 text-red-600">
                  Overly Serious Leisure
                </h1>
                <div className="text-sm text-gray-600 mb-8">
                  Building for learning, nerdy about play.
                </div>
                <Footer />
              </div>
            </aside>
            <div className="col-span-9 px-8 py-12">
              <Projects projects={projects} />
            </div>
          </div>
        </main>
      );
    
    case 'neo-brutalist':
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Neo-Brutalist: Asymmetrical, overlapping elements */}
          <div className="relative">
            {/* Random background decorative elements */}
            {backgroundElements.map((element, index) => (
              <div
                key={index}
                className={`absolute ${element.size} ${element.color} border-2 border-black opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] pointer-events-none z-0`}
                style={{
                  top: element.top,
                  left: element.left,
                  transform: element.rotation
                }}
              />
            ))}
            
            <div className="relative z-10">
              <Hero />
            </div>
            
            {/* Tilted project container */}
            <div className="relative z-20 transform -rotate-1 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 my-16">
              <h2 className="text-3xl font-bold transform rotate-1 mb-8 text-black font-serif uppercase">
                Projects & Experiments
              </h2>
              <div className="transform rotate-1">
                <Projects projects={projects} />
              </div>
            </div>
            
            <div className="mt-16 relative z-30">
              <Footer />
            </div>
          </div>
        </main>
      );
    
    default:
      return (
        <main className="max-w-4xl mx-auto px-6">
          <Hero />
          <Projects projects={projects} />
          <Footer />
        </main>
      );
  }
}
