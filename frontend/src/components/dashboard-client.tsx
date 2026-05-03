"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchDashboardSummary } from "@/lib/api";
import {
  formatStatusLabel,
  formatTrackLabel,
  type DashboardSummary,
  type StatusValue,
} from "@/lib/types";
import {
  InsightCard,
  PageHero,
  ScoreRing,
  accentButtonClass,
  secondaryButtonClass,
} from "@/components/ui";

type DistributionItem = {
  count: number;
  href: string;
  label: string;
  tone: string;
};

const statusToneMap: Record<StatusValue, string> = {
  pending_analysis: "bg-[var(--color-amber)]",
  ready_to_apply: "bg-[var(--color-accent)]",
  applied: "bg-[var(--color-accent)]",
  online_test: "bg-[var(--color-blue)]",
  interview_1: "bg-[var(--color-blue)]",
  interview_2: "bg-[var(--color-blue)]",
  hr_interview: "bg-[var(--color-blue)]",
  offer: "bg-[var(--color-green)]",
  rejected: "bg-[var(--color-danger)]",
  archived: "bg-slate-400",
};

const trackToneMap = new Map<string, string>([
  ["data_analyst", "bg-[var(--color-blue)]"],
  ["ai_app_dev", "bg-[var(--color-accent)]"],
  ["android_client", "bg-[var(--color-green)]"],
  ["model_deployment", "bg-violet-500"],
  ["general_software", "bg-slate-600"],
  ["other", "bg-slate-400"],
]);

function countByStatus(summary: DashboardSummary, status: StatusValue): number {
  return (
    summary.status_counts.find((item) => item.status === status)?.count ?? 0
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
    <section className="rounded-lg border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {total} 条记录
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-[var(--color-text-secondary)]">
                  {item.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                <div
                  className={`h-full rounded-full ${item.tone}`}
                  style={{ width: `${getPercent(item.count, total)}%` }}
                />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {emptyText}
          </p>
        )}
      </div>
    </section>
  );
}

function EmptyRadar() {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
        Empty Radar
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
        雷达还没有样本
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
        新增岗位并解析 JD 后，这里会展示状态分布、方向分布、高分岗位和技能词。
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/jobs/new" className={accentButtonClass}>
          新增岗位
        </Link>
        <Link href="/sources" className={secondaryButtonClass}>
          打开入口库
        </Link>
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
      <div className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-6 text-sm text-[var(--color-text-secondary)]">
        正在加载求职雷达...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const readyToApplyCount = countByStatus(summary, "ready_to_apply");
  const interviewingCount =
    countByStatus(summary, "interview_1") +
    countByStatus(summary, "interview_2") +
    countByStatus(summary, "hr_interview");
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

  return (
    <section className="space-y-5">
      <PageHero
        breadcrumb="作战台 / 雷达"
        title="求职雷达"
        description="用真实岗位数据观察投递状态、方向分布、高分机会和技能词信号。"
        actions={
          <>
            <Link href="/jobs/new" className={accentButtonClass}>
              新增岗位
            </Link>
            <Link
              href="/jobs?status=ready_to_apply&sort_by=match_score"
              className={secondaryButtonClass}
            >
              处理待投递
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          label="总岗位数"
          value={summary.total_jobs}
          description="当前数据库内全部岗位"
          href="/jobs"
        />
        <InsightCard
          label="优先投递"
          value={readyToApplyCount}
          description="状态为待投递的机会"
          href="/jobs?status=ready_to_apply&sort_by=match_score"
          tone="accent"
        />
        <InsightCard
          label="面试中"
          value={interviewingCount}
          description="一面、二面和 HR 面阶段"
          href="/jobs?status_group=interviewing"
          tone="blue"
        />
        <InsightCard
          label="高分岗位"
          value={summary.top_jobs.length}
          description="Dashboard Top N 候选"
          href="/jobs?sort_by=match_score"
          tone="green"
        />
      </div>

      {summary.total_jobs === 0 ? <EmptyRadar /> : null}

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

      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-lg border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              高分岗位 Top N
            </h2>
            <Link
              href="/jobs?sort_by=match_score"
              className="text-xs font-semibold text-[var(--color-accent)] transition hover:text-[#9f350c]"
            >
              查看队列
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {summary.top_jobs.length > 0 ? (
              summary.top_jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="grid gap-3 rounded-lg border border-slate-100 bg-[var(--color-surface-muted)] p-3 transition hover:border-orange-200 hover:bg-[var(--color-accent-soft)] focus:outline-none focus:ring-2 focus:ring-orange-500/20 md:grid-cols-[auto_minmax(0,1fr)] md:items-center"
                >
                  <ScoreRing score={job.match_score} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[var(--color-text-secondary)]">
                      {job.company_name || "未填写公司"} ·{" "}
                      {job.city || "未知城市"}
                    </p>
                    <p className="mt-1 truncate font-semibold text-[var(--color-text-primary)]">
                      {job.job_title || "未填写岗位"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                新增并解析岗位后，这里会展示高分候选。
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              高频技能词
            </h2>
            <span className="text-xs text-[var(--color-text-secondary)]">
              从已解析 JD 汇总
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.top_skills.length > 0 ? (
              summary.top_skills.map((item) => (
                <span
                  key={item.skill}
                  className="rounded-md bg-[var(--color-surface-muted)] px-2.5 py-1.5 text-sm text-slate-700"
                >
                  {item.skill} · {item.count}
                </span>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                先解析 JD。
              </p>
            )}
          </div>

          <Link
            href="/jobs?city=上海"
            className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 transition hover:text-[var(--color-accent)]"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
                上海岗位
              </span>
              <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
                保留 PRD 统计项，用于城市偏好复盘
              </span>
            </span>
            <span className="text-2xl font-bold text-[var(--color-blue)]">
              {summary.shanghai_jobs}
            </span>
          </Link>
        </section>
      </div>
    </section>
  );
}
