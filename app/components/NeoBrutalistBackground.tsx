'use client';

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../lib/theme-context";

const palette = [
  'bg-yellow-400',
  'bg-orange-400',
  'bg-pink-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-red-400',
];

const paletteColors = [
  'yellow', 'orange', 'pink', 'blue', 'green', 'purple', 'red'
];

// Collision buffer in pixels - boxes bounce this far from obstacles
const COLLISION_BUFFER = 8;

// Trajectory settings
const TRAJECTORY_LENGTH = 60; // pixels for direction arrow
const BOUNCE_LINE_LENGTH = 40; // pixels for bounce approach/departure lines

const getSizes = (width: number) => {
  if (width < 640) {
    return [
      { className: 'w-8 h-8', px: 32, name: 'small' },
      { className: 'w-12 h-12', px: 48, name: 'medium' },
      { className: 'w-20 h-20', px: 80, name: 'large' },
    ];
  }
  if (width < 1024) {
    return [
      { className: 'w-10 h-10', px: 40, name: 'small' },
      { className: 'w-16 h-16', px: 64, name: 'medium' },
      { className: 'w-24 h-24', px: 96, name: 'large' },
    ];
  }
  return [
    { className: 'w-12 h-12', px: 48, name: 'small' },
    { className: 'w-20 h-20', px: 80, name: 'medium' },
    { className: 'w-32 h-32', px: 128, name: 'large' },
  ];
};

type FloatingBox = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: string;
  color: string;
  colorName: string;
  size: string;
  sizePx: number;
  sizeName: string;
  isPopping?: boolean;
  bounceCount: number;
  distanceTraveled: number;
  spawnTime: number;
  isRevealed?: boolean;
  isBouncing?: boolean;
};

type Challenge = {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  higherIsBetter: boolean;
};

type ChallengeProgress = {
  challengeId: string;
  current: number;
  best: number | null;
  completed: boolean;
};

type PopStats = {
  sessionPops: number;
  allTimePops: number;
  sessionStartTime: number;
  popTimes: number[];
  lastPopTime: number | null;
  colorsPopped: Set<string>;
  consecutiveLargePops: number;
  consecutiveBouncingPops: number;
  maxBouncePopped: number;
  maxAgePopped: number;
  fastestStreakOf10: number | null;
  longestWithoutPop: number;
};

// 10 challenges
const CHALLENGES: Challenge[] = [
  { id: 'fast10', name: 'Speed Demon', description: 'Fastest 10-pop streak', target: 10, unit: 's', higherIsBetter: false },
  { id: 'nopop', name: 'Zen Master', description: 'Longest without popping', target: 60, unit: 's', higherIsBetter: true },
  { id: 'pops30s', name: 'Rapid Fire', description: 'Most pops in 30 seconds', target: 15, unit: 'pops', higherIsBetter: true },
  { id: 'fast5', name: 'Quick Draw', description: 'Pop 5 boxes in 3 seconds', target: 5, unit: 'in 3s', higherIsBetter: true },
  { id: 'allcolors', name: 'Rainbow Hunter', description: 'Pop all 7 colors', target: 7, unit: 'colors', higherIsBetter: true },
  { id: 'largestreak', name: 'Big Game Hunter', description: 'Pop 3 large boxes in a row', target: 3, unit: 'streak', higherIsBetter: true },
  { id: 'bouncy', name: 'Veteran Sniper', description: 'Pop a box with 50+ bounces', target: 50, unit: 'bounces', higherIsBetter: true },
  { id: 'elder', name: 'Elder Hunter', description: 'Pop a box older than 2 min', target: 120, unit: 's old', higherIsBetter: true },
  { id: 'midair', name: 'Trick Shot', description: 'Pop 3 bouncing boxes in a row', target: 3, unit: 'streak', higherIsBetter: true },
  { id: 'session20', name: 'Dedicated', description: 'Pop 20 boxes this session', target: 20, unit: 'pops', higherIsBetter: true },
];

