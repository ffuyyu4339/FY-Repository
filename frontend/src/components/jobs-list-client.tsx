"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchJobs } from "@/lib/api";
import {
  formatMatchLevelLabel,
  formatStatusLabel,
  formatTrackLabel,
  matchLevelOptions,
  statusOptions,
  trackOptions,
  type Job,
  type JobListFilters,
} from "@/lib/types";

const initialFilters: JobListFilters = {
  q: "",
  city: "",
  track: "",
  match_level: "",
  status: "",
  sort_by: "updated_at",
  sort_order: "desc",
};

const inputClass =
  "h-11 rounded-xl border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-4 focus:ring-orange-100";

const selectClass =
  "h-11 rounded-xl border border-[var(--color-line)] bg-white px-3.5 text-sm text-[var(--color-ink)] outline-none transition hover:border-slate-300 focus:border-[var(--color-accent)] focus:ring-4 focus:ring-orange-100";

export function JobsListClient() {
  const [filters, setFilters] = useState<JobListFilters>(initialFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [filters]);

  const activeFilterCount = [
    filters.q,
    filters.city,
    filters.track,
    filters.match_level,
    filters.status,
  ].filter(Boolean).length;
  const priorityJobs = jobs.filter(
    (job) => job.match_level === "priority_apply",
  ).length;
  const pendingJobs = jobs.filter(
    (job) => job.status === "pending_analysis",
  ).length;
  const sortLabel = filters.sort_by === "match_score" ? "匹配分" : "更新时间";

  return (
    <section className="space-y-5">
      <div className="grid gap-5 border-b border-[var(--color-line)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            workspace / jobs
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            岗位列表
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            汇总岗位、筛选方向、排序匹配分，把下一次投递决策压缩到一个页面里。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-full border border-[var(--color-line)] bg-white/75 px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-slate-300 hover:text-[var(--color-ink)]"
          >
            查看统计
          </Link>
          <Link
            href="/jobs/new"
            className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
          >
            新增岗位
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="rounded-full border border-[var(--color-line)] bg-white/80 px-3 py-2 text-sm">
          <span className="text-[var(--color-muted)]">当前结果</span>
          <span className="ml-2 font-semibold">
            {loading ? "..." : jobs.length}
          </span>
        </div>
        <div className="rounded-full border border-[var(--color-line)] bg-white/80 px-3 py-2 text-sm">
          <span className="text-[var(--color-muted)]">优先投递</span>
          <span className="ml-2 font-semibold">
            {loading ? "..." : priorityJobs}
          </span>
        </div>
        <div className="rounded-full border border-[var(--color-line)] bg-white/80 px-3 py-2 text-sm">
          <span className="text-[var(--color-muted)]">待分析</span>
          <span className="ml-2 font-semibold">
            {loading ? "..." : pendingJobs}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">筛选条件</h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              已启用 {activeFilterCount} 个筛选，当前按{sortLabel}
              {filters.sort_order === "desc" ? "降序" : "升序"}排列。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="h-9 rounded-full border border-[var(--color-line)] bg-white px-3 text-sm font-medium text-[var(--color-muted)] transition hover:border-slate-300 hover:text-[var(--color-ink)]"
          >
            重置
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={filters.q}
            onChange={(event) =>
              setFilters({ ...filters, q: event.target.value })
            }
            placeholder="关键词搜索"
            className={inputClass}
          />
          <input
            value={filters.city}
            onChange={(event) =>
              setFilters({ ...filters, city: event.target.value })
            }
            placeholder="城市筛选"
            className={inputClass}
          />
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
              setFilters({ ...filters, status: event.target.value })
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
            value={filters.sort_by}
            onChange={(event) =>
              setFilters({
                ...filters,
                sort_by: event.target.value as JobListFilters["sort_by"],
              })
            }
            className={selectClass}
          >
            <option value="updated_at">按更新时间</option>
            <option value="match_score">按匹配分</option>
          </select>
          <select
            value={filters.sort_order}
            onChange={(event) =>
              setFilters({
                ...filters,
                sort_order: event.target.value as JobListFilters["sort_order"],
              })
            }
            className={selectClass}
          >
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>
          <Link
            href="/jobs/new"
            className="flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#9f350c]"
          >
            新增岗位
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-6 text-sm text-[var(--color-muted)]">
          正在加载岗位列表...
        </div>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <div className="grid gap-5 rounded-2xl border border-dashed border-slate-300 bg-white/75 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.04)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium text-[var(--color-accent)]">
              EMPTY STATE
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              还没有可展示的岗位记录
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
              先新增一条岗位并粘贴
              JD，系统会提取技能、方向、薪资和匹配分；后续这里会变成你的投递队列。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/jobs/new"
                className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
              >
                新增第一条岗位
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              >
                查看统计面板
              </Link>
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            {["收集岗位 JD", "解析结构化字段", "按匹配分排序投递"].map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-semibold text-[var(--color-accent)]">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}

      {jobs.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/85 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="grid gap-3 border-b border-[var(--color-line)] px-4 py-4 transition last:border-b-0 hover:bg-[var(--color-accent-soft)]/45 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <p className="text-xs text-[var(--color-muted)]">
                  {job.company_name || "未填写公司"} · {job.city || "未知城市"}
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  {job.job_title || "未填写岗位名称"}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-muted)]">
                  <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1">
                    {formatTrackLabel(job.track)}
                  </span>
                  <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1">
                    {formatMatchLevelLabel(job.match_level)}
                  </span>
                  <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1">
                    {formatStatusLabel(job.status)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-accent)]">
                  {job.match_score} 分
                </span>
                <p className="max-w-sm truncate text-xs text-[var(--color-muted)]">
                  {job.skills_extracted.length > 0
                    ? job.skills_extracted.join(" / ")
                    : "尚未提取技能关键词"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
