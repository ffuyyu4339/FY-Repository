import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import {
  formatMatchLevelLabel,
  formatStatusLabel,
  type MatchLevelValue,
  type StatusValue,
} from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const controlClass =
  "h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3.5 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export const selectControlClass = cn(controlClass, "pr-8");

export const textareaControlClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-3 text-sm leading-6 text-[var(--color-text-primary)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export const primaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-ink)] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";

export const accentButtonClass =
  "inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#9f350c] focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-slate-300 hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const statusBadgeTone: Record<StatusValue, string> = {
  pending_analysis: "border-amber-200 bg-amber-50 text-amber-700",
  ready_to_apply:
    "border-orange-200 bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  applied:
    "border-orange-200 bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  online_test: "border-blue-200 bg-blue-50 text-blue-700",
  interview_1: "border-blue-200 bg-blue-50 text-blue-700",
  interview_2: "border-blue-200 bg-blue-50 text-blue-700",
  hr_interview: "border-blue-200 bg-blue-50 text-blue-700",
  offer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

const matchBadgeTone: Record<MatchLevelValue, string> = {
  priority_apply:
    "border-orange-200 bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  apply: "border-blue-200 bg-blue-50 text-blue-700",
  stretch: "border-amber-200 bg-amber-50 text-amber-700",
  ignore: "border-slate-200 bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }: { status: StatusValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusBadgeTone[status],
      )}
    >
      {formatStatusLabel(status)}
    </span>
  );
}

export function MatchBadge({ level }: { level: MatchLevelValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        matchBadgeTone[level],
      )}
    >
      {formatMatchLevelLabel(level)}
    </span>
  );
}

export function ScoreRing({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const dimensions = {
    sm: "h-14 w-14 text-lg",
    md: "h-[4.5rem] w-[4.5rem] text-2xl",
    lg: "h-24 w-24 text-3xl",
  }[size];
  const ringStyle = {
    background: `conic-gradient(var(--color-accent) ${safeScore * 3.6}deg, #e6ebf1 0deg)`,
  } satisfies CSSProperties;

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full p-1",
        dimensions,
      )}
      style={ringStyle}
      aria-label={`匹配分 ${safeScore}`}
    >
      <div className="grid h-full w-full place-items-center rounded-full bg-white">
        <span className="font-bold tracking-tight text-[var(--color-ink)]">
          {safeScore}
        </span>
      </div>
    </div>
  );
}

export function PageHero({
  actions,
  breadcrumb,
  description,
  meta,
  title,
  variant = "default",
}: {
  actions?: ReactNode;
  breadcrumb: string;
  description: string;
  meta?: ReactNode;
  title: string;
  variant?: "default" | "mission";
}) {
  const mission = variant === "mission";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border px-4 py-4 backdrop-blur",
        mission
          ? "border-black/20 bg-[var(--color-ink)] text-white"
          : "border-[var(--color-border)] bg-[rgba(255,255,255,0.58)]",
      )}
    >
      {mission ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      ) : null}
      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[11px] font-semibold tracking-[0.18em]",
              mission ? "text-orange-200" : "text-[var(--color-accent)]",
            )}
          >
            {breadcrumb}
          </p>
          <h1
            className={cn(
              "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
              mission ? "text-white" : "text-[var(--color-text-primary)]",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "mt-2 max-w-2xl text-sm leading-6",
              mission ? "text-white/64" : "text-[var(--color-text-secondary)]",
            )}
          >
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {meta ? <div className="relative mt-4">{meta}</div> : null}
    </section>
  );
}

export function InsightCard({
  description,
  href,
  label,
  tone = "ink",
  value,
}: {
  description?: string;
  href?: string;
  label: string;
  tone?: "ink" | "accent" | "blue" | "green" | "amber" | "danger" | "gray";
  value: ReactNode;
}) {
  const toneClass = {
    ink: "text-[var(--color-ink)]",
    accent: "text-[var(--color-accent)]",
    blue: "text-[var(--color-blue)]",
    green: "text-[var(--color-green)]",
    amber: "text-[var(--color-amber)]",
    danger: "text-[var(--color-danger)]",
    gray: "text-slate-500",
  }[tone];
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
        {label}
      </p>
      <p className={cn("mt-2 text-3xl font-bold tracking-tight", toneClass)}>
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
          {description}
        </p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-[var(--color-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        {content}
      </Link>
    );
  }

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-white p-4">
      {content}
    </section>
  );
}
