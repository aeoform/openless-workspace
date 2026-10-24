"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { isCoarsePointer, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
const noopSubscribe = () => () => {};
/** Pointer trails only make sense for a fine pointer and when motion is welcome. */
const trailCapable = () => !prefersReducedMotion() && !isCoarsePointer();

const noopServerSnapshot = () => false;

export function MouseFlickerOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastMaskRef = useRef<string>(HIDDEN_MASK);
  // false on the server and during hydration, so both renders agree.
  const enabled = useSyncExternalStore(noopSubscribe, trailCapable, noopServerSnapshot);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      const trail = trailRef.current;
      const head = trail[0];
      if (!head || Math.hypot(event.clientX - head.x, event.clientY - head.y) > MIN_STEP_PX) {
        trail.unshift({ x: event.clientX, y: event.clientY, t: performance.now() });
        if (trail.length > MAX_POINTS) trail.pop();
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const now = performance.now();
        const live = trailRef.current.filter((point) => now - point.t < MAX_AGE_MS);
        trailRef.current = live;

        const mask =
          live.length === 0
            ? HIDDEN_MASK
            : live
                .map((point) => {
                  const age = now - point.t;
                  const alpha = Math.max(0, 1 - age / MAX_AGE_MS).toFixed(2);
                  return `radial-gradient(${RADIUS}px circle at ${point.x}px ${point.y}px, rgba(255,255,255,${alpha}) 0%, transparent 70%)`;
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
  }, [enabled]);

  return (
    <div
      ref={wrapperRef}
      className={cn("mouse-flicker-overlay", !enabled && "is-off")}
      aria-hidden="true"
    >
      {enabled && (
        <FlickeringGrid squareSize={4} gridGap={6} color="#1E63FF" maxOpacity={0.5} flickerChance={0.18} />
      )}
    </div>
  );
}
