'use client';

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../lib/theme-context";

type FloatingBox = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: string;
  color: string;
  size: string;
  sizePx: number;
};

export default function NeoBrutalistBackground() {
  const { currentTheme, customizations } = useTheme();
  const [elements, setElements] = useState<FloatingBox[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isNeo = currentTheme.id === 'neo-brutalist';

  useEffect(() => {
    if (!isNeo) {
      setElements([]);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const palette = ['bg-yellow-300', 'bg-orange-300', 'bg-pink-300', 'bg-blue-300', 'bg-green-300', 'bg-purple-300', 'bg-red-300'];
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

    const createElements = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const sizes = getSizes(width);
      const density = customizations.boxDensity ?? 1;
      const baseCount = width < 640 ? 10 : width < 1024 ? 16 : 20;
      const count = Math.max(6, Math.min(36, Math.round(baseCount * density)));
      const boxes: FloatingBox[] = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() > 0.6 ? sizes[0] : Math.random() > 0.3 ? sizes[1] : sizes[2];
        const maxSpeed = width < 640 ? 0.35 : width < 1024 ? 0.5 : 0.65;
        const speed = Math.random() * maxSpeed + 0.15;
        const angle = Math.random() * Math.PI * 2;
        boxes.push({
          x: Math.random() * (width - size.px),
          y: Math.random() * (height - size.px),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: `rotate(${Math.random() * 60 - 30}deg)`,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: size.className,
          sizePx: size.px,
        });
      }
      return boxes;
    };

    setElements(createElements()); // eslint-disable-line react-hooks/set-state-in-effect

    const handleResize = () => {
      setElements(createElements()); // eslint-disable-line react-hooks/set-state-in-effect
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      setElements((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return prev.map((element) => {
          let x = element.x + element.vx;
          let y = element.y + element.vy;
          let vx = element.vx;
          let vy = element.vy;
          const maxX = Math.max(0, width - element.sizePx);
          const maxY = Math.max(0, height - element.sizePx);

          if (x <= 0 || x >= maxX) {
            vx = -vx;
            x = Math.max(0, Math.min(x, maxX));
          }
          if (y <= 0 || y >= maxY) {
            vy = -vy;
            y = Math.max(0, Math.min(y, maxY));
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {elements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.size} ${element.color} border-2 border-black opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}
          style={{
            top: element.y,
            left: element.x,
            transform: element.rotation
          }}
        />
      ))}
    </div>
  );
}
