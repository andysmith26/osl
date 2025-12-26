'use client';

import { siteConfig } from "../lib/config";
import { useTheme } from "../lib/theme-context";
import { useEffect, useState } from "react";

export default function Hero() {
  const { currentTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Prevent hydration mismatch by using default layout until client loads
  if (!isClient) {
    return (
      <section className="pt-24 md:pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 text-stone-800">
          {siteConfig.name}
        </h1>
        <p className="text-xl md:text-2xl text-stone-600">{siteConfig.tagline}</p>
        <div className="mt-8 text-stone-600 max-w-2xl">
          {siteConfig.bio}
        </div>
      </section>
    );
  }
  
  switch (currentTheme.id) {
    case 'minimal':
      return (
        <section className="pt-24 md:pt-32 pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 text-stone-800">
            {siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600">{siteConfig.tagline}</p>
          <div className="mt-8 text-stone-600 max-w-2xl">
            {siteConfig.bio}
          </div>
        </section>
      );
    
    case 'swiss':
      // Swiss theme uses sidebar layout, so minimal hero
      return null;
    
    case 'neo-brutalist':
      return (
        <section className="pt-16 pb-8 relative z-10">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-serif uppercase tracking-tight mb-6 text-black transform -rotate-1 leading-none">
              {siteConfig.name.split(' ').map((word, i) => (
                <span 
                  key={i} 
                  className={`block ${i === 1 ? 'text-orange-500 transform translate-x-8' : ''} ${i === 2 ? 'transform -translate-x-4' : ''}`}
                >
                  {word}
                </span>
              ))}
            </h1>
            
            <div className="relative">
              <div className="absolute -bottom-2 -left-2 w-full h-full bg-orange-500 border-4 border-black transform rotate-1" />
              <p className="relative z-10 text-2xl md:text-3xl font-bold text-black bg-white border-4 border-black p-6 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {siteConfig.tagline}
              </p>
            </div>
            
            <div className="mt-12 relative">
              <div className="absolute -top-2 -right-2 w-full h-full bg-yellow-400 border-4 border-black" />
              <div className="relative z-10 bg-white border-4 border-black p-6 text-lg font-medium">
                {siteConfig.bio}
              </div>
            </div>
          </div>
        </section>
      );
    
    default:
      return (
        <section className="pt-24 md:pt-32 pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
            {siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted">{siteConfig.tagline}</p>
        </section>
      );
  }
}
