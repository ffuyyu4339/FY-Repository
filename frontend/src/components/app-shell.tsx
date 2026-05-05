"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { navigationItems } from "@/lib/project";

function NavIcon({ index }: { index: number }) {
  const icons = [
    <path key="queue" d="M5 7h14M5 12h14M5 17h9" strokeLinecap="round" />,
    <path
      key="intake"
      d="M8 4h6l4 4v12H8V4Zm6 0v5h5M12 13h4m-2-2v4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="source"
      d="M9.5 8.5 8 7a4 4 0 0 0-5.6 5.7l2 2a4 4 0 0 0 5.6 0m4.5.8 1.5 1.5a4 4 0 0 0 5.6-5.7l-2-2a4 4 0 0 0-5.6 0M8.5 15.5l7-7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path key="dashboard" d="M5 19V9m7 10V5m7 14v-7" strokeLinecap="round" />,
    <path
      key="settings"
      d="M12 3.8 13.7 5l2.1-.3 1 1.9 2 .8-.2 2.2L20 11l-1.4 1.4.2 2.2-2 .8-1 1.9-2.1-.3L12 18.2 10.3 17l-2.1.3-1-1.9-2-.8.2-2.2L4 11l1.4-1.4-.2-2.2 2-.8 1-1.9 2.1.3L12 3.8Zm0 4.3a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="guide"
      d="m5 6 5-2 5 2 4-2v14l-4 2-5-2-5 2V6Zm5-2v14m5-12v14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ];

  return (
    <svg
      aria-hidden="true"
      className="h-[1.375rem] w-[1.375rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      {icons[index] ?? icons[0]}
    </svg>
  );
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

function getShortNavLabel(href: string) {
  const labels: Record<string, string> = {
    "/jobs": "队列",
    "/jobs/new": "录入",
    "/sources": "入口",
    "/dashboard": "看板",
    "/settings": "设置",
    "/guide": "蓝图",
  };

  return labels[href] ?? "导航";
}

function NavigationList({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主导航"
      className={compact ? "grid gap-[1.15rem]" : "grid gap-1.5"}
    >
      {navigationItems.map((item, index) => {
        const active = isActiveRoute(pathname, item.href);

        if (compact) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-label={item.label}
              title={`${item.label}：${item.description}`}
              className={`group relative mx-auto grid h-12 w-12 place-items-center rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-orange-500/35 ${
                active
                  ? "border-white/75 bg-white text-[var(--color-ink)] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/78"
              }`}
            >
              {active ? (
                <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-accent)]" />
              ) : null}
              <NavIcon index={index} />
              <span className="sr-only">{getShortNavLabel(item.href)}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
              active
                ? "border-orange-200 bg-[var(--color-accent-soft)] text-[var(--color-ink)]"
                : "border-transparent text-white/70 hover:border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-md border text-xs ${
                active
                  ? "border-orange-200 bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "border-white/10 bg-white/5 text-white/60 group-hover:border-white/20"
              }`}
            >
              <NavIcon index={index} />
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
    <div className="min-h-screen bg-[var(--color-paper)] lg:grid lg:grid-cols-[88px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/5 bg-[#10131b] px-3 py-4 text-white shadow-[10px_0_28px_rgba(16,21,34,0.12)] lg:flex">
        <Link
          href="/"
          title="个人工作区"
          className="mx-auto grid h-[4.15rem] w-[4.15rem] place-items-center rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-orange-500/35"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)] text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(217,91,43,0.26)]">
            JT
          </span>
          <span className="sr-only">个人工作区</span>
        </Link>

        <div className="mt-9">
          <NavigationList compact />
        </div>

      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[rgba(247,248,251,0.88)] backdrop-blur-xl">
          <div className="mx-auto flex min-h-14 w-full max-w-[1500px] flex-wrap items-center gap-2 px-3 py-2 sm:px-5 xl:px-7">
            <button
              type="button"
              aria-label="打开导航"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-ink)] transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 lg:hidden"
            >
              <span className="text-lg leading-none">☰</span>
            </button>

            <div className="min-w-0 shrink-0 pr-2">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[var(--color-text-secondary)]">
                指挥栏
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
                className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-white/95 px-3.5 text-sm shadow-[inset_0_1px_0_rgba(16,21,34,0.03)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="submit"
                className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--color-text-primary)] shadow-[0_1px_0_rgba(16,21,34,0.03)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                搜索
              </button>
            </form>

            <Link
              href={commandAction.href}
              className="order-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[var(--color-ink)] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,21,34,0.16)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 sm:order-none sm:ml-auto sm:w-auto"
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

        <main className="w-full px-3 py-3 sm:px-5 sm:py-4 xl:px-7">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
