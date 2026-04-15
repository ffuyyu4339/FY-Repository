import Link from "next/link";
import { navigationItems } from "@/lib/project";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-sm font-semibold text-white">
            JT
          </div>
          <div>
            <p className="text-sm font-semibold">Job Tracker</p>
            <p className="text-xs text-[var(--color-muted)]">MVP 初始化骨架</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
