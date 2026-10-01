import { useEffect } from "react";

export function ScrollProgress() {
  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const value = max > 0 ? root.scrollTop / max : 0;
      root.style.setProperty("--scroll", String(value));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="progress" aria-hidden="true" />;
}
