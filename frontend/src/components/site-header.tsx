"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/project";

export function SiteHeader() {
  const pathname = usePathname();

  function isActiveRoute(href: string) {
    if (href === "/jobs/new") {
      return pathname.startsWith("/jobs/new");
    }

    if (href === "/jobs") {
      return (
        pathname === "/jobs" ||
        (pathname.startsWith("/jobs/") && !pathname.startsWith("/jobs/new"))
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[rgba(248,250,252,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1040px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:flex-nowrap lg:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ink)] text-sm font-semibold text-white transition group-hover:bg-[var(--color-accent)]">
            JT
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">
              Job Tracker
            </p>
            <p className="truncate text-xs text-[var(--color-muted)]">
              JD Analyzer
            </p>
          </div>
        </Link>

        <nav
          aria-label="主导航"
          className="flex max-w-full shrink-0 items-center overflow-x-auto rounded-full border border-[var(--color-line)] bg-white/70 p-1 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition sm:px-4 ${
                isActiveRoute(item.href)
                  ? "bg-[var(--color-ink)] text-white shadow-sm"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
