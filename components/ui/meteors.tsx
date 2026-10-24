"use client";

import React, { useMemo } from "react";

import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

/** Deterministic 0..1 value so server and client render the same meteors. */
function pseudoRandom(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function Meteors({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, index) => {
        const delay = pseudoRandom(index, 2) * (maxDelay - minDelay) + minDelay;
        const duration = Math.floor(pseudoRandom(index, 3) * (maxDuration - minDuration) + minDuration);
        return {
          left: `${Math.round(pseudoRandom(index, 1) * 100)}%`,
          animationDelay: `${delay.toFixed(2)}s`,
          animationDuration: `${duration}s`,
        } satisfies React.CSSProperties;
      }),
    [number, minDelay, maxDelay, minDuration, maxDuration],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {meteors.map((style, index) => (
        <span
          key={index}
          style={{ ...style, "--angle": `${-angle}deg` } as React.CSSProperties}
          className={cn(
            "animate-meteor absolute size-0.5 rotate-(--angle) rounded-full bg-blue-400 shadow-[0_0_0_1px_#ffffff10]",
            className,
          )}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-blue-400 to-transparent" />
        </span>
      ))}
    </div>
  );
}
