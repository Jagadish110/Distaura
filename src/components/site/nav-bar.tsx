import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Mark } from "@/components/site/mark";
import { ButtonLink } from "@/components/site/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#route", label: "The route" },
  { href: "#suppliers", label: "For suppliers" },
  { href: "#businesses", label: "For businesses" },
  { href: "#how", label: "How it works" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-b border-white/5 bg-[#1a1b19]/92 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "border-b border-transparent bg-[#1a1b19]/55 backdrop-blur-sm",
      )}
    >
      <div className="wrap flex h-nav items-center justify-between">
        <a href="#top" className="flex items-center gap-3.5 no-underline group py-1">
          <Mark className="size-11 sm:size-12 md:size-13 drop-shadow-[0_0_16px_rgba(184,224,44,0.45)]" />
          <span className="logo !text-2xl sm:!text-[1.75rem] font-bold tracking-wider">
            DISTAURA
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="no-underline font-medium transition-colors duration-150 hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          ))}
          <ButtonLink href="#contact" size="sm">
            Contact us
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-[#252723] text-stone-200 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.5)] transition-transform active:scale-95 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-[#1a1b19]/95 backdrop-blur-xl md:hidden"
        >
          <nav className="wrap flex flex-col gap-2 py-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-12 items-center font-display text-xl font-medium no-underline transition-colors hover:text-[var(--lime-hi)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <ButtonLink
              href="#contact"
              className="mt-3 w-full"
              onClickCapture={() => setOpen(false)}
            >
              Contact us
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