type BouncePoint = {
  x: number;
  y: number;
  approachAngle: number;
  departAngle: number;
};

// Find the next bounce point from current position (viewport edges only)
const findNextBounce = (
  startX: number,
  startY: number,
  vx: number,
  vy: number,
  size: number,
  viewportWidth: number,
  viewportHeight: number
): BouncePoint | null => {
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed === 0) return null;

  // Normalize velocity
  const nvx = vx / speed;
  const nvy = vy / speed;

  const maxX = viewportWidth - size - COLLISION_BUFFER;
  const maxY = viewportHeight - size - COLLISION_BUFFER;
  const minX = COLLISION_BUFFER;
  const minY = COLLISION_BUFFER;

  // Find distance to each wall
  let minDist = Infinity;
  let bounceX = startX;
  let bounceY = startY;
  let newVx = vx;
  let newVy = vy;

  // Right wall
  if (nvx > 0) {
    const dist = (maxX - startX) / nvx;
    if (dist > 0 && dist < minDist) {
      minDist = dist;
      bounceX = maxX;
      bounceY = startY + nvy * dist;
      newVx = -vx;
      newVy = vy;
    }
  }
  // Left wall
  if (nvx < 0) {
    const dist = (minX - startX) / nvx;
    if (dist > 0 && dist < minDist) {
      minDist = dist;
      bounceX = minX;
      bounceY = startY + nvy * dist;
      newVx = -vx;
      newVy = vy;
    }
  }
  // Bottom wall
  if (nvy > 0) {
    const dist = (maxY - startY) / nvy;
    if (dist > 0 && dist < minDist) {
      minDist = dist;
      bounceX = startX + nvx * dist;
      bounceY = maxY;
      newVx = vx;
      newVy = -vy;
    }
  }
  // Top wall
  if (nvy < 0) {
    const dist = (minY - startY) / nvy;
    if (dist > 0 && dist < minDist) {
      minDist = dist;
      bounceX = startX + nvx * dist;
      bounceY = minY;
      newVx = vx;
      newVy = -vy;
    }
  }

  if (minDist === Infinity || minDist > 1000) return null;

  return {
    x: bounceX + size / 2,
    y: bounceY + size / 2,
    approachAngle: Math.atan2(vy, vx),
    departAngle: Math.atan2(newVy, newVx),
  };
};

// Load stored data from localStorage
const getStoredData = () => {
  if (typeof window === 'undefined') return { allTimePops: 0, challengeBests: {}, currentChallengeId: null };

  const pops = localStorage.getItem('osl-box-pops');
  const bests = localStorage.getItem('osl-challenge-bests');
  const currentChallenge = localStorage.getItem('osl-current-challenge');

  return {
    allTimePops: pops ? parseInt(pops, 10) : 0,
    challengeBests: bests ? JSON.parse(bests) : {},
    currentChallengeId: currentChallenge,
  };
};

