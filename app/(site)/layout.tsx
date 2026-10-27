import { NavBar } from '@/components/site/nav-bar';
import { SiteFooter } from '@/components/site/footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <NavBar />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
