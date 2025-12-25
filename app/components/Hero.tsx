import { siteConfig, layoutConfig } from "../lib/config";

export default function Hero() {
  return (
    <section className={`${layoutConfig.heroTopPadding} pb-16`}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
        {siteConfig.name}
      </h1>
      <p className="text-xl md:text-2xl text-muted">{siteConfig.tagline}</p>
    </section>
  );
}
