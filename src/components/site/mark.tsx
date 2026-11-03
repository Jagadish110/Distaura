import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt="Distaura brand logo"
      className={cn(
        "size-12 object-contain drop-shadow-[0_0_14px_rgba(184,224,44,0.45)] transition-transform duration-200 group-hover:scale-105",
        className,
      )}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-wordmark.png"
      alt="Distaura"
      width={933}
      height={79}
      className={cn("block h-5 w-auto max-w-full", className)}
    />
  );
}
