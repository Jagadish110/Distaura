'use client';
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, () => void>();

function getSharedObserver() {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
  }
  return sharedObserver;
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      el.classList.add("is-in");
      return;
    }

    const show = () => {
      el.classList.add("is-in");
    };

    observerCallbacks.set(el, show);
    observer.observe(el);

    // Safety fallback in case observer is delayed
    const timer = window.setTimeout(show, 1200);

    return () => {
      window.clearTimeout(timer);
      observerCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
