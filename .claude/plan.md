# Floating Squares Enhancement Plan

## Research Findings

### Current Implementation

**Files involved:**
- `app/components/NeoBrutalistBackground.tsx` (lines 1-370) - Main animation logic
- `app/globals.css` (lines 138-170) - Floating box styling and animations
- `app/page.tsx` - Home page with `data-floating-obstacle` on project container
- `app/components/Hero.tsx` - Title words marked as `data-floating-obstacle`
- `app/projects/[slug]/ProjectPageClient.tsx` - Detail pages (no obstacles marked currently)

### Current Issues Identified

**1. Collision Detection Bugs:**
- **Early bouncing:** The collision logic at lines 286-304 compares `overlapX < overlapY` to decide direction, but doesn't account for velocity direction properly
- **Drifting into containers:** When a box was previously overlapping (lines 266-285), the push logic calculates minimum distance but boxes can still visually penetrate before correcting
- **Edge case:** Lines 287-289 use `|| vx > 0` which can cause incorrect direction assignment

**2. Missing Obstacles:**
- Project detail pages (`ProjectPageClient.tsx`) don't mark containers with `data-floating-obstacle`
- Hero section only marks individual words, not the entire title block

**3. Visual Issues:**
- Boxes use pastel 300-shade colors (`bg-yellow-300`, etc.) which feel soft rather than bold
- `opacity-30` makes them ghostly rather than deliberately playful
- Shadow is light (`rgba(0,0,0,0.3)`) compared to the rest of the neo-brutalist theme

---

## Proposed Approaches

### Approach A: Incremental Collision Fix + Aesthetic Improvements

**What it does differently:** Focuses on fixing the existing collision system with minimal changes, plus quick aesthetic wins.

**Files modified:**
- `app/components/NeoBrutalistBackground.tsx` - Fix collision math
- `app/globals.css` - Update box styling
- `app/projects/[slug]/ProjectPageClient.tsx` - Add `data-floating-obstacle` to sections

**Changes:**
1. Add padding/margin to collision detection (e.g., 8-12px buffer zone) so boxes bounce before visually touching
2. Fix velocity direction check to use actual movement direction, not just position
3. Upgrade box styling to use 400/500-shade colors, higher opacity (40-50%), bolder shadows
4. Mark all major containers on detail pages as obstacles

**Trade-offs:**
- Implementation effort: **Quick win**
- Best-practice alignment: **Acceptable** (patches existing code)
- Maintenance burden: **Manageable**

---

### Approach B: Predictive Collision System with Visual Overhaul

**What it does differently:** Rewrites collision detection to be predictive (check where box will be *next frame*) and adds visual effects for bounces.

**Files modified:**
- `app/components/NeoBrutalistBackground.tsx` - New collision system
- `app/globals.css` - New bounce animation classes
- `app/projects/[slug]/ProjectPageClient.tsx` - Add obstacles

**Changes:**
1. **Predictive collision:** Calculate trajectory and find exact collision point/time, then position box precisely at boundary
2. **Collision buffer:** Add configurable margin (default 6px) around obstacles
3. **Bounce visual feedback:** Flash/pulse effect when box hits an obstacle or wall
4. **Bolder aesthetic:**
   - Colors: Use 400-500 shades
   - Opacity: 40-50% base, 70% on hover
   - Shadows: Match theme's 4-8px hard offset
   - Borders: 3px black borders like other elements
5. **Mark all containers:** Hero, project container, footer, detail page sections

**Trade-offs:**
- Implementation effort: **Moderate**
- Best-practice alignment: **Canonical** (proper physics simulation)
- Maintenance burden: **Manageable**

---

### Approach C: Full "Overly Serious Leisure" Experience

**What it does differently:** Goes beyond fixing issues to make floating squares a thematic feature tied to the site's identity.

**Files modified:**
- `app/components/NeoBrutalistBackground.tsx` - New features
- `app/globals.css` - New animations
- `app/projects/[slug]/ProjectPageClient.tsx` - Add obstacles
- `app/lib/theme-context.tsx` (optional) - New customization options

**Changes:**
1. All fixes from Approach B, plus:

2. **Thematic "Leisure" interactions:**
   - **"Leisure mode" toggle:** When clicked, boxes slow down dramatically, drift lazily, occasionally pause to "rest"
   - **Box personalities:** Some boxes spin slowly, some wobble, some move in gentle arcs
   - **Idle animations:** After 30 seconds of no interaction, boxes start "playing" - grouping together, forming patterns, then dispersing

