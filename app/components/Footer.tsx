'use client';

import { siteConfig } from "../lib/config";
import { useTheme } from "../lib/theme-context";
import { useEffect, useState } from "react";

export default function Footer() {
  const { currentTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Prevent hydration mismatch by using default layout until client loads
  if (!isClient) {
    return (
      <footer className="py-16 border-t border-stone-200">
        <p className="text-stone-600 mb-8">{siteConfig.bio}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-stone-500">
          <p>
            {siteConfig.author.name} · {siteConfig.author.location}
          </p>
          <div className="flex gap-6">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-800 transition-colors"
            >
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-800 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    );
  }
  
  switch (currentTheme.id) {
    case 'minimal':
      return (
        <footer className="py-16 border-t border-stone-200">
          <p className="text-stone-600 mb-8">{siteConfig.bio}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-stone-500">
            <p>
              {siteConfig.author.name} · {siteConfig.author.location}
            </p>
            <div className="flex gap-6">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800 transition-colors"
              >
                GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.resumeHref}
                className="hover:text-stone-800 transition-colors"
              >
                Resume
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-stone-800 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      );
      
    case 'swiss':
      return (
        <div className="mt-12 pt-6 border-t-2 border-gray-900">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Contact
          </div>
          <div className="space-y-2 text-sm">
            <div>{siteConfig.author.name}</div>
            <div className="text-gray-600">{siteConfig.author.location}</div>
            <div className="flex gap-4 pt-2">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors text-xs uppercase tracking-wider"
              >
                GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors text-xs uppercase tracking-wider"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-gray-600 hover:text-red-600 transition-colors text-xs uppercase tracking-wider"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      );
      
    case 'neo-brutalist':
      return (
        <footer className="relative">
          <div className="bg-black text-yellow-400 border-4 border-yellow-400 shadow-[8px_8px_0px_0px_rgba(255,255,0,1)] p-8 transform rotate-1">
            <h3 className="text-2xl font-black font-serif uppercase mb-4 text-yellow-400">
              Let&apos;s Connect!
            </h3>
            <p className="text-lg font-bold mb-6 text-white">{siteConfig.bio}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-yellow-400 font-bold text-lg">{siteConfig.author.name}</div>
                <div className="text-white font-medium">{siteConfig.author.location}</div>
              </div>
              <div className="space-y-2">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-yellow-400 text-black font-black py-2 px-4 border-2 border-black hover:bg-orange-500 transition-colors uppercase text-sm"
                >
                  GitHub
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-orange-500 text-black font-black py-2 px-4 border-2 border-black hover:bg-yellow-400 transition-colors uppercase text-sm"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block bg-pink-400 text-black font-black py-2 px-4 border-2 border-black hover:bg-blue-400 transition-colors uppercase text-sm"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </footer>
      );
      
    default:
      return (
        <footer className="py-16 border-t border-stone-200">
          <p className="text-stone-600 mb-8">{siteConfig.bio}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-stone-500">
            <p>
              {siteConfig.author.name} · {siteConfig.author.location}
            </p>
            <div className="flex gap-6">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800 transition-colors"
              >
                GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.resumeHref}
                className="hover:text-stone-800 transition-colors"
              >
                Resume
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-stone-800 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      );
  }
}
