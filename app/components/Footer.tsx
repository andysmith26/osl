'use client';

import { siteConfig } from "../lib/config";
export default function Footer() {
  return (
    <footer className="relative">
      <div className="bg-theme-primary text-theme-secondary border-4 border-theme-secondary p-8 transform rotate-1" data-floating-obstacle style={{ boxShadow: '8px 8px 0px 0px var(--color-secondary)' }}>
        <h3 className="text-2xl font-black font-serif uppercase mb-4 text-theme-secondary">
          Let&apos;s Connect!
        </h3>
        <div className="space-y-2">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-theme-secondary text-theme-primary font-black py-2 px-4 border-2 border-theme-primary hover:bg-theme-accent transition-colors uppercase text-sm"
          >
            GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-theme-accent text-theme-primary font-black py-2 px-4 border-2 border-theme-primary hover:bg-theme-secondary transition-colors uppercase text-sm"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
