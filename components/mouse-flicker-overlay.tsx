"use client";

import { useEffect, useRef } from "react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

const MAX_AGE_MS = 800;
const MAX_POINTS = 16;
const RADIUS = 180;
const MIN_STEP_PX = 8;
const HIDDEN_MASK = "linear-gradient(transparent, transparent)";

export function MouseFlickerOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastMaskRef = useRef<string>(HIDDEN_MASK);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const trail = trailRef.current;
      const head = trail[0];
      if (!head || Math.hypot(e.clientX - head.x, e.clientY - head.y) > MIN_STEP_PX) {
        trail.unshift({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (trail.length > MAX_POINTS) trail.pop();
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const now = performance.now();
        const live = trailRef.current.filter((p) => now - p.t < MAX_AGE_MS);
        trailRef.current = live;

        const mask =
          live.length === 0
            ? HIDDEN_MASK
            : live
                .map((p) => {
                  const age = now - p.t;
                  const a = Math.max(0, 1 - age / MAX_AGE_MS);
                  return `radial-gradient(${RADIUS}px circle at ${p.x}px ${p.y}px, rgba(255,255,255,${a.toFixed(2)}) 0%, transparent 70%)`;
                })
                .join(",");

        if (mask !== lastMaskRef.current) {
          wrapper.style.maskImage = mask;
          wrapper.style.webkitMaskImage = mask;
          lastMaskRef.current = mask;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="mouse-flicker-overlay" aria-hidden>
      <FlickeringGrid
        squareSize={4}
        gridGap={6}
        color="#1E63FF"
        maxOpacity={0.5}
        flickerChance={0.18}
      />
    </div>
  );
}
