"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { fetchDashboardSummary } from "@/lib/api";
import {
  formatStatusLabel,
  formatTrackLabel,
  type DashboardSummary,
  type StatusValue,
} from "@/lib/types";

type IconProps = {
  children: ReactNode;
};

type DistributionItem = {
  count: number;
  href: string;
  label: string;
  tone: string;
};

const statusToneMap: Record<StatusValue, string> = {
  pending_analysis: "bg-amber-500",
  ready_to_apply: "bg-orange-500",
  applied: "bg-sky-500",
  online_test: "bg-violet-500",
  interview_1: "bg-indigo-500",
  interview_2: "bg-indigo-500",
  hr_interview: "bg-fuchsia-500",
  offer: "bg-emerald-500",
  rejected: "bg-rose-500",
  archived: "bg-slate-400",
};

const trackToneMap = new Map<string, string>([
  ["data_analyst", "bg-sky-500"],
  ["ai_app_dev", "bg-orange-500"],
  ["android_client", "bg-emerald-500"],
  ["model_deployment", "bg-violet-500"],
  ["general_software", "bg-slate-600"],
  ["other", "bg-slate-400"],
]);

function countByStatus(summary: DashboardSummary, status: StatusValue): number {
  return (
    summary.status_counts.find((item) => item.status === status)?.count ?? 0
  );
}

function IconShell({ children }: IconProps) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      {children}
    </span>
  );
}

function BriefcaseIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m5 5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m16 0V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3m16 0H4m8 0v2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 21s7-5.2 7-12A7 7 0 1 0 5 9c0 6.8 7 12 7 12Zm0-9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 13.5 13.5 20a2 2 0 0 1-2.8 0L4 13.3V4h9.3l6.7 6.7a2 2 0 0 1 0 2.8ZM8 8h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getPercent(count: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.max(4, Math.round((count / total) * 100));
}

function DistributionPanel({
  emptyText,
  items,
  title,
  total,
}: {
  emptyText: string;
  items: DistributionItem[];
  title: string;
  total: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <span className="text-xs text-slate-500">{total} 条记录</span>
      </div>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-slate-500">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${item.tone}`}
                  style={{ width: `${getPercent(item.count, total)}%` }}
                />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-slate-500">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

export function DashboardClient() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        setLoading(true);
        const data = await fetchDashboardSummary();
        if (!cancelled) {
          setSummary(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "统计面板加载失败",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">
        正在加载统计面板...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const stats = [
    {
      href: "/jobs",
      icon: <BriefcaseIcon />,
      label: "总岗位数",
      value: summary.total_jobs,
    },
    {
      href: "/jobs?city=上海",
      icon: <MapPinIcon />,
      label: "上海岗位",
      value: summary.shanghai_jobs,
    },
    {
      href: "/jobs?match_level=priority_apply&sort_by=match_score",
      icon: <StarIcon />,
      label: "高分岗位",
      value: summary.top_jobs.length,
    },
    {
      href: "/dashboard",
      icon: <TagIcon />,
      label: "高频技能词",
      value: summary.top_skills.length,
    },
  ];
  const statusItems = summary.status_counts
    .filter((item) => item.count > 0)
    .map((item) => ({
      count: item.count,
      href: `/jobs?status=${item.status}`,
      label: formatStatusLabel(item.status),
      tone: statusToneMap[item.status],
    }));
  const trackItems = summary.track_counts
    .filter((item) => item.count > 0)
    .map((item) => ({
      count: item.count,
      href: `/jobs?track=${item.track}`,
      label: formatTrackLabel(item.track),
      tone: trackToneMap.get(item.track) || "bg-slate-400",
    }));
  const nextActions = [
    {
      count: countByStatus(summary, "pending_analysis"),
      href: "/jobs?status=pending_analysis",
      title: "解析新 JD",
    },
    {
      count: countByStatus(summary, "ready_to_apply"),
      href: "/jobs?status=ready_to_apply&sort_by=match_score",
      title: "处理待投递",
    },
    {
      count:
        countByStatus(summary, "interview_1") +
        countByStatus(summary, "interview_2") +
        countByStatus(summary, "hr_interview"),
      href: "/jobs?status=interview_1",
      title: "跟进面试",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-5 border-b border-slate-200 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            workspace / dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            统计面板
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            汇总岗位数量、状态流、方向分布和技能关键词，用来决定下一步投递优先级。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/jobs/new"
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
          >
            新增岗位
          </Link>
          <Link
            href="/jobs?match_level=priority_apply&sort_by=match_score"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            优先投递
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <IconShell>{item.icon}</IconShell>
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              {item.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DistributionPanel
          emptyText="暂无状态数据。"
          items={statusItems}
          title="状态分布"
          total={summary.total_jobs}
        />
        <DistributionPanel
          emptyText="暂无方向数据。"
          items={trackItems}
          title="方向分布"
          total={summary.total_jobs}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            高分岗位 Top N
          </h2>
          <div className="mt-4 space-y-3">
            {summary.top_jobs.length > 0 ? (
              summary.top_jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-orange-200 hover:bg-orange-50 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-500">
                      {job.company_name || "未填写公司"} ·{" "}
                      {job.city || "未知城市"}
                    </p>
                    <p className="mt-1 truncate font-semibold text-slate-950">
                      {job.job_title || "未填写岗位"}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--color-accent)] ring-1 ring-orange-100">
                    {job.match_score} 分
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                新增并解析岗位后，这里会展示高分候选。
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">高频技能词</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.top_skills.length > 0 ? (
              summary.top_skills.map((item) => (
                <span
                  key={item.skill}
                  className="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700"
                >
                  {item.skill} · {item.count}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">暂无技能词，先解析 JD。</p>
            )}
          </div>
          <div className="mt-5 grid gap-2">
            {nextActions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm transition hover:border-orange-200 hover:bg-orange-50"
              >
                <span className="font-medium text-slate-700">{item.title}</span>
                <span className="font-semibold text-[var(--color-accent)]">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
