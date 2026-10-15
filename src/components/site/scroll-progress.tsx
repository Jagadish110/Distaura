'use client';
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      if (!barRef.current) return;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const value = max > 0 ? root.scrollTop / max : 0;
      barRef.current.style.transform = `scaleX(${value})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={barRef} className="progress" aria-hidden="true" style={{ willChange: 'transform' }} />;
}
