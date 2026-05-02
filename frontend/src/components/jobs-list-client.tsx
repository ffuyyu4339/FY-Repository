"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchJobs } from "@/lib/api";
import {
  defaultJobListFilters,
  formatTrackLabel,
  getJobListFiltersFromSearch,
  matchLevelOptions,
  statusOptions,
  trackOptions,
  type Job,
  type JobListFilters,
  type StatusValue,
} from "@/lib/types";
import {
  InsightCard,
  MatchBadge,
  PageHero,
  ScoreRing,
  StatusBadge,
  accentButtonClass,
  cn,
  controlClass,
  secondaryButtonClass,
  selectControlClass,
} from "@/components/ui";

const cityOptions = ["上海", "北京", "深圳", "杭州", "远程"];

const quickFilters: {
  label: string;
  filter: Partial<JobListFilters>;
}[] = [
  { label: "待分析", filter: { status: "pending_analysis" } },
  {
    label: "优先投递",
    filter: { match_level: "priority_apply", sort_by: "match_score" },
  },
  {
    label: "待投递",
    filter: { status: "ready_to_apply", sort_by: "match_score" },
  },
  { label: "面试中", filter: { status_group: "interviewing" } },
];

function buildSubtitle(job: Job) {
  return [
    job.company_name || "未填写公司",
    job.city || "未知城市",
    job.salary_text || "薪资未填写",
  ].join(" · ");
}

function buildSourceLabel(job: Job) {
  if (job.platform) {
    return job.platform;
  }

  if (job.job_link) {
    return "外部链接";
  }

  return "手动录入";
}

function buildJdPreview(job: Job) {
  const normalized = job.jd_raw_text?.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "暂无 JD 原文，建议进入详情补充后再解析。";
  }

  return normalized.length > 108
    ? `${normalized.slice(0, 108)}...`
    : normalized;
}

function getNextAction(job: Job) {
  const actionMap: Record<StatusValue, string> = {
    pending_analysis: "解析 JD",
    ready_to_apply: "优先判断",
    applied: "记录反馈",
    online_test: "准备笔试",
    interview_1: "跟进一面",
    interview_2: "跟进二面",
    hr_interview: "跟进 HR",
    offer: "确认 Offer",
    rejected: "复盘原因",
    archived: "已归档",
  };

  if (job.match_level === "priority_apply" && job.status === "ready_to_apply") {
    return "优先投递";
  }

  return actionMap[job.status];
}

function isInterviewing(job: Job) {
  return ["interview_1", "interview_2", "hr_interview"].includes(job.status);
}

