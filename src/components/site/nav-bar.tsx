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
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200",
        scrolled
          ? "border-hairline bg-canvas/92 backdrop-blur-md"
          : "border-transparent bg-canvas/55 backdrop-blur-sm",
      )}
    >
      <div className="wrap flex h-nav items-center justify-between">
        <a href="#top" className="flex items-center gap-3 no-underline">
          <Mark className="h-4 w-9" />
          <span className="font-display text-2xl leading-none tracking-wide text-paper">
            Distaura
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-stone md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="no-underline transition-colors duration-150 hover:text-paper"
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
          className="flex size-11 items-center justify-center rounded-full border border-hairline text-paper md:hidden"
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
          className="border-t border-hairline bg-canvas md:hidden"
        >
          <nav className="wrap flex flex-col gap-1 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-12 items-center font-display text-2xl no-underline"
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
