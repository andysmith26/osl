export type Project = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    slug: "relationship-layer",
    title: "The Relationship Layer",
    description:
      "Exploring how AI-generated data can help teachers build relationships with students—without being creepy.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=Relationship+Layer",
    problem:
      "Teachers want to know their students as individuals, but class sizes and time constraints make this nearly impossible at scale.",
    approach:
      "Using thoughtful data synthesis to surface connection points and conversation starters that feel human, not algorithmic.",
    outcome:
      "Currently in early prototype phase, testing with a small group of educators.",
  },
  {
    slug: "groupwheel",
    title: "GroupWheel",
    description:
      "A tool for creating balanced, purposeful student groups in seconds.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=GroupWheel",
    problem: "Teachers spend too much time manually creating student groups.",
    approach: "Smart randomization with constraints that teachers actually need.",
    outcome: "Live at GroupWheel.app",
    href: "https://groupwheel.app",
  },
  {
    slug: "ineedahint",
    title: "I Need A Hint",
    description:
      "A platform connecting learners who need hints with knowledgeable people willing to provide thoughtful guidance.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=I+Need+A+Hint",
    problem: "Students often get stuck while learning but need hints rather than full answers to maintain their learning journey.",
    approach: "Building a community-driven platform that matches hint seekers with subject matter experts who can provide just the right nudge.",
    outcome: "Live at ineedahint.com",
    href: "https://ineedahint.com",
  },
  {
    slug: "wowendlessbread",
    title: "Wow Endless Bread",
    description:
      "A playful endless scrolling game where players travel as far as they can along an infinite loaf of bread.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=Endless+Bread",
    problem: "Sometimes you just need a simple, whimsical game to brighten your day.",
    approach: "Creating a delightfully absurd endless runner with bread as the central theme.",
    outcome: "Live at wowendlessbread.com",
    href: "https://wowendlessbread.com",
  },
  {
    slug: "design-system",
    title: "Live Design System",
    description:
      "An interactive theme switcher that transforms the entire site between Minimal, Swiss, and Neo-Brutalist aesthetics.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=Design+System",
    problem: "Design exploration should be immediate and experiential, not just theoretical.",
    approach: "Built a dynamic theme system with real-time switching, customizable scales, and persistent preferences—all while showcasing the system itself.",
    outcome: "Active on this site - click the theme button in the top right to explore different design languages.",
  },
  {
    slug: "baseball-streaks",
    title: "Baseball Streaks",
    description:
      "Track and analyze hitting streaks, slumps, and statistical patterns in baseball.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=Baseball+Streaks",
    problem: "Baseball fans and analysts want to track hitting streaks and patterns, but current tools are limited or hard to use.",
    approach: "Building an intuitive interface for tracking player streaks with historical data and visual analysis.",
    outcome: "Porting from baseballstreaks.com to be integrated into this portfolio site.",
  },
  {
    slug: "forest-shuffle-scorer",
    title: "Forest Shuffle Scorer",
    description:
      "Digital scoring companion for the Forest Shuffle board game.",
    image: "https://placehold.co/800x450/e8e4e0/78716c?text=Forest+Shuffle",
    problem: "Scoring Forest Shuffle board games can be complex and error-prone with paper scoresheets.",
    approach: "Creating a digital scoring app that handles the game's unique scoring mechanics with clear visual feedback.",
    outcome: "In development as part of the Overly Serious Leisure project collection.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