function SearchMark() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FilterDock({
  activeFilterCount,
  cityFilterOptions,
  filters,
  setFilters,
}: {
  activeFilterCount: number;
  cityFilterOptions: string[];
  filters: JobListFilters;
  setFilters: (filters: JobListFilters) => void;
}) {
  function applyQuickFilter(filter: Partial<JobListFilters>) {
    setFilters({
      ...defaultJobListFilters,
      ...filter,
      sort_order: filter.sort_order ?? "desc",
    });
  }

  return (
    <aside className="rounded-lg border border-[var(--color-border)] bg-white p-4 lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Filter Dock
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
            决策筛选
          </h2>
        </div>
        <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
          {activeFilterCount} 个
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            搜索
          </span>
          <span className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchMark />
            </span>
            <input
              value={filters.q}
              onChange={(event) =>
                setFilters({ ...filters, q: event.target.value })
              }
              placeholder="岗位、公司、技能"
              className={cn(controlClass, "pl-10")}
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            城市
          </span>
          <select
            value={filters.city}
            onChange={(event) =>
              setFilters({ ...filters, city: event.target.value })
            }
            className={selectControlClass}
          >
            <option value="">全部城市</option>
            {cityFilterOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            方向
          </span>
          <select
            value={filters.track}
            onChange={(event) =>
              setFilters({ ...filters, track: event.target.value })
            }
            className={selectControlClass}
          >
            <option value="">全部方向</option>
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            匹配等级
          </span>
          <select
            value={filters.match_level}
            onChange={(event) =>
              setFilters({ ...filters, match_level: event.target.value })
            }
            className={selectControlClass}
          >
            <option value="">全部等级</option>
            {matchLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            状态
          </span>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters({
                ...filters,
                status: event.target.value,
                status_group: "",
              })
            }
            className={selectControlClass}
          >
            <option value="">全部状态</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            排序
          </span>
          <select
            value={`${filters.sort_by}:${filters.sort_order}`}
            onChange={(event) => {
              const [sortBy, sortOrder] = event.target.value.split(":");
              setFilters({
                ...filters,
                sort_by: sortBy as JobListFilters["sort_by"],
                sort_order: sortOrder as JobListFilters["sort_order"],
              });
            }}
            className={selectControlClass}
          >
            <option value="updated_at:desc">更新时间降序</option>
            <option value="updated_at:asc">更新时间升序</option>
            <option value="match_score:desc">匹配分降序</option>
            <option value="match_score:asc">匹配分升序</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickFilters.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => applyQuickFilter(item.filter)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-orange-200 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFilters(defaultJobListFilters)}
        className="mt-4 h-10 w-full rounded-lg border border-[var(--color-border)] bg-white text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-slate-300 hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        重置筛选
      </button>
    </aside>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="grid gap-4 rounded-lg border border-[var(--color-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 lg:grid-cols-[auto_minmax(0,1fr)_220px] lg:items-start"
    >
      <ScoreRing score={job.match_score} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <MatchBadge level={job.match_level} />
          <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {formatTrackLabel(job.track)}
          </span>
        </div>
        <h2 className="mt-3 truncate text-lg font-semibold text-[var(--color-text-primary)]">
          {job.job_title || "未填写岗位名称"}
        </h2>
        <p className="mt-1 truncate text-sm text-[var(--color-text-secondary)]">
          {buildSubtitle(job)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills_extracted.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-[var(--color-surface-muted)] px-2 py-1 text-xs text-slate-600"
            >
              {skill}
            </span>
          ))}
          {job.skills_extracted.length === 0 ? (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
              待解析技能词
            </span>
          ) : null}
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--color-text-secondary)]">
          {buildJdPreview(job)}
        </p>
      </div>

      <div className="grid gap-3 rounded-lg bg-[var(--color-surface-muted)] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            当前状态
          </span>
          <StatusBadge status={job.status} />
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
            来源
          </p>
          <p className="mt-1 truncate text-sm font-medium text-[var(--color-text-primary)]">
            {buildSourceLabel(job)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
          <span className="text-xs text-[var(--color-text-secondary)]">
            下一步动作
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {getNextAction(job)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function JobsListClient() {
  const [filters, setFilters] = useState<JobListFilters>(defaultJobListFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilters(getJobListFiltersFromSearch(window.location.search));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let cancelled = false;

    async function loadJobs() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchJobs(filters);
        if (!cancelled) {
          setJobs(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "岗位列表加载失败",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [filters, ready]);

  const activeFilterCount = [
    filters.q,
    filters.city,
    filters.track,
    filters.match_level,
    filters.status,
    filters.status_group,
  ].filter(Boolean).length;
  const priorityJobs = jobs.filter(
    (job) => job.match_level === "priority_apply",
  ).length;
  const pendingJobs = jobs.filter(
    (job) => job.status === "pending_analysis",
  ).length;
  const interviewingJobs = jobs.filter(isInterviewing).length;
  const cityFilterOptions =
    filters.city && !cityOptions.includes(filters.city)
      ? [filters.city, ...cityOptions]
      : cityOptions;

  return (
    <section className="space-y-5">
      <PageHero
        breadcrumb="workspace / jobs"
        title="岗位决策队列"
        description="把所有岗位压成可排序、可筛选、可行动的队列，优先处理高匹配和待投递机会。"
        actions={
          <>
            <Link href="/sources" className={secondaryButtonClass}>
              打开入口库
            </Link>
            <Link href="/jobs/new" className={accentButtonClass}>
              粘贴 JD 解析
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          label="当前结果"
          value={loading ? "..." : jobs.length}
          description="受当前筛选条件影响"
          href="/jobs"
        />
        <InsightCard
          label="优先投递"
          value={loading ? "..." : priorityJobs}
          description="匹配等级为优先投递"
          href="/jobs?match_level=priority_apply&sort_by=match_score"
          tone="accent"
        />
        <InsightCard
          label="待分析"
          value={loading ? "..." : pendingJobs}
          description="需要先补齐 JD 解析"
          href="/jobs?status=pending_analysis"
          tone="amber"
        />
        <InsightCard
          label="面试中"
          value={loading ? "..." : interviewingJobs}
          description="一面、二面和 HR 面"
          href="/jobs?status_group=interviewing"
          tone="blue"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FilterDock
          activeFilterCount={activeFilterCount}
          cityFilterOptions={cityFilterOptions}
          filters={filters}
          setFilters={setFilters}
        />

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
                Job Stream
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                岗位流
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {loading ? "正在同步..." : `${jobs.length} 条岗位`}
            </p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-6 text-sm text-[var(--color-text-secondary)]">
              正在加载岗位列表...
            </div>
          ) : null}

          {!loading && jobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Empty Queue
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                当前没有可决策的岗位
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                先新增岗位或粘贴 JD
                解析，系统会提取技能、方向、薪资和匹配分，再进入这里排序处理。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/jobs/new" className={accentButtonClass}>
                  新增岗位
                </Link>
                <Link href="/jobs/new" className={secondaryButtonClass}>
                  粘贴 JD 解析
                </Link>
              </div>
            </div>
          ) : null}

          {jobs.length > 0 ? (
            <div className="grid gap-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
