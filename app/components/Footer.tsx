import { siteConfig, layoutConfig } from "../lib/config";

export default function Footer() {
  return (
    <footer className={`${layoutConfig.sectionPadding} border-t border-foreground/10`}>
      <p className="text-muted mb-8">{siteConfig.bio}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted">
        <p>
          {siteConfig.author.name} · {siteConfig.author.location}
        </p>
        <div className="flex gap-6">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.resumeHref}
            className="hover:text-foreground transition-colors"
          >
            Resume
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
