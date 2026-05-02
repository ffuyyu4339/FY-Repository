"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchJobs } from "@/lib/api";
import {
  defaultJobListFilters,
  formatMatchLevelLabel,
  formatStatusLabel,
  formatTrackLabel,
  getJobListFiltersFromSearch,
  matchLevelOptions,
  statusOptions,
  trackOptions,
  type Job,
  type JobListFilters,
  type MatchLevelValue,
  type StatusValue,
} from "@/lib/types";

const inputClass =
  "h-11 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

const selectClass =
  "h-11 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-orange-500/20";

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

const statusBadgeClass: Record<StatusValue, string> = {
  pending_analysis: "border-amber-200 bg-amber-50 text-amber-700",
  ready_to_apply: "border-orange-200 bg-orange-50 text-orange-700",
  applied: "border-sky-200 bg-sky-50 text-sky-700",
  online_test: "border-violet-200 bg-violet-50 text-violet-700",
  interview_1: "border-indigo-200 bg-indigo-50 text-indigo-700",
  interview_2: "border-indigo-200 bg-indigo-50 text-indigo-700",
  hr_interview: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  offer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

const matchBadgeClass: Record<MatchLevelValue, string> = {
  priority_apply: "border-emerald-200 bg-emerald-50 text-emerald-700",
  apply: "border-sky-200 bg-sky-50 text-sky-700",
  stretch: "border-amber-200 bg-amber-50 text-amber-700",
  ignore: "border-slate-200 bg-slate-100 text-slate-600",
};

function SearchIcon() {
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

  return normalized.length > 86 ? `${normalized.slice(0, 86)}...` : normalized;
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
  const sortLabel = filters.sort_by === "match_score" ? "匹配分" : "更新时间";
  const cityFilterOptions =
    filters.city && !cityOptions.includes(filters.city)
      ? [filters.city, ...cityOptions]
      : cityOptions;

  function applyQuickFilter(filter: Partial<JobListFilters>) {
    setFilters({
      ...defaultJobListFilters,
      ...filter,
      sort_order: filter.sort_order ?? "desc",
    });
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-5 border-b border-slate-200 pb-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            workspace / jobs
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            岗位列表
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            汇总岗位、筛选方向、排序匹配分，把下一次投递决策压缩到一个页面里。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm">
              当前结果
              <span className="ml-1.5 font-semibold text-slate-950">
                {loading ? "..." : jobs.length}
              </span>
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs text-orange-700">
              优先投递
              <span className="ml-1.5 font-semibold">
                {loading ? "..." : priorityJobs}
              </span>
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
              待分析
              <span className="ml-1.5 font-semibold">
                {loading ? "..." : pendingJobs}
              </span>
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">录入入口</p>
          <div className="mt-3 grid gap-2">
            <Link
              href="/sources"
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-[var(--color-accent)]"
            >
              招聘网页来源
              <span className="text-xs text-slate-400">打开</span>
            </Link>
            <Link
              href="/jobs/new"
              className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
            >
              粘贴 JD 解析
              <span className="text-xs text-white/70">新增</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
            <input
              value={filters.q}
              onChange={(event) =>
                setFilters({ ...filters, q: event.target.value })
              }
              placeholder="搜索岗位、公司、技能关键词"
              className={`${inputClass} pl-10`}
            />
          </div>
          <Link
            href="/jobs/new"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f350c]"
          >
            新增岗位
          </Link>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <select
            value={filters.city}
            onChange={(event) =>
              setFilters({ ...filters, city: event.target.value })
            }
            className={selectClass}
          >
            <option value="">全部城市</option>
            {cityFilterOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={filters.track}
            onChange={(event) =>
              setFilters({ ...filters, track: event.target.value })
            }
            className={selectClass}
          >
            <option value="">全部方向</option>
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.match_level}
            onChange={(event) =>
              setFilters({ ...filters, match_level: event.target.value })
            }
            className={selectClass}
          >
            <option value="">全部匹配等级</option>
            {matchLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters({
                ...filters,
                status: event.target.value,
                status_group: "",
              })
            }
            className={selectClass}
          >
            <option value="">全部状态</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            className={selectClass}
          >
            <option value="updated_at:desc">更新时间降序</option>
            <option value="updated_at:asc">更新时间升序</option>
            <option value="match_score:desc">匹配分降序</option>
            <option value="match_score:asc">匹配分升序</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => applyQuickFilter(item.filter)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[var(--color-accent)]"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              已启用 {activeFilterCount} 个筛选 · 按{sortLabel}
              {filters.sort_order === "desc" ? "降序" : "升序"}
            </span>
            <button
              type="button"
              onClick={() => setFilters(defaultJobListFilters)}
              className="font-medium text-slate-700 transition hover:text-[var(--color-accent)]"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">
          正在加载岗位列表...
        </div>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[var(--color-accent)]">
            EMPTY STATE
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            还没有可展示的岗位记录
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            先新增一条岗位并粘贴
            JD，系统会提取技能、方向、薪资和匹配分；后续这里会变成你的投递队列。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/jobs/new"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
            >
              新增第一条岗位
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              查看统计面板
            </Link>
          </div>
        </div>
      ) : null}

      {jobs.length > 0 ? (
        <div className="grid gap-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md lg:grid-cols-[minmax(0,1fr)_260px_96px] lg:items-start"
            >
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-slate-950">
                  {job.job_title || "未填写岗位名称"}
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {buildSubtitle(job)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {formatTrackLabel(job.track)}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${matchBadgeClass[job.match_level]}`}
                  >
                    {formatMatchLevelLabel(job.match_level)}
                  </span>
                  {job.skills_extracted.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    来源网页
                  </span>
                  <span className="truncate rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-500 ring-1 ring-slate-200">
                    {buildSourceLabel(job)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                  {buildJdPreview(job)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 lg:min-w-24 lg:flex-col lg:items-end">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[job.status]}`}
                >
                  {formatStatusLabel(job.status)}
                </span>
                <div className="text-right">
                  <p className="text-2xl font-bold tracking-tight text-slate-950">
                    {job.match_score}
                  </p>
                  <p className="text-xs text-slate-500">匹配分</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
