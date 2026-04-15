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
          setError(loadError instanceof Error ? loadError.message : "岗位列表加载失败");
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

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">
              /jobs
            </p>
            <h1 className="mt-3 text-3xl font-semibold">岗位列表</h1>
            <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
              支持关键词、城市、方向、匹配等级、状态筛选，以及按匹配分或更新时间排序。
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-center font-medium text-white"
          >
            新增岗位
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={filters.q}
            onChange={(event) => setFilters({ ...filters, q: event.target.value })}
            placeholder="关键词搜索"
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
          <input
            value={filters.city}
            onChange={(event) => setFilters({ ...filters, city: event.target.value })}
            placeholder="城市筛选"
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
          <select
            value={filters.track}
            onChange={(event) => setFilters({ ...filters, track: event.target.value })}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
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
            onChange={(event) => setFilters({ ...filters, match_level: event.target.value })}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
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
            onChange={(event) => setFilters({ ...filters, status: event.target.value })}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
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
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
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
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 font-medium"
          >
            重置筛选
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-6 text-sm text-[var(--color-muted)]">
          正在加载岗位列表...
        </div>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-6 text-sm text-[var(--color-muted)]">
          当前没有符合条件的岗位，先去新增一条记录吧。
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{job.company_name || "未填写公司"}</p>
                <h2 className="mt-1 text-xl font-semibold">{job.job_title || "未填写岗位名称"}</h2>
              </div>
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-sm font-medium text-[var(--color-accent)]">
                {job.match_score} 分
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
              <span className="rounded-full border border-[var(--color-line)] px-3 py-1">
                {job.city || "未知城市"}
              </span>
              <span className="rounded-full border border-[var(--color-line)] px-3 py-1">
                {formatTrackLabel(job.track)}
              </span>
              <span className="rounded-full border border-[var(--color-line)] px-3 py-1">
                {formatMatchLevelLabel(job.match_level)}
              </span>
              <span className="rounded-full border border-[var(--color-line)] px-3 py-1">
                {formatStatusLabel(job.status)}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {job.skills_extracted.length > 0
                ? `技能：${job.skills_extracted.join(" / ")}`
                : "尚未提取技能关键词"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
