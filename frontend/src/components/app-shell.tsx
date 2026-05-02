"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { navigationItems } from "@/lib/project";

function NavGlyph({ index }: { index: number }) {
  const glyphs = ["◇", "＋", "↗", "◌", "▤"];
  return <span aria-hidden="true">{glyphs[index] ?? "•"}</span>;
}

function isActiveRoute(pathname: string, href: string) {
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

function getCommandAction(pathname: string) {
  if (pathname.startsWith("/jobs/new")) {
    return { href: "/sources", label: "打开入口库" };
  }

  if (pathname.startsWith("/sources")) {
    return { href: "/jobs/new", label: "录入岗位" };
  }

  if (pathname.startsWith("/dashboard")) {
    return {
      href: "/jobs?match_level=priority_apply&sort_by=match_score",
      label: "查看高分岗位",
    };
  }

  if (pathname.startsWith("/guide")) {
    return { href: "/sources", label: "按流程开始" };
  }

  return { href: "/jobs/new", label: "快速新增" };
}

function getPageName(pathname: string) {
  const current = navigationItems.find((item) =>
    isActiveRoute(pathname, item.href),
  );

  return current?.label ?? "求职作战台";
}

function NavigationList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="主导航" className="grid gap-1.5">
      {navigationItems.map((item, index) => {
        const active = isActiveRoute(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
              active
                ? "bg-white text-[var(--color-ink)]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-md border text-xs ${
                active
                  ? "border-orange-200 bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "border-white/10 bg-white/5 text-white/60 group-hover:border-white/20"
              }`}
            >
              <NavGlyph index={index} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{item.label}</span>
              <span
                className={`mt-0.5 block truncate text-xs ${
                  active ? "text-slate-500" : "text-white/40"
                }`}
              >
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const commandAction = getCommandAction(pathname);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/jobs");
      return;
    }

    router.push(
      `/jobs?q=${encodeURIComponent(trimmedQuery)}&sort_by=match_score&sort_order=desc`,
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-[var(--color-ink)] p-4 text-white lg:flex">
        <Link
          href="/jobs"
          className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
        >
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--color-accent)] text-sm font-bold text-white">
            JT
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              求职作战台
            </span>
            <span className="mt-1 block truncate text-xs text-white/50">
              Job Mission Control
            </span>
          </span>
        </Link>

        <div className="mt-6">
          <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            Mission Routes
          </p>
          <NavigationList />
        </div>

        <div className="mt-auto space-y-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/60">
          <p className="font-semibold text-white/80">MVP 边界</p>
          <p>
            只记录来源、JD、分析结果和手动投递进度，不保存平台令牌，不做自动投递。
          </p>
          <Link
            href="/settings"
            className="inline-flex text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            偏好设置
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[rgba(246,242,234,0.9)] backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 w-full max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 xl:px-8">
            <button
              type="button"
              aria-label="打开导航"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-ink)] transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 lg:hidden"
            >
              <span className="text-lg leading-none">☰</span>
            </button>

            <div className="min-w-0 shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Command Bar
              </p>
              <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                {getPageName(pathname)}
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="order-3 flex min-w-0 flex-1 basis-full items-center gap-2 sm:order-none sm:basis-80"
            >
              <label className="sr-only" htmlFor="global-search">
                全局搜索岗位
              </label>
              <input
                id="global-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索岗位、公司、技能"
                className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="submit"
                className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-orange-200 hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                搜索
              </button>
            </form>

            <Link
              href={commandAction.href}
              className="order-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[var(--color-ink)] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 sm:order-none sm:ml-auto sm:w-auto"
            >
              {commandAction.label}
            </Link>
          </div>

          {mobileNavOpen ? (
            <div className="border-t border-[var(--color-border)] bg-[var(--color-ink)] p-3 lg:hidden">
              <NavigationList onNavigate={() => setMobileNavOpen(false)} />
            </div>
          ) : null}
        </header>

        <main className="w-full px-4 py-6 sm:px-6 xl:px-8">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
