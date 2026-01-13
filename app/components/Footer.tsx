'use client';

import { siteConfig } from "../lib/config";
export default function Footer() {
  return (
    <footer className="relative">
      <div className="bg-black text-yellow-400 border-4 border-yellow-400 shadow-[8px_8px_0px_0px_rgba(255,255,0,1)] p-8 transform rotate-1">
        <h3 className="text-2xl font-black font-serif uppercase mb-4 text-yellow-400">
          Let&apos;s Connect!
        </h3>
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
        </div>
      </div>
    </footer>
  );
}
