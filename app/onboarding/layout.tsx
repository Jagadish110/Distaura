export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Full-screen overlay layout — no nav/footer chrome
  return (
    <div className="min-h-dvh bg-[#0e0f0d]">
      {children}
    </div>
  );
}
