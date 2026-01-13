'use client';

import { siteConfig } from "../lib/config";
export default function Hero() {
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
      </div>
    </section>
  );
}
