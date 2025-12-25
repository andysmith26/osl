# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

**Development:**
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**TypeScript:**
- `npx tsc --noEmit` - Type check without emitting files

## Architecture

This is a Next.js 14+ App Router application configured for static export (`output: "export"` in next.config.ts). The site is a personal portfolio for "Overly Serious Leisure" showcasing educational technology projects.

**Key Structure:**
- `app/lib/config.ts` - Site configuration including branding, author info, and layout settings
- `app/lib/projects.ts` - Project data with type definitions and utilities (includes getProjectBySlug function)
- `app/projects/[slug]/page.tsx` - Dynamic project detail pages
- `app/components/` - React components (Footer, Hero, Projects)

**Styling:**
- TailwindCSS v4 with PostCSS
- Inter font from Google Fonts via `next/font`
- Configuration in `app/lib/config.ts` includes layout constants (max-width, padding)

**Images:**
- Unoptimized for static export
- Remote pattern allowed for `placehold.co` domain

**Project Data Pattern:**
Projects are defined with slug, title, description, and optional problem/approach/outcome fields. Use the existing Project type and getProjectBySlug utility when working with project data.