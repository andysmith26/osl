'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useTheme } from "../lib/theme-context";

const palette = [
  'bg-yellow-300',
  'bg-orange-300',
  'bg-pink-300',
  'bg-blue-300',
  'bg-green-300',
  'bg-purple-300',
  'bg-red-300',
];

const getSizes = (width: number) => {
  if (width < 640) {
    return [
      { className: 'w-8 h-8', px: 32 },
      { className: 'w-12 h-12', px: 48 },
      { className: 'w-20 h-20', px: 80 },
    ];
  }
  if (width < 1024) {
    return [
      { className: 'w-10 h-10', px: 40 },
      { className: 'w-16 h-16', px: 64 },
      { className: 'w-24 h-24', px: 96 },
    ];
  }
  return [
    { className: 'w-12 h-12', px: 48 },
    { className: 'w-20 h-20', px: 80 },
    { className: 'w-32 h-32', px: 128 },
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
  size: string;
  sizePx: number;
  isPopping?: boolean;
};

type ObstacleRect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const isOverlappingObstacle = (x: number, y: number, size: number, obstacles: ObstacleRect[]) => {
  const right = x + size;
  const bottom = y + size;
  return obstacles.some((obstacle) => {
    return !(
      right <= obstacle.left ||
      x >= obstacle.right ||
      bottom <= obstacle.top ||
      y >= obstacle.bottom
    );
  });
};

export default function NeoBrutalistBackground() {
  const { currentTheme, customizations } = useTheme();
  const [elements, setElements] = useState<FloatingBox[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const viewportRef = useRef({ width: 0, height: 0 });
  const idRef = useRef(0);
  const isNeo = currentTheme.id === 'neo-brutalist';

  const getObstacleRects = () => {
    if (typeof document === 'undefined') {
      return [];
    }

    return Array.from(document.querySelectorAll<HTMLElement>('[data-floating-obstacle]'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        };
      })
      .filter((rect) => rect.right > rect.left && rect.bottom > rect.top);
  };

  const spawnNearby = (base: FloatingBox) => {
    const width = viewportRef.current.width || window.innerWidth;
    const height = viewportRef.current.height || window.innerHeight;
    const maxX = Math.max(0, width - base.sizePx);
    const maxY = Math.max(0, height - base.sizePx);
    const radius = base.sizePx * 1.5 + 100;
    const obstacles = getObstacleRects();
    let x = 0;
    let y = 0;
    let tries = 0;
    do {
      x = Math.max(0, Math.min(base.x + (Math.random() * 2 - 1) * radius, maxX));
      y = Math.max(0, Math.min(base.y + (Math.random() * 2 - 1) * radius, maxY));
      tries += 1;
    } while (tries < 10 && isOverlappingObstacle(x, y, base.sizePx, obstacles));
    const maxSpeed = width < 640 ? 0.35 : width < 1024 ? 0.5 : 0.65;
    const speed = Math.random() * maxSpeed + 0.15;
    const angle = Math.random() * Math.PI * 2;
    return {
      id: idRef.current++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: `rotate(${Math.random() * 60 - 30}deg)`,
      color: palette[Math.floor(Math.random() * palette.length)],
      size: base.size,
      sizePx: base.sizePx,
      isPopping: false,
    };
  };

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
      const density = customizations.boxDensity ?? 1;
      const baseCount = width < 640 ? 10 : width < 1024 ? 16 : 20;
      const count = Math.max(6, Math.min(36, Math.round(baseCount * density)));
      const obstacles = getObstacleRects();
      const boxes: FloatingBox[] = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() > 0.6 ? sizes[0] : Math.random() > 0.3 ? sizes[1] : sizes[2];
        const maxSpeed = width < 640 ? 0.35 : width < 1024 ? 0.5 : 0.65;
        const speed = Math.random() * maxSpeed + 0.15;
        const angle = Math.random() * Math.PI * 2;
        let x = 0;
        let y = 0;
        let tries = 0;
        do {
          x = Math.random() * (width - size.px);
          y = Math.random() * (height - size.px);
          tries += 1;
        } while (tries < 10 && isOverlappingObstacle(x, y, size.px, obstacles));
        boxes.push({
          id: idRef.current++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: `rotate(${Math.random() * 60 - 30}deg)`,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: size.className,
          sizePx: size.px,
          isPopping: false,
        });
      }
      return boxes;
    };

    setElements(createElements()); // eslint-disable-line react-hooks/set-state-in-effect

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
      const obstacles = getObstacleRects();
      setElements((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return prev.map((element) => {
          if (element.isPopping) {
            return element;
          }
          let x = element.x + element.vx;
          let y = element.y + element.vy;
          let vx = element.vx;
          let vy = element.vy;
          const maxX = Math.max(0, width - element.sizePx);
          const maxY = Math.max(0, height - element.sizePx);
          const size = element.sizePx;

          if (x <= 0 || x >= maxX) {
            vx = -vx;
            x = Math.max(0, Math.min(x, maxX));
          }
          if (y <= 0 || y >= maxY) {
            vy = -vy;
            y = Math.max(0, Math.min(y, maxY));
          }

          if (obstacles.length > 0) {
            const prevLeft = element.x;
            const prevRight = element.x + size;
            const prevTop = element.y;
            const prevBottom = element.y + size;
            let nextLeft = x;
            let nextRight = x + size;
            let nextTop = y;
            let nextBottom = y + size;

            for (const obstacle of obstacles) {
              if (
                nextRight <= obstacle.left ||
                nextLeft >= obstacle.right ||
                nextBottom <= obstacle.top ||
                nextTop >= obstacle.bottom
              ) {
                continue;
              }

              const prevOverlaps =
                prevRight > obstacle.left &&
                prevLeft < obstacle.right &&
                prevBottom > obstacle.top &&
                prevTop < obstacle.bottom;
              const overlapX = Math.min(
                nextRight - obstacle.left,
                obstacle.right - nextLeft
              );
              const overlapY = Math.min(
                nextBottom - obstacle.top,
                obstacle.bottom - nextTop
              );

              if (prevOverlaps) {
                const pushLeft = Math.abs(prevRight - obstacle.left);
                const pushRight = Math.abs(obstacle.right - prevLeft);
                const pushTop = Math.abs(prevBottom - obstacle.top);
                const pushBottom = Math.abs(obstacle.bottom - prevTop);
                const minPush = Math.min(pushLeft, pushRight, pushTop, pushBottom);

                if (minPush === pushLeft) {
                  x = obstacle.left - size;
                  vx = -Math.abs(vx);
                } else if (minPush === pushRight) {
                  x = obstacle.right;
                  vx = Math.abs(vx);
                } else if (minPush === pushTop) {
                  y = obstacle.top - size;
                  vy = -Math.abs(vy);
                } else {
                  y = obstacle.bottom;
                  vy = Math.abs(vy);
                }
              } else if (overlapX < overlapY) {
                if (prevRight <= obstacle.left || vx > 0) {
                  x = obstacle.left - size;
                } else if (prevLeft >= obstacle.right || vx < 0) {
                  x = obstacle.right;
                } else {
                  x = prevLeft;
                }
                vx = -vx;
              } else {
                if (prevBottom <= obstacle.top || vy > 0) {
                  y = obstacle.top - size;
                } else if (prevTop >= obstacle.bottom || vy < 0) {
                  y = obstacle.bottom;
                } else {
                  y = prevTop;
                }
                vy = -vy;
              }

              x = Math.max(0, Math.min(x, maxX));
              y = Math.max(0, Math.min(y, maxY));

              nextLeft = x;
              nextRight = x + size;
              nextTop = y;
              nextBottom = y + size;
            }
          }

          return { ...element, x, y, vx, vy };
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
  }, [customizations.boxDensity, isNeo]);

  if (!isNeo || elements.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40" aria-hidden="true">
      {elements.map((element, index) => (
        <div
          key={element.id}
          className={`absolute floating-square pointer-events-auto ${element.size} ${element.color} border-2 border-black opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition duration-200 ease-out hover:brightness-125 hover:opacity-60 ${element.isPopping ? 'animate-puffy-pop pointer-events-none' : 'cursor-pointer'}`}
          style={{
            top: element.y,
            left: element.x,
            ['--rotation' as string]: element.rotation,
          } as CSSProperties}
          onClick={() => {
            setElements((prev) =>
              prev.map((box) =>
                box.id === element.id && !box.isPopping
                  ? { ...box, isPopping: true, vx: 0, vy: 0 }
                  : box
              )
            );
          }}
          onAnimationEnd={() => {
            if (!element.isPopping) {
              return;
            }
            setElements((prev) => {
              const remaining = prev.filter((box) => box.id !== element.id);
              return [...remaining, spawnNearby(element)];
            });
          }}
        />
      ))}
    </div>
  );
}