export default function NeoBrutalistBackground() {
  const { currentTheme, customizations } = useTheme();
  const [elements, setElements] = useState<FloatingBox[]>([]);
  const [stats, setStats] = useState<PopStats>({
    sessionPops: 0,
    allTimePops: 0,
    sessionStartTime: Date.now(),
    popTimes: [],
    lastPopTime: null,
    colorsPopped: new Set(),
    consecutiveLargePops: 0,
    consecutiveBouncingPops: 0,
    maxBouncePopped: 0,
    maxAgePopped: 0,
    fastestStreakOf10: null,
    longestWithoutPop: 0,
  });
  const [showStats, setShowStats] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeBests, setChallengeBests] = useState<Record<string, number>>({});
  const [hoveredBoxId, setHoveredBoxId] = useState<number | null>(null);
  const [bouncePoint, setBouncePoint] = useState<BouncePoint | null>(null);

  // Get current hovered box from elements (so it updates as box moves)
  const hoveredBox = hoveredBoxId !== null ? elements.find(e => e.id === hoveredBoxId) || null : null;

  const animationFrameRef = useRef<number | null>(null);
  const viewportRef = useRef({ width: 0, height: 0 });
  const idRef = useRef(0);
  const lastNonPopTimeRef = useRef(Date.now());
  const isNeo = currentTheme.id === 'neo-brutalist';
  const boxCount = customizations.boxCount ?? null;
  const boxDensity = customizations.boxDensity ?? 1;

  // Initialize from localStorage
  useEffect(() => {
    const stored = getStoredData();
    setStats(prev => ({
      ...prev,
      allTimePops: stored.allTimePops,
    }));
    setChallengeBests(stored.challengeBests);

    // Pick random challenge if none stored, or load stored one
    let challenge: Challenge;
    if (stored.currentChallengeId) {
      challenge = CHALLENGES.find(c => c.id === stored.currentChallengeId) || CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    } else {
      challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      localStorage.setItem('osl-current-challenge', challenge.id);
    }
    setCurrentChallenge(challenge);
  }, []);

  // Track time without popping
  useEffect(() => {
    if (!isNeo) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastPop = (now - lastNonPopTimeRef.current) / 1000;
      setStats(prev => ({
        ...prev,
        longestWithoutPop: Math.max(prev.longestWithoutPop, timeSinceLastPop),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isNeo]);

  const spawnNearby = useCallback((base: FloatingBox) => {
    const width = viewportRef.current.width || window.innerWidth;
    const height = viewportRef.current.height || window.innerHeight;
    const sizes = getSizes(width);
    const maxX = Math.max(0, width - base.sizePx);
    const maxY = Math.max(0, height - base.sizePx);
    const radius = base.sizePx * 1.5 + 100;
    const x = Math.max(0, Math.min(base.x + (Math.random() * 2 - 1) * radius, maxX));
    const y = Math.max(0, Math.min(base.y + (Math.random() * 2 - 1) * radius, maxY));
    const maxSpeed = width < 640 ? 0.35 : width < 1024 ? 0.5 : 0.65;
    const speed = Math.random() * maxSpeed + 0.15;
    const angle = Math.random() * Math.PI * 2;
    const colorIndex = Math.floor(Math.random() * palette.length);
    const sizeObj = sizes.find(s => s.px === base.sizePx) || sizes[1];

    return {
      id: idRef.current++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: `rotate(${Math.random() * 60 - 30}deg)`,
      color: palette[colorIndex],
      colorName: paletteColors[colorIndex],
      size: base.size,
      sizePx: base.sizePx,
      sizeName: sizeObj.name,
      isPopping: false,
      bounceCount: 0,
      distanceTraveled: 0,
      spawnTime: Date.now(),
      isRevealed: false,
      isBouncing: false,
    };
  }, []);

  // Record a pop and update stats
  const recordPop = useCallback((box: FloatingBox) => {
    const now = Date.now();
    const boxAge = (now - box.spawnTime) / 1000;

    setStats(prev => {
      const newAllTime = prev.allTimePops + 1;
      const newSessionPops = prev.sessionPops + 1;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('osl-box-pops', newAllTime.toString());
      }

      // Keep last 60 seconds of pop times
      const recentPops = [...prev.popTimes, now].filter(t => now - t < 60000);

      // Calculate fastest 10-pop streak
      let fastestStreakOf10 = prev.fastestStreakOf10;
      if (recentPops.length >= 10) {
        const last10 = recentPops.slice(-10);
        const streakTime = (last10[9] - last10[0]) / 1000;
        if (fastestStreakOf10 === null || streakTime < fastestStreakOf10) {
          fastestStreakOf10 = streakTime;
        }
      }

      // Track colors
      const newColors = new Set(prev.colorsPopped);
      newColors.add(box.colorName);

      // Track consecutive large pops
      const isLarge = box.sizeName === 'large';
      const consecutiveLargePops = isLarge ? prev.consecutiveLargePops + 1 : 0;

      // Track consecutive bouncing pops
      const consecutiveBouncingPops = box.isBouncing ? prev.consecutiveBouncingPops + 1 : 0;

      // Reset the no-pop timer
      lastNonPopTimeRef.current = now;

      return {
        ...prev,
        sessionPops: newSessionPops,
        allTimePops: newAllTime,
        popTimes: recentPops,
        lastPopTime: now,
        colorsPopped: newColors,
        consecutiveLargePops,
        consecutiveBouncingPops,
        maxBouncePopped: Math.max(prev.maxBouncePopped, box.bounceCount),
        maxAgePopped: Math.max(prev.maxAgePopped, boxAge),
        fastestStreakOf10,
        longestWithoutPop: prev.longestWithoutPop, // Don't reset, keep tracking max
      };
    });
  }, []);

  // Get challenge progress
  const getChallengeProgress = useCallback((): ChallengeProgress | null => {
    if (!currentChallenge) return null;

    let current = 0;
    const now = Date.now();

    switch (currentChallenge.id) {
      case 'fast10':
        current = stats.fastestStreakOf10 ?? 999;
        break;
      case 'nopop':
        current = stats.longestWithoutPop;
        break;
      case 'pops30s': {
        const last30s = stats.popTimes.filter(t => now - t < 30000);
        current = last30s.length;
        break;
      }
      case 'fast5': {
        const last3s = stats.popTimes.filter(t => now - t < 3000);
        current = last3s.length;
        break;
      }
      case 'allcolors':
        current = stats.colorsPopped.size;
        break;
      case 'largestreak':
        current = stats.consecutiveLargePops;
        break;
      case 'bouncy':
        current = stats.maxBouncePopped;
        break;
      case 'elder':
        current = stats.maxAgePopped;
        break;
      case 'midair':
        current = stats.consecutiveBouncingPops;
        break;
      case 'session20':
        current = stats.sessionPops;
        break;
    }

    const best = challengeBests[currentChallenge.id] ?? null;
    const completed = currentChallenge.higherIsBetter
      ? current >= currentChallenge.target
      : current <= currentChallenge.target && current > 0;

    // Update best if improved
    if (best === null || (currentChallenge.higherIsBetter ? current > best : current < best && current > 0)) {
      const newBests = { ...challengeBests, [currentChallenge.id]: current };
      setChallengeBests(newBests);
      if (typeof window !== 'undefined') {
        localStorage.setItem('osl-challenge-bests', JSON.stringify(newBests));
      }
    }

    return { challengeId: currentChallenge.id, current, best, completed };
  }, [currentChallenge, stats, challengeBests]);

  // Assign new random challenge
  const newChallenge = useCallback(() => {
    const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    setCurrentChallenge(challenge);
    if (typeof window !== 'undefined') {
      localStorage.setItem('osl-current-challenge', challenge.id);
    }
  }, []);

  useEffect(() => {
    if (!isNeo) {
      setElements([]);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const createElements = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      viewportRef.current = { width, height };
      const sizes = getSizes(width);
      // Use boxCount directly if set, otherwise default to 10
      const count = boxCount !== null ? boxCount : 10;
      const boxes: FloatingBox[] = [];
      for (let i = 0; i < count; i++) {
        const sizeObj = Math.random() > 0.6 ? sizes[0] : Math.random() > 0.3 ? sizes[1] : sizes[2];
        const maxSpeed = width < 640 ? 0.35 : width < 1024 ? 0.5 : 0.65;
        const speed = Math.random() * maxSpeed + 0.15;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.random() * (width - sizeObj.px);
        const y = Math.random() * (height - sizeObj.px);
        const colorIndex = Math.floor(Math.random() * palette.length);
        boxes.push({
          id: idRef.current++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: `rotate(${Math.random() * 60 - 30}deg)`,
          color: palette[colorIndex],
          colorName: paletteColors[colorIndex],
          size: sizeObj.className,
          sizePx: sizeObj.px,
          sizeName: sizeObj.name,
          isPopping: false,
          bounceCount: 0,
          distanceTraveled: 0,
          spawnTime: Date.now(),
          isRevealed: false,
          isBouncing: false,
        });
      }
      return boxes;
    };

    setElements(createElements());

    const handleResize = () => {
      setElements((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const last = viewportRef.current;
        viewportRef.current = { width, height };
        return prev.map((element) => {
          const maxX = Math.max(0, width - element.sizePx);
          const maxY = Math.max(0, height - element.sizePx);
          const lastMaxX = Math.max(0, last.width - element.sizePx);
          const lastMaxY = Math.max(0, last.height - element.sizePx);
          const ratioX = lastMaxX > 0 ? element.x / lastMaxX : 0;
          const ratioY = lastMaxY > 0 ? element.y / lastMaxY : 0;
          const scaledX = ratioX * maxX;
          const scaledY = ratioY * maxY;
          return {
            ...element,
            x: Math.max(0, Math.min(scaledX, maxX)),
            y: Math.max(0, Math.min(scaledY, maxY)),
          };
        });
      });
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      setElements((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return prev.map((element) => {
          if (element.isPopping) {
            return element;
          }

          let isBouncing = false;
          let x = element.x;
          let y = element.y;
          let vx = element.vx;
          let vy = element.vy;
          const size = element.sizePx;
          const maxX = Math.max(0, width - size);
          const maxY = Math.max(0, height - size);

          const dx = vx;
          const dy = vy;
          const frameDistance = Math.sqrt(dx * dx + dy * dy);
          let bounceCount = element.bounceCount;

          const wallBuffer = COLLISION_BUFFER;
          if (x + vx <= wallBuffer) {
            x = wallBuffer;
            vx = Math.abs(vx);
            isBouncing = true;
            bounceCount++;
          } else if (x + vx >= maxX - wallBuffer) {
            x = maxX - wallBuffer;
            vx = -Math.abs(vx);
            isBouncing = true;
            bounceCount++;
          } else {
            x += vx;
          }

          if (y + vy <= wallBuffer) {
            y = wallBuffer;
            vy = Math.abs(vy);
            isBouncing = true;
            bounceCount++;
          } else if (y + vy >= maxY - wallBuffer) {
            y = maxY - wallBuffer;
            vy = -Math.abs(vy);
            isBouncing = true;
            bounceCount++;
          } else {
            y += vy;
          }

          x = Math.max(wallBuffer, Math.min(x, maxX - wallBuffer));
          y = Math.max(wallBuffer, Math.min(y, maxY - wallBuffer));

          return {
            ...element,
            x,
            y,
            vx,
            vy,
            bounceCount,
            distanceTraveled: element.distanceTraveled + frameDistance,
            isBouncing,
          };
        });
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [boxCount, boxDensity, isNeo]);

  // Update bounce point when hovering
  useEffect(() => {
    if (hoveredBox && !hoveredBox.isPopping) {
      const width = viewportRef.current.width || window.innerWidth;
      const height = viewportRef.current.height || window.innerHeight;
      const bounce = findNextBounce(
        hoveredBox.x,
        hoveredBox.y,
        hoveredBox.vx,
        hoveredBox.vy,
        hoveredBox.sizePx,
        width,
        height
      );
      setBouncePoint(bounce);
    } else {
      setBouncePoint(null);
    }
  }, [hoveredBox]);

  const popsPerMinute = stats.popTimes.length > 0
    ? (stats.popTimes.length / ((Date.now() - stats.sessionStartTime) / 60000)).toFixed(1)
    : '0.0';

  const avgTimeBetweenPops = stats.popTimes.length > 1
    ? ((stats.popTimes[stats.popTimes.length - 1] - stats.popTimes[0]) / (stats.popTimes.length - 1) / 1000).toFixed(1)
    : '-';

  const formatAge = (spawnTime: number) => {
    const seconds = Math.floor((Date.now() - spawnTime) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatDistance = (px: number) => {
    if (px < 1000) return `${Math.round(px)}px`;
    return `${(px / 1000).toFixed(1)}k`;
  };

  const handleBoxClick = (element: FloatingBox) => {
    recordPop(element);
    setElements((prev) =>
      prev.map((box) =>
        box.id === element.id && !box.isPopping
          ? { ...box, isPopping: true, vx: 0, vy: 0 }
          : box
      )
    );
    setHoveredBoxId(null);
  };

  const handleBoxHover = (element: FloatingBox | null) => {
    setHoveredBoxId(element?.id ?? null);
    if (element) {
      setElements((prev) =>
        prev.map((box) =>
          box.id === element.id ? { ...box, isRevealed: true } : { ...box, isRevealed: false }
        )
      );
    } else {
      setElements((prev) =>
        prev.map((box) => ({ ...box, isRevealed: false }))
      );
    }
  };

  const challengeProgress = getChallengeProgress();

  const formatChallengeValue = (value: number, challenge: Challenge) => {
    if (challenge.id === 'fast10' && value === 999) return '-';
    if (challenge.id === 'nopop' || challenge.id === 'elder') return `${value.toFixed(1)}s`;
    return value.toString();
  };

  if (!isNeo || elements.length === 0) {
    return null;
  }

  return (
    <>
      {/* Direction arrow and bounce prediction - only show when stats panel is open */}
      {showStats && hoveredBox && !hoveredBox.isPopping && (
        <svg
          className="fixed inset-0 pointer-events-none z-50"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="rgba(0,0,0,0.5)" />
            </marker>
            <marker
              id="arrowhead-gray"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="rgba(100,100,100,0.5)" />
            </marker>
          </defs>
          {(() => {
            const speed = Math.sqrt(hoveredBox.vx * hoveredBox.vx + hoveredBox.vy * hoveredBox.vy);
            if (speed === 0) return null;

            const size = hoveredBox.sizePx;
            const nvx = hoveredBox.vx / speed;
            const nvy = hoveredBox.vy / speed;

            // Current box position
            const boxX = hoveredBox.x;
            const boxY = hoveredBox.y;
            const centerX = boxX + size / 2;
            const centerY = boxY + size / 2;

            // Front edge center based on direction
            const frontX = centerX + nvx * (size / 2);
            const frontY = centerY + nvy * (size / 2);

            // Arrow from front edge
            const arrowEndX = frontX + nvx * TRAJECTORY_LENGTH;
            const arrowEndY = frontY + nvy * TRAJECTORY_LENGTH;

            // Bounce box position (top-left corner)
            const bounceBoxX = bouncePoint ? bouncePoint.x - size / 2 : 0;
            const bounceBoxY = bouncePoint ? bouncePoint.y - size / 2 : 0;

            // Calculate approach arrow: starts BOUNCE_LINE_LENGTH away, ends at bounce box edge
            const approachEndX = bouncePoint ? bouncePoint.x - nvx * (size / 2) : 0;
            const approachEndY = bouncePoint ? bouncePoint.y - nvy * (size / 2) : 0;
            const approachStartX = bouncePoint ? approachEndX - nvx * BOUNCE_LINE_LENGTH : 0;
            const approachStartY = bouncePoint ? approachEndY - nvy * BOUNCE_LINE_LENGTH : 0;

            // Calculate departure arrow: starts at bounce box edge, extends outward
            const departNvx = bouncePoint ? Math.cos(bouncePoint.departAngle) : 0;
            const departNvy = bouncePoint ? Math.sin(bouncePoint.departAngle) : 0;
            const departStartX = bouncePoint ? bouncePoint.x + departNvx * (size / 2) : 0;
            const departStartY = bouncePoint ? bouncePoint.y + departNvy * (size / 2) : 0;
            const departEndX = bouncePoint ? departStartX + departNvx * BOUNCE_LINE_LENGTH : 0;
            const departEndY = bouncePoint ? departStartY + departNvy * BOUNCE_LINE_LENGTH : 0;

            return (
              <>
                {/* Direction arrow from current box front edge */}
                <line
                  x1={frontX}
                  y1={frontY}
                  x2={arrowEndX}
                  y2={arrowEndY}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />

                {/* Bounce prediction */}
                {bouncePoint && (
                  <>
                    {/* Ghost box outline at bounce position */}
                    <rect
                      x={bounceBoxX}
                      y={bounceBoxY}
                      width={size}
                      height={size}
                      fill="none"
                      stroke="rgba(100,100,100,0.4)"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      transform={`rotate(${hoveredBox.rotation.match(/-?\d+/)?.[0] || 0}, ${bouncePoint.x}, ${bouncePoint.y})`}
                    />

                    {/* Approach arrow pointing to bounce box */}
                    <line
                      x1={approachStartX}
                      y1={approachStartY}
                      x2={approachEndX}
                      y2={approachEndY}
                      stroke="rgba(100,100,100,0.5)"
                      strokeWidth="1.5"
                      markerEnd="url(#arrowhead-gray)"
                    />

                    {/* Departure arrow from bounce box */}
                    <line
                      x1={departStartX}
                      y1={departStartY}
                      x2={departEndX}
                      y2={departEndY}
                      stroke="rgba(100,100,100,0.5)"
                      strokeWidth="1.5"
                      markerEnd="url(#arrowhead-gray)"
                    />
                  </>
                )}
              </>
            );
          })()}
        </svg>
      )}

      {/* Floating boxes - behind content normally, in front when stats open for interaction */}
      <div className={`fixed inset-0 overflow-hidden ${showStats ? 'z-40 pointer-events-none' : '-z-10 pointer-events-none'}`} aria-hidden="true">
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute floating-square pointer-events-auto ${element.size} ${element.color} border-[3px] border-black opacity-45 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] transition duration-200 ease-out hover:brightness-125 hover:opacity-70 ${element.isPopping ? 'animate-puffy-pop pointer-events-none' : 'cursor-pointer'} ${element.isBouncing ? 'animate-bounce-pulse' : ''}`}
            style={{
              top: element.y,
              left: element.x,
              ['--rotation' as string]: element.rotation,
            } as CSSProperties}
            onClick={() => handleBoxClick(element)}
            onMouseEnter={() => handleBoxHover(element)}
            onMouseLeave={() => handleBoxHover(null)}
            onAnimationEnd={(e) => {
              if (e.animationName === 'puffy-pop' && element.isPopping) {
                setElements((prev) => {
                  const remaining = prev.filter((box) => box.id !== element.id);
                  return [...remaining, spawnNearby(element)];
                });
              }
            }}
          >
            {showStats && element.isRevealed && !element.isPopping && (() => {
              // Position tooltip on trailing edge (opposite of movement direction)
              const speed = Math.sqrt(element.vx * element.vx + element.vy * element.vy);
              let tooltipStyle: React.CSSProperties = { top: -64, left: '50%', transform: 'translateX(-50%)' };

              if (speed > 0) {
                const nvx = element.vx / speed;
                const nvy = element.vy / speed;

                // Determine which edge is trailing based on velocity
                if (Math.abs(nvx) > Math.abs(nvy)) {
                  // Moving more horizontally
                  if (nvx > 0) {
                    // Moving right, tooltip on left
                    tooltipStyle = { top: '50%', right: '100%', marginRight: 8, transform: 'translateY(-50%)' };
                  } else {
                    // Moving left, tooltip on right
                    tooltipStyle = { top: '50%', left: '100%', marginLeft: 8, transform: 'translateY(-50%)' };
                  }
                } else {
                  // Moving more vertically
                  if (nvy > 0) {
                    // Moving down, tooltip on top
                    tooltipStyle = { bottom: '100%', left: '50%', marginBottom: 8, transform: 'translateX(-50%)' };
                  } else {
                    // Moving up, tooltip on bottom
                    tooltipStyle = { top: '100%', left: '50%', marginTop: 8, transform: 'translateX(-50%)' };
                  }
                }
              }

              return (
                <div
                  className="absolute bg-black text-white text-xs font-mono px-2 py-1 whitespace-nowrap border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] z-50"
                  style={tooltipStyle}
                >
                  <div>Bounces: {element.bounceCount}</div>
                  <div>Age: {formatAge(element.spawnTime)}</div>
                  <div>Dist: {formatDistance(element.distanceTraveled)}</div>
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      {/* Stats panel toggle button - upper right */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="fixed top-4 right-4 z-50 bg-theme-secondary border-[3px] border-theme-border shadow-theme-brutal-sm px-3 py-2 font-bold text-theme-text text-sm uppercase hover:shadow-theme-brutal transition-shadow pointer-events-auto"
        aria-label="Toggle box stats"
        data-floating-obstacle
      >
        {showStats ? 'Hide' : 'Stats'}
      </button>

      {/* Stats panel - upper right */}
      {showStats && (
        <div className="fixed top-14 right-4 z-50 bg-theme-surface border-4 border-theme-border shadow-theme-brutal p-4 w-64 pointer-events-auto transform -rotate-1">
          <h3 className="font-black text-theme-text uppercase text-sm mb-3 font-serif border-b-2 border-theme-border pb-1">
            Box Stats
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-theme-text-secondary">Session:</span>
              <span className="font-bold text-theme-text">{stats.sessionPops}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-secondary">All-time:</span>
              <span className="font-bold text-theme-text">{stats.allTimePops}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-secondary">Pops/min:</span>
              <span className="font-bold text-theme-text">{popsPerMinute}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-secondary">Avg interval:</span>
              <span className="font-bold text-theme-text">{avgTimeBetweenPops}s</span>
            </div>
          </div>

          {/* Challenge section */}
          {currentChallenge && challengeProgress && (
            <div className="mt-4 pt-3 border-t-2 border-theme-border">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-black text-theme-text uppercase text-xs font-serif">
                  Challenge
                </h4>
                <button
                  onClick={newChallenge}
                  className="text-xs bg-theme-secondary border-2 border-theme-border px-2 py-0.5 hover:bg-theme-accent font-bold text-theme-text"
                >
                  New
                </button>
              </div>
              <div className="bg-theme-secondary border-2 border-theme-border p-2 -rotate-1">
                <div className="font-bold text-theme-text text-sm">{currentChallenge.name}</div>
                <div className="text-xs text-theme-text-secondary">{currentChallenge.description}</div>
                <div className="mt-2 flex justify-between text-xs text-theme-text">
                  <span>
                    Current: <strong>{formatChallengeValue(challengeProgress.current, currentChallenge)}</strong>
                  </span>
                  <span>
                    Target: <strong>{currentChallenge.target}{currentChallenge.unit}</strong>
                  </span>
                </div>
                {challengeProgress.best !== null && (
                  <div className="text-xs mt-1 text-theme-text-secondary">
                    Personal Best: <strong>{formatChallengeValue(challengeProgress.best, currentChallenge)}</strong>
                  </div>
                )}
                {challengeProgress.completed && (
                  <div className="text-xs mt-1 text-theme-accent font-bold uppercase">
                    Challenge Complete!
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-theme-text-secondary mt-3 italic">
            Hover to see trajectory, click to pop
          </p>
        </div>
      )}
    </>
  );
}
