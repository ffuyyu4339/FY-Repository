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
    return "暂无 JD 原文";
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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "时间未知";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
    <aside className="rounded-lg border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] p-3 backdrop-blur lg:sticky lg:top-20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
            筛选轨道
          </p>
          <h2 className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
            决策筛选
          </h2>
        </div>
        <span className="rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
          {activeFilterCount} 个
        </span>
      </div>

      <div className="mt-4 grid gap-2.5">
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        {quickFilters.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => applyQuickFilter(item.filter)}
            className="h-9 rounded-md border border-[var(--color-border)] bg-white px-2 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-orange-200 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFilters(defaultJobListFilters)}
        className="mt-3 h-10 w-full rounded-lg border border-[var(--color-border)] bg-transparent text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-slate-300 hover:bg-white hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        重置筛选
      </button>
    </aside>
  );
}

function MissionStrip({
  interviewingJobs,
  jobsLength,
  loading,
  pendingJobs,
  priorityJobs,
}: {
  interviewingJobs: number;
  jobsLength: number;
  loading: boolean;
  pendingJobs: number;
  priorityJobs: number;
}) {
  const metrics = [
    { label: "当前结果", value: jobsLength, tone: "text-[var(--color-ink)]" },
    {
      label: "优先投递",
      value: priorityJobs,
      tone: "text-[var(--color-accent)]",
    },
    { label: "待分析", value: pendingJobs, tone: "text-[var(--color-amber)]" },
    {
      label: "面试中",
      value: interviewingJobs,
      tone: "text-[var(--color-blue)]",
    },
  ];

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[rgba(255,255,255,0.74)] px-3 py-2.5 backdrop-blur">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-[var(--color-border)] py-2 last:border-b-0 sm:border-b-0 sm:border-r sm:px-3 sm:last:border-r-0"
          >
            <span className="truncate text-xs font-medium text-[var(--color-text-secondary)]">
              {metric.label}
            </span>
            <span
              className={cn(
                "text-2xl font-bold tabular-nums tracking-tight",
                metric.tone,
              )}
            >
              {loading ? "..." : metric.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DecisionBrief({ jobs, loading }: { jobs: Job[]; loading: boolean }) {
  const topPriority = jobs
    .filter((job) => job.match_level === "priority_apply")
    .sort((left, right) => right.match_score - left.match_score)
    .slice(0, 3);
  const pending = jobs.filter((job) => job.status === "pending_analysis");
  const nextFocus = topPriority[0] ?? pending[0] ?? jobs[0];

  return (
    <aside className="hidden rounded-lg border border-[var(--color-border)] bg-[rgba(255,255,255,0.74)] p-4 backdrop-blur xl:sticky xl:top-20 xl:block">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
        决策简报
      </p>
      <h2 className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
        下一轮处理
      </h2>

      {loading ? (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          正在整理队列...
        </p>
      ) : nextFocus ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-md border border-orange-200 bg-[var(--color-accent-soft)] p-3">
            <p className="text-xs font-semibold text-[var(--color-accent)]">
              优先看这个
            </p>
            <p className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--color-text-primary)]">
              {nextFocus.job_title || "未填写岗位名称"}
            </p>
            <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
              {nextFocus.company_name || "未填写公司"}
            </p>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--color-text-secondary)]">待解析</span>
              <span className="font-semibold text-[var(--color-amber)]">
                {pending.length}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--color-text-secondary)]">
                高分候选
              </span>
              <span className="font-semibold text-[var(--color-accent)]">
                {topPriority.length}
              </span>
            </div>
          </div>
          <Link
            href={`/jobs/${nextFocus.id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[var(--color-ink)] px-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          >
            进入处理
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">
          队列为空。先粘贴 JD，解析后这里会给出下一步处理建议。
        </p>
      )}
    </aside>
  );
}

function JobRow({ job }: { job: Job }) {
  const action = getNextAction(job);
  const isPriority =
    job.match_level === "priority_apply" || job.status === "ready_to_apply";

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group grid gap-3 border-b border-[var(--color-border)] bg-white/80 px-3 py-3 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:px-4 lg:grid-cols-[76px_minmax(0,1.2fr)_minmax(170px,0.45fr)_168px] lg:items-center",
        isPriority && "border-l-2 border-l-[var(--color-accent)]",
      )}
    >
      <div className="flex items-center gap-3 lg:block">
        <ScoreRing score={job.match_score} size="sm" />
        <span className="text-xs font-medium text-[var(--color-text-secondary)] lg:mt-2 lg:block lg:text-center">
          匹配分
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="min-w-0 truncate text-base font-semibold text-[var(--color-text-primary)]">
            {job.job_title || "未填写岗位名称"}
          </h2>
          <MatchBadge level={job.match_level} />
        </div>
        <p className="mt-1 truncate text-sm text-[var(--color-text-secondary)]">
          {buildSubtitle(job)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2 py-1 text-[11px] font-medium text-[var(--color-text-secondary)]">
            {formatTrackLabel(job.track)}
          </span>
          {job.skills_extracted.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-[var(--color-surface-muted)] px-2 py-1 text-[11px] text-slate-600"
            >
              {skill}
            </span>
          ))}
          {job.skills_extracted.length === 0 ? (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
              待解析技能词
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-1 text-xs leading-5 text-[var(--color-text-secondary)]">
          {buildJdPreview(job)}
        </p>
      </div>

      <div className="grid gap-2 text-sm lg:text-right">
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <StatusBadge status={job.status} />
          <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
            {buildSourceLabel(job)}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          更新 {formatDateTime(job.updated_at)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 lg:block">
        <span className="text-xs text-[var(--color-text-secondary)]">
          下一步
        </span>
        <span
          className={cn(
            "mt-0 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold transition lg:mt-2",
            isPriority
              ? "bg-[var(--color-accent)] text-white"
              : "bg-white text-[var(--color-accent)] group-hover:bg-[var(--color-accent-soft)]",
          )}
        >
          {action}
        </span>
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
    <section className="space-y-4">
      <PageHero
        breadcrumb="作战台 / 岗位"
        title="岗位决策队列"
        description="用一屏队列完成判断：先看匹配分、状态和下一步动作，再进入详情处理。"
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

      <MissionStrip
        interviewingJobs={interviewingJobs}
        jobsLength={jobs.length}
        loading={loading}
        pendingJobs={pendingJobs}
        priorityJobs={priorityJobs}
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)_260px]">
        <FilterDock
          activeFilterCount={activeFilterCount}
          cityFilterOptions={cityFilterOptions}
          filters={filters}
          setFilters={setFilters}
        />

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 backdrop-blur">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-secondary)]">
                岗位流
              </p>
              <h2 className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
                按下一步动作处理
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {loading ? "正在同步..." : `${jobs.length} 条岗位`}
            </p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-[var(--color-border)] bg-white/80 px-4 py-6 text-sm text-[var(--color-text-secondary)]">
              正在加载岗位列表...
            </div>
          ) : null}

          {!loading && jobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-[rgba(255,255,255,0.72)] p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent)]">
                空队列
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
            <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white/70">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          ) : null}
        </div>

        <DecisionBrief jobs={jobs} loading={loading} />
      </div>
    </section>
  );
}
