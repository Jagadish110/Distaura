import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 16"
      className={cn("text-brass", className)}
      aria-hidden="true"
    >
      <rect
        x="1.2"
        y="5"
        width="6"
        height="6"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect x="14" y="3.5" width="9" height="9" rx="1.2" fill="currentColor" />
      <rect
        x="28.8"
        y="5"
        width="6"
        height="6"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M7.4 8h6.4M23.2 8h5.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