3. **"Overly Serious" aesthetic:**
   - Boxes have thick 4px black borders matching the theme
   - Hard 8px offset shadows like project cards
   - When bouncing, brief "impact" squash animation
   - Occasional rotation changes on collision
   - Add a subtle "serious" color variant (pure black or dark gray boxes mixed in)

4. **Interactive features:**
   - Click and drag boxes (temporarily)
   - Double-click spawns a burst of mini-boxes
   - Boxes avoid the cursor if it's near (magnetic repulsion)
   - Score counter for popped boxes (very "overly serious")

5. **Visual polish:**
   - Entry animation when page loads (boxes fall in or expand from center)
   - Subtle trail effect on fast-moving boxes
   - Collision ripple effect

**Trade-offs:**
- Implementation effort: **Significant**
- Best-practice alignment: **Canonical** (unique, intentional design)
- Maintenance burden: **Complex** (more moving parts)

---

## Recommendation

I recommend **Approach B: Predictive Collision System with Visual Overhaul**.

**Why:**

1. **Solves the core problems properly** - The current collision bugs stem from frame-based checking after movement. Predictive collision calculates the exact intersection point, eliminating drift and early-bounce issues entirely.

2. **Meaningful aesthetic improvement** - The visual updates (bolder colors, thicker borders, proper shadows) align the floating boxes with the rest of the neo-brutalist theme without over-engineering.

**What would flip the choice:**
- If you want the site to feel more memorable/interactive → go with Approach C
- If time is very limited → Approach A is a quick patch

---

## Implementation Details (Approach B)

### 1. Fix Collision Detection
Add collision buffer zone (configurable, default 8px margin). Implement swept AABB collision to find exact collision time, then position box at boundary minus buffer.

### 2. Visual Bounce Feedback
Add a brief 150ms "pulse" class when collision occurs - slight scale bump and brightness flash.

### 3. Upgrade Box Styling
```css
.floating-square {
  border-width: 3px;
  opacity: 0.45;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.6);
}
```
Use 400-shade colors: `bg-yellow-400`, `bg-orange-400`, etc.

### 4. Add Obstacles to Detail Pages
Mark the main content container, problem/approach/outcome sections with `data-floating-obstacle`.

### 5. Add Obstacles to Hero
Wrap the entire Hero section in a container with `data-floating-obstacle` for cleaner collision.

---

## "Overly Serious Leisure" Ideas for Floating Squares

The site's theme is about nerding out over leisure - bringing rigorous, data-driven analysis to fun activities (like baseball stats, but for anything in your life). Here are ideas that embody that spirit:

### Stat Tracking (Core Theme Fit)

1. **Pop counter with stats panel** - Track total boxes popped this session, all-time (localStorage), pops per minute, average time between pops. Display in a small brutalist stats card in corner.

2. **Box "species" with rarity** - Different box types (by color/size combo) have different spawn rates. Track which ones you've popped. "You've collected 12/21 variants."

3. **Personal best challenges** - "Fastest 10-pop streak: 4.2 seconds" / "Longest session without popping: 12 minutes"

4. **Heat map mode** - Toggle to show where boxes get popped most often (faded color overlay on the viewport). Reveals your clicking patterns.

5. **Box trajectory analysis** - On hover, show a faint projected path line. Very "I analyzed the angles."

### Behavioral Quirks (Personality)

6. **Boxes have "moods"** - Some move erratically, some drift lazily, some are "determined" (move in straighter lines). Each mood has different point values when popped.

7. **Box aging** - Boxes that survive longer get slightly larger or develop visual "experience" markers (extra border, subtle glow). Older boxes worth more points.

8. **Collision counting** - Each box tracks how many times it's bounced. Display on hover. "This box has bounced 47 times."

### Visual Polish That Fits

9. **Impact "data burst"** - When boxes collide with obstacles, briefly show velocity/angle numbers at collision point (like sports replay analysis)

10. **Spawn with entrance stats** - New boxes briefly flash their initial velocity and trajectory angle

### Simple & Effective (Recommended for Now)

11. **Session stats in footer or corner** - Small unobtrusive counter: "Boxes popped: 7 | Session time: 2:34"

12. **Click to reveal box stats** - Instead of immediately popping, first click shows the box's "stats" (age, bounces, distance traveled), second click pops it
