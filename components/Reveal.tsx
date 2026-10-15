"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "left" | "zoom" | "fade";

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-v={variant}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
      className={`reveal ${seen ? "in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}