import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { projects } from "./lib/projects";
import { layoutConfig } from "./lib/config";

export default function Home() {
  return (
    <main className={`${layoutConfig.maxWidth} mx-auto ${layoutConfig.horizontalPadding}`}>
      <Hero />
      <Projects projects={projects} />
      <Footer />
    </main>
  );
}
