import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-badge.png"
      alt="Distaura brand logo"
      className={cn(
        "size-12 rounded-full object-contain drop-shadow-[0_0_14px_rgba(184,224,44,0.45)] transition-transform duration-200 group-hover:scale-105",
        className,
      )}
    />
  );
}
